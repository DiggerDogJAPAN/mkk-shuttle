import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing bookingId' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized user or missing email' }, { status: 401 })
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
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

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: 'Booking is not pending payment' },
        { status: 400 }
      )
    }

    const SEASON_START = '2026-12-15'
    const SEASON_END = '2027-03-31'
    if (booking.travel_date < SEASON_START || booking.travel_date > SEASON_END) {
      return NextResponse.json(
        { error: 'Bookings are currently available from December 15, 2026 to March 31, 2027.' },
        { status: 400 }
      )
    }

    if (!booking.price || booking.price <= 0) {
      return NextResponse.json(
        { error: 'Invalid booking price' },
        { status: 400 }
      )
    }

    if (booking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized booking access' },
        { status: 401 }
      )
    }

    const { error: enforceEmailError } = await supabaseAdmin
      .from('bookings')
      .update({ email: user.email })
      .eq('id', booking.id)

    if (enforceEmailError) {
      console.error('Failed to enforce user email:', enforceEmailError)
      return NextResponse.json(
        { error: 'Failed to update booking email' },
        { status: 500 }
      )
    }

    booking.email = user.email

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: booking.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'jpy',
            unit_amount: booking.price,
            product_data: {
              name: `${booking.routes?.from_location} to ${booking.routes?.to_location}`,
              description: `${booking.travel_date} ${booking.departure_time?.slice(0, 5)} | ${booking.from_stop?.name} to ${booking.to_stop?.name}`,
            },
          },
        },
      ],
      metadata: {
        booking_id: booking.id,
      },
      success_url: `${origin}/booking-success?booking_id=${booking.id}`,
      cancel_url: `${origin}/booking-cancelled?booking_id=${booking.id}`,
    })

    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        stripe_session_id: session.id,
      })
      .eq('id', booking.id)

    if (updateError) {
      console.error('Failed to update booking with Stripe session:', updateError)

      return NextResponse.json(
        { error: 'Failed to update booking with Stripe session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Create checkout session error:', error)

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
