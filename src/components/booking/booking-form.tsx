'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { BookingSummarySidebar } from './booking-summary-sidebar'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { ArrowRight, Info, ShieldCheck, Snowflake, MapPin, Languages, Mountain, Clock, Plane, Cloud, Mail } from 'lucide-react'

const ADVANCE_BOOKING_DAYS = 13

function getEarliestBookingDate() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const earliestDate = new Date(today)
  earliestDate.setDate(today.getDate() + ADVANCE_BOOKING_DAYS)

  return earliestDate
}

function isBeforeEarliestBookingDate(dateStr: string) {
  if (!dateStr) return false
  // Parse the YYYY-MM-DD locally to avoid timezone shifts
  const [year, month, day] = dateStr.split('-').map(Number)
  const selectedDate = new Date(year, month - 1, day)
  selectedDate.setHours(0, 0, 0, 0)

  return selectedDate < getEarliestBookingDate()
}

function getEarliestBookingDateString() {
  const d = getEarliestBookingDate()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const SEASON_START = '2026-12-15'
const SEASON_END = '2027-03-31'

export function BookingForm() {
  const router = useRouter()
  const [routes, setRoutes] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [stops, setStops] = useState<any[]>([])
  const [departure, setDeparture] = useState<any>(null)
  const [arrival, setArrival] = useState<any>(null)
  const [price, setPrice] = useState<number | null>(null)
  const [travelDate, setTravelDate] = useState('')
  const [blockedScheduleIds, setBlockedScheduleIds] = useState<string[]>([])
  const [blockedRouteIds, setBlockedRouteIds] = useState<string[]>([])
  const [bookingLoading, setBookingLoading] = useState(false)

  const [passengers, setPassengers] = useState(1)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [passportNumber, setPassportNumber] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [flightNumber, setFlightNumber] = useState('')
  const [hotelName, setHotelName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [country, setCountry] = useState('')

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedRefundPolicy, setAcceptedRefundPolicy] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('routes')
        .select(`
          *,
          route_schedules (
            *,
            schedule_stops (
              stop:stops (*)
            )
          )
        `)

      setRoutes(data || [])
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchPrice = async () => {
      if (!departure || !arrival) {
        setPrice(null)
        return
      }

      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .eq('from_stop_id', departure.id)
        .eq('to_stop_id', arrival.id)
        .single()

      if (data) {
        setPrice(data.price)
      } else {
        setPrice(null)
      }
    }

    fetchPrice()
  }, [departure, arrival])

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!travelDate) {
        setBlockedScheduleIds([])
        setBlockedRouteIds([])
        return
      }

      const { data } = await supabase
        .from('availability')
        .select('*')
        .eq('date', travelDate)
        .eq('is_available', false)

      if (!data) {
        setBlockedScheduleIds([])
        setBlockedRouteIds([])
        return
      }

      const blockedSchedules = data
        .filter((item) => item.schedule_id)
        .map((item) => item.schedule_id)

      const blockedRoutes = data
        .filter((item) => !item.schedule_id)
        .map((item) => item.route_id)

      setBlockedScheduleIds(blockedSchedules)
      setBlockedRouteIds(blockedRoutes)
    }

    fetchAvailability()
  }, [travelDate])

  const formatTime = (time: string) => time.slice(0, 5)

  const handleScheduleSelect = (schedule: any) => {
    setSelectedSchedule(schedule)

    const sortedStops = schedule.schedule_stops
      .map((s: any) => s.stop)
      .sort((a: any, b: any) => a.stop_order - b.stop_order)

    setStops(sortedStops)
    setDeparture(null)
    setArrival(null)
  }

  const validArrivalStops = stops.filter(
    (s) => departure && s.stop_order > departure.stop_order
  )

  const totalPrice = price
    ? price * passengers
    : 0

  const handleBooking = async () => {
    try {
      setBookingLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const user = session?.user

      if (!user || !user.email) {
        alert('Please log in first to complete your booking. A valid account email is required.')
        router.push('/login')
        return
      }

      if (isBeforeEarliestBookingDate(travelDate)) {
        alert('Please select a travel date at least 13 days from today.')
        setBookingLoading(false)
        return
      }

      if (travelDate < SEASON_START || travelDate > SEASON_END) {
        alert('Bookings are currently available from December 15, 2026 to March 31, 2027.')
        setBookingLoading(false)
        return
      }

      if (
        !selectedRoute ||
        !selectedSchedule ||
        !departure ||
        !arrival ||
        !price
      ) {
        alert('Please complete booking selections')
        return
      }

      const bookingId = crypto.randomUUID()

      const bookingPayload = {
        id: bookingId,
        user_id: user.id,
        route_id: selectedRoute.id,
        schedule_id: selectedSchedule.id,
        travel_date: travelDate,
        from_stop_id: departure.id,
        to_stop_id: arrival.id,
        departure_time: selectedSchedule.departure_time,
        passengers,
        price: totalPrice,
        first_name: firstName,
        last_name: lastName,
        passport_number: passportNumber,
        email,
        phone,
        flight_number: flightNumber,
        hotel_name: hotelName,
        date_of_birth: dateOfBirth,
        country,
        free_tickets: false,
        accepted_terms: acceptedTerms,
        accepted_refund_policy: acceptedRefundPolicy,
        status: 'pending',
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingPayload)
        .select()

      if (error) {
        alert('Booking failed. Please try again.')
        return
      }

      const newBooking = data?.[0]

      if (!newBooking?.id) {
        alert('Booking created but booking ID was not returned')
        return
      }

      const checkoutResponse = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          bookingId: newBooking.id,
        }),
      })

      const checkoutData = await checkoutResponse.json()

      if (!checkoutResponse.ok) {
        console.error('Checkout session failed:', checkoutData)
        alert(checkoutData.error || 'Failed to start payment')
        return
      }

      if (!checkoutData.url) {
        alert('Stripe checkout URL was not returned')
        return
      }

      window.location.href = checkoutData.url
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* Left Side: Booking Form */}
      <div className="w-full lg:w-[70%]">
        <form 
          className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-12"
          onSubmit={(e) => {
            e.preventDefault()
            handleBooking()
          }}
        >
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Journey Details</h2>
            <div className="mt-2 mb-6 text-sm text-slate-500">
              <a
                href="/login"
                className="underline hover:text-slate-900 transition-colors"
              >
                Log in
              </a>{' '}
              before booking. Don’t have an account?{' '}
              <a
                href="/signup"
                className="underline hover:text-slate-900 transition-colors"
              >
                Sign up
              </a>
            </div>
            
            <div className="space-y-6">
              {/* Travel Date */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  min={getEarliestBookingDateString() > SEASON_START ? getEarliestBookingDateString() : SEASON_START}
                  max={SEASON_END}
                  onChange={(e) => {
                    setTravelDate(e.target.value)
                    setSelectedRoute(null)
                    setSelectedSchedule(null)
                    setStops([])
                    setDeparture(null)
                    setArrival(null)
                    setPrice(null)
                  }}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900"
                  required
                />
                <p className="text-xs text-slate-500 font-medium ml-1">
                  Bookings must be made at least 13 days in advance.
                </p>
              </div>

              {/* Route */}
              {travelDate && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                    Service Route
                  </label>
                  <select
                    onChange={(e) => {
                      const route = routes.find(r => r.id === e.target.value)
                      setSelectedRoute(route)
                      setSelectedSchedule(null)
                      setStops([])
                    }}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 appearance-none"
                    required
                  >
                    <option value="">Select Route</option>
                    {routes
                      .filter((r) => !blockedRouteIds.includes(r.id))
                      .map((r) => (
                      <option key={r.id} value={r.id}>
                        {`${r.from_location} to ${r.to_location}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Schedule */}
              {selectedRoute && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                    Departure Time
                  </label>
                  <select
                    onChange={(e) => {
                      const schedule = selectedRoute.route_schedules.find((s: any) => s.id === e.target.value)
                      handleScheduleSelect(schedule)
                    }}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 appearance-none"
                    required
                  >
                    <option value="">Select Time</option>
                    {selectedRoute.route_schedules
                      .filter((s: any) => !blockedScheduleIds.includes(s.id))
                      .map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {formatTime(s.departure_time)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pickup Point */}
              {stops.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                    Pickup Point
                  </label>
                  <select
                    onChange={(e) => {
                      const stop = stops.find(s => s.id === e.target.value)
                      setDeparture(stop)
                      setArrival(null)
                    }}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 appearance-none"
                    required
                  >
                    <option value="">Select Departure</option>
                    {stops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Drop-off Point */}
              {departure && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                    Drop-off Point
                  </label>
                  <select
                    onChange={(e) => {
                      const stop = stops.find(s => s.id === e.target.value)
                      setArrival(stop)
                    }}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 appearance-none"
                    required
                  >
                    <option value="">Select Arrival</option>
                    {validArrivalStops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Passengers */}
              {price && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                    Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 appearance-none"
                  >
                    {[1,2,3,4,5,6,7,8].map((n) => (
                      <option key={n} value={n}>
                        {n} Passenger{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Error States */}
          {arrival && !price && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600">
              <div className="p-1.5 rounded-lg bg-white shadow-sm">
                <Info className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold">This specific route combination is currently unavailable.</p>
            </div>
          )}

          {/* Customer Details */}
          {price && (
            <div className="pt-12 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Customer Details</h2>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    readOnly
                    className="w-full h-14 px-6 rounded-2xl bg-slate-100 border-none focus:ring-0 font-medium text-slate-500 cursor-not-allowed"
                    required
                  />
                  <p className="text-[10px] text-slate-400 font-medium ml-1">
                    Booking confirmations will be sent to your account email.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Passport Number</label>
                  <input
                    type="text"
                    placeholder="Passport Number"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Flight Number</label>
                  <input
                    type="text"
                    placeholder="Flight Number"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Hotel in Myoko</label>
                  <input
                    type="text"
                    placeholder="Hotel in Myoko"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
                <div className="space-y-2 xl:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Country</label>
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Agreements */}
          {price && (
            <div className="pt-12 border-t border-slate-100 space-y-8">
              {/* Cancellation Policy Preview */}
              <div className="bg-slate-50/50 rounded-3xl p-6 md:p-8 border border-slate-100/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                      <Info className="w-5 h-5" />
                    </span>
                    Cancellation & Refund Policy
                  </h3>
                  <a 
                    href="/terms-conditions#cancellations-and-refunds" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline"
                  >
                    Full Terms
                  </a>
                </div>

                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Cancellation fees apply based on the schedule below. Travel times may also be affected by weather conditions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { days: "21+ Days Before", fee: "10% Fee" },
                    { days: "20–14 Days Before", fee: "30% Fee" },
                    { days: "13–8 Days Before", fee: "50% Fee" },
                    { days: "7 Days / No-show", fee: "100% Fee" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                      <span className="text-xs font-bold text-slate-500">{item.days}</span>
                      <span className="text-xs font-black text-slate-900">{item.fee}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[10px] font-medium text-slate-400 italic">
                    Refunds are processed according to this schedule.
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Questions? <a href="/faq" className="text-primary hover:underline">Contact Us</a>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-4 group cursor-pointer">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Terms and Conditions</a>
                  </span>
                </label>

                <label className="flex items-start gap-4 group cursor-pointer">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptedRefundPolicy}
                      onChange={(e) => setAcceptedRefundPolicy(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">
                    I understand the{" "}
                    <a href="/terms-conditions#cancellations-and-refunds" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">refund policy</a>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Important Payment Notice */}
          {price && (
            <div className="pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 shadow-sm">
                <div className="flex-shrink-0 mt-0.5">
                  <Info className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-amber-900">Important</h4>
                  <div className="text-sm text-amber-800 space-y-2 leading-relaxed font-medium">
                    <p>
                      After completing your payment, please remain on the Stripe payment page until you are automatically redirected back to Myoko Shuttle.
                    </p>
                    <p>
                      Closing the payment window before the redirect may delay your booking confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={bookingLoading || !price || !acceptedTerms || !acceptedRefundPolicy}
              className={cn(
                "w-full h-16 rounded-[1.5rem] text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl",
                bookingLoading || !price || !acceptedTerms || !acceptedRefundPolicy
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-primary text-white hover:bg-primary-hover shadow-primary/20 hover:-translate-y-1"
              )}
            >
              {bookingLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Complete Booking
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>

      {/* Right Side: Sticky Summary */}
      <div className="w-full lg:w-[30%] lg:pl-4">
        <BookingSummarySidebar 
          selectedRoute={selectedRoute}
          selectedSchedule={selectedSchedule}
          departure={departure}
          arrival={arrival}
          travelDate={travelDate}
          passengers={passengers}
          totalPrice={totalPrice}
          isLoading={bookingLoading}
        />
      </div>

      {/* Mobile Sticky Bar */}
      {price && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Price</p>
              <p className="text-xl font-black text-slate-900">¥{totalPrice.toLocaleString()}</p>
            </div>
            <button
              onClick={() => {
                const form = document.querySelector('form')
                form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
              }}
              disabled={bookingLoading || !acceptedTerms || !acceptedRefundPolicy}
              className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {bookingLoading ? '...' : 'Complete Booking'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


