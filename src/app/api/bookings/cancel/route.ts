import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { sendCancellationEmail } from '@/lib/email/sendCancellationEmail'
import { sendAdminCancellationNotification } from '@/lib/email/sendAdminCancellationNotification'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const calculateRefund = (travelDate: string, price: number) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const departure = new Date(travelDate)
  departure.setHours(0, 0, 0, 0)

  const diffMs = departure.getTime() - today.getTime()
  const daysBeforeDeparture = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  let cancellationFeeRate = 1

  if (daysBeforeDeparture >= 21) {
    cancellationFeeRate = 0.1
  } else if (daysBeforeDeparture >= 14) {
    cancellationFeeRate = 0.3
  } else if (daysBeforeDeparture >= 8) {
    cancellationFeeRate = 0.5
  } else {
    cancellationFeeRate = 1
  }

  const cancellationFee = Math.round(price * cancellationFeeRate)
  const refundAmount = Math.max(price - cancellationFee, 0)

  return {
    daysBeforeDeparture,
    cancellationFee,
    refundAmount,
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, reason } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing bookingId' },
        { status: 400 }
      )
    }

    if (!reason) {
      return NextResponse.json(
        { error: 'Cancellation reason is required' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isOwner = booking.user_id === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Not allowed to cancel this booking' },
        { status: 403 }
      )
    }

    const refundOverride = body.refundOverride || 'policy'

    if (refundOverride === 'full' && !isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can issue full refund overrides' },
        { status: 403 }
      )
    }

    if (booking.status !== 'paid') {
      return NextResponse.json(
        { error: 'Only paid bookings can be refunded automatically' },
        { status: 400 }
      )
    }

    if (!booking.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: 'Missing Stripe payment intent ID' },
        { status: 400 }
      )
    }

    let cancellationFee
    let refundAmount

    if (refundOverride === 'full') {
      cancellationFee = 0
      refundAmount = Number(booking.price)
    } else {
      const calculated = calculateRefund(
        booking.travel_date,
        Number(booking.price)
      )

      cancellationFee = calculated.cancellationFee
      refundAmount = calculated.refundAmount
    }

    let stripeRefundId = null
    let refundedAt = null
    let refundedBy = null

    if (refundAmount > 0) {
      const refund = await stripe.refunds.create({
        payment_intent: booking.stripe_payment_intent_id,
        amount: refundAmount,
        metadata: {
          booking_id: booking.id,
          cancelled_by: user.id,
        },
      })

      stripeRefundId = refund.id
      refundedAt = new Date().toISOString()
      refundedBy = user.id
    }

    const finalStatus = refundAmount > 0 ? 'refunded' : 'cancelled'

    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: finalStatus,
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id,
        refund_amount: refundAmount,
        cancellation_fee: cancellationFee,
        stripe_refund_id: stripeRefundId,
        refunded_at: refundedAt,
        refunded_by: refundedBy,
      })
      .eq('id', booking.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update booking after cancellation' },
        { status: 500 }
      )
    }

    const { data: emailBooking, error: emailBookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        routes (
          from_location,
          to_location
        ),
        from_stop:stops!bookings_from_stop_id_fkey (
          name
        ),
        to_stop:stops!bookings_to_stop_id_fkey (
          name
        )
      `)
      .eq('id', booking.id)
      .single()

    if (emailBookingError || !emailBooking) {
      console.error('Failed to fetch confirmed booking for email:', emailBookingError)
    } else {
      try {
        await sendCancellationEmail(emailBooking)
      } catch (emailError) {
        console.error('Failed to send customer cancellation email:', emailError)
      }

      try {
        await sendAdminCancellationNotification(emailBooking)
      } catch (emailError) {
        console.error('Failed to send admin cancellation email:', emailError)
      }
    }

    return NextResponse.json({
      booking: updatedBooking,
      refundAmount,
      cancellationFee,
      status: finalStatus,
    })
  } catch (error) {
    console.error('Cancel booking error:', error)

    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
