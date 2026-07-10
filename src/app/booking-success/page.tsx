'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Container } from '@/components/ui/container'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking_id')
  
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookingId) {
      setLoading(false)
      return
    }

    const fetchBooking = async () => {
      const { data, error } = await supabase
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

      if (!error && data) {
        setBooking(data)
      }
      setLoading(false)
    }

    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Payment Successful</h2>
        <p className="mt-4 text-slate-500">Booking details could not be loaded.</p>
        <div className="mt-8">
          <Link href="/account" className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
            View My Bookings
          </Link>
        </div>
      </div>
    )
  }

  const travelDate = new Date(booking.travel_date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Payment Successful</h1>
          <p className="text-slate-500 text-lg">Your payment has been received and your shuttle booking is being confirmed.</p>
          
          <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-900 text-sm font-medium w-full max-w-lg">
            <p className="mb-2 font-bold text-base">A confirmation email will be sent shortly.</p>
            <p className="text-blue-800">Please allow enough time to clear customs before your shuttle departure.</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-10 mb-10 animate-in fade-in duration-700 delay-150">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Booking Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Booking Reference</p>
              <p className="text-slate-900 font-medium font-mono text-sm bg-slate-50 p-2 rounded-lg inline-block border border-slate-100">{booking.id?.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Travel Date</p>
              <p className="text-slate-900 font-bold">{travelDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Departure Time</p>
              <p className="text-slate-900 font-bold">{booking.departure_time?.slice(0, 5)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Route</p>
              <p className="text-slate-900 font-bold">{booking.routes?.from_location} to {booking.routes?.to_location}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Pickup</p>
              <p className="text-slate-900 font-bold">{booking.from_stop?.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Drop-off</p>
              <p className="text-slate-900 font-bold">{booking.to_stop?.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Passengers</p>
              <p className="text-slate-900 font-bold">{booking.passengers}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Paid</p>
              <p className="text-slate-900 font-black text-xl">¥{booking.price?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-700 delay-300">
          <Link href="/account" className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20">
            View My Bookings
          </Link>
          <Link href="/" className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">
            Book Another Transfer
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:py-16">
      <Container>
        <Suspense fallback={
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <BookingSuccessContent />
        </Suspense>
      </Container>
    </div>
  )
}
