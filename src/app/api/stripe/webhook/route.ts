import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendBookingConfirmation } from '@/lib/email/sendBookingConfirmation'
import { sendAdminBookingNotification } from '@/lib/email/sendAdminBookingNotification'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)

    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    )
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any

      const bookingId = session.metadata?.booking_id

      if (!bookingId) {
        console.error('No booking_id found in Stripe session metadata')
        return NextResponse.json(
          { error: 'Missing booking_id metadata' },
          { status: 400 }
        )
      }

      const { error } = await supabaseAdmin
        .from('bookings')
        .update({
          status: 'paid',
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
        })
        .eq('id', bookingId)

      if (error) {
        console.error('Failed to update booking status:', error)

        return NextResponse.json(
          { error: 'Failed to update booking' },
          { status: 500 }
        )
      }

      const { data: confirmedBooking, error: confirmedBookingError } = await supabaseAdmin
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
        .eq('id', bookingId)
        .single()

      if (confirmedBookingError || !confirmedBooking) {
        console.error('Failed to fetch confirmed booking for email:', confirmedBookingError)
      } else {
        try {
          await sendBookingConfirmation(confirmedBooking)
        } catch (emailError) {
          console.error('Failed to send booking confirmation email:', emailError)
        }

        try {
          await sendAdminBookingNotification(confirmedBooking)
        } catch (adminEmailError) {
          console.error('Failed to send admin booking notification email:', adminEmailError)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
