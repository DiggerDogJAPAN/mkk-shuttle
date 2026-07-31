import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { resolveJourneyPrice } from '@/lib/utils/pricing'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { bookingPayload } = await request.json()

    if (!bookingPayload || !bookingPayload.from_stop_id || !bookingPayload.to_stop_id || !bookingPayload.schedule_id || !bookingPayload.route_id) {
      return NextResponse.json(
        { error: 'Missing booking payload details' },
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

    const SEASON_START = '2026-12-15'
    const SEASON_END = '2027-03-31'
    if (bookingPayload.travel_date < SEASON_START || bookingPayload.travel_date > SEASON_END) {
      return NextResponse.json(
        { error: 'Bookings are currently available from December 15, 2026 to March 31, 2027.' },
        { status: 400 }
      )
    }

    // Validate route and schedule
    const { data: routeData, error: routeError } = await supabaseAdmin
      .from('routes')
      .select('id')
      .eq('id', bookingPayload.route_id)
      .single()

    if (routeError || !routeData) {
      return NextResponse.json({ error: 'Invalid route' }, { status: 400 })
    }

    const { data: scheduleData, error: scheduleError } = await supabaseAdmin
      .from('route_schedules')
      .select('id, route_id')
      .eq('id', bookingPayload.schedule_id)
      .eq('route_id', bookingPayload.route_id)
      .single()

    if (scheduleError || !scheduleData) {
      return NextResponse.json({ error: 'Invalid schedule for this route' }, { status: 400 })
    }

    // Validate stops
    const { data: stopsData, error: stopsError } = await supabaseAdmin
      .from('schedule_stops')
      .select('stop_id, stop_order')
      .eq('schedule_id', bookingPayload.schedule_id)
      .in('stop_id', [bookingPayload.from_stop_id, bookingPayload.to_stop_id])

    if (stopsError || !stopsData || stopsData.length !== 2) {
      return NextResponse.json({ error: 'Invalid stops for this schedule' }, { status: 400 })
    }

    const fromStop = stopsData.find(s => s.stop_id === bookingPayload.from_stop_id)
    const toStop = stopsData.find(s => s.stop_id === bookingPayload.to_stop_id)

    if (!fromStop || !toStop || fromStop.stop_order >= toStop.stop_order) {
      return NextResponse.json({ error: 'Invalid stop order' }, { status: 400 })
    }

    // Validate blackout dates / availability
    const { data: blockedData } = await supabaseAdmin
      .from('availability')
      .select('route_id, schedule_id')
      .eq('date', bookingPayload.travel_date)
      .eq('is_available', false)

    if (blockedData) {
      const isBlocked = blockedData.some(b => 
        b.schedule_id === bookingPayload.schedule_id || 
        (!b.schedule_id && b.route_id === bookingPayload.route_id)
      )
      if (isBlocked) {
        return NextResponse.json({ error: 'Selected date is blocked for this route/schedule' }, { status: 400 })
      }
    }

    // Server-side price validation
    const pricingResult = await resolveJourneyPrice({
      supabase: supabaseAdmin,
      scheduleId: bookingPayload.schedule_id,
      fromStopId: bookingPayload.from_stop_id,
      toStopId: bookingPayload.to_stop_id,
    })

    if (!pricingResult) {
      return NextResponse.json(
        { error: 'No price is configured for this journey.' },
        { status: 400 }
      )
    }

    if (!bookingPayload.passengers || bookingPayload.passengers < 1) {
      return NextResponse.json(
        { error: 'Invalid passenger count' },
        { status: 400 }
      )
    }

    const serverTotalPrice = pricingResult.pricePerPassenger * bookingPayload.passengers

    if (serverTotalPrice <= 0) {
      return NextResponse.json(
        { error: 'Invalid calculated booking price' },
        { status: 400 }
      )
    }

    // Override payload with trusted server data
    const finalBookingPayload = {
      ...bookingPayload,
      user_id: user.id,
      email: user.email,
      price: serverTotalPrice,
      status: 'pending'
    }

    // Insert booking securely on the server
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert(finalBookingPayload)
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
      .single()

    if (bookingError || !booking) {
      console.error('Failed to create booking:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    let session
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: booking.email || undefined,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'jpy',
              unit_amount: serverTotalPrice,
              product_data: {
                name: `${booking.routes?.from_location} to ${booking.routes?.to_location}`,
                description: `${booking.travel_date} ${booking.departure_time?.slice(0, 5)} | ${booking.from_stop?.name} to ${booking.to_stop?.name}`,
              },
            },
          },
        ],
        metadata: {
          booking_id: booking.id,
          pricing_type: pricingResult.pricingType,
          price_per_passenger: pricingResult.pricePerPassenger.toString(),
        },
        success_url: `${origin}/booking-success?booking_id=${booking.id}`,
        cancel_url: `${origin}/booking-cancelled?booking_id=${booking.id}`,
      })
    } catch (stripeError) {
      console.error('Stripe session creation failed:', stripeError)
      // Rollback booking
      await supabaseAdmin.from('bookings').delete().eq('id', booking.id)
      return NextResponse.json(
        { error: 'Failed to initialize payment. Please try again.' },
        { status: 500 }
      )
    }

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
