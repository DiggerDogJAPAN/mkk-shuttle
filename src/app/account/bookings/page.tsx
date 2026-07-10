"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getBookingReference, getStatusBadgeStyles, formatBookingStatus } from "@/lib/utils/booking"
import { Ticket, Loader2, MapPin, Users, Calendar } from "lucide-react"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingBooking, setCancellingBooking] = useState<any | null>(null)
  const [cancellationReason, setCancellationReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancelBooking = async () => {
    if (!cancellingBooking || !cancellationReason.trim()) return

    setIsCancelling(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          bookingId: cancellingBooking.id,
          reason: cancellationReason,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel booking')
      }

      const responseData = await response.json()

      setBookings(prev => prev.map(b => 
        b.id === cancellingBooking.id 
          ? { ...b, status: responseData.status, cancellation_reason: cancellationReason } 
          : b
      ))
      
      setCancellingBooking(null)
      setCancellationReason("")
      alert("Your booking has been cancelled.")
    } catch (err) {
      console.error(err)
      alert("Failed to cancel booking. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  useEffect(() => {
    async function loadBookings() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*, route:routes(*), pickup:stops!from_stop_id(*), dropoff:stops!to_stop_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        setBookings(bookingsData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          View all your shuttle transfers.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            No bookings yet.
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Your shuttle bookings will appear here after you complete a reservation.
          </p>

          <Link
            href="/book"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Make a Booking
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="border-b bg-muted/30 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold bg-background border px-2 py-1 rounded shadow-sm">
                    {getBookingReference(booking.id)}
                  </span>
                  <span className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                    getStatusBadgeStyles(booking.status)
                  )}>
                    {formatBookingStatus(booking.status)}
                  </span>
                </div>
                <div className="text-sm font-medium">
                  Total: ¥{booking.price?.toLocaleString()}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Route
                    </span>
                    <p className="font-medium">
                      {booking.route?.from_location} to {booking.route?.to_location}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Travel Date
                    </span>
                    <p className="font-medium">
                      {booking.travel_date}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Time: {booking.departure_time?.slice(0, 5)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" /> Passengers
                    </span>
                    <p className="font-medium">
                      {booking.passengers}
                    </p>
                  </div>

                  <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2 bg-muted/20 p-4 rounded-lg grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Pickup</span>
                      <p className="text-sm font-medium">{booking.pickup?.name || "Unknown Stop"}</p>
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Drop-off</span>
                      <p className="text-sm font-medium">{booking.dropoff?.name || "Unknown Stop"}</p>
                    </div>
                  </div>

                  {booking.status === 'paid' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-2">
                      <button
                        onClick={() => setCancellingBooking(booking)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium transition-colors"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setCancellingBooking(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
            
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-100 mb-6 text-sm">
              <p className="font-bold mb-2">Cancellation Policy</p>
              <p className="mb-2">Please note that this will immediately cancel your shuttle reservation. Refunds will be processed automatically according to the following policy. This action cannot be undone.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>21+ days before departure: 10% cancellation fee</li>
                <li>20–14 days before departure: 30% cancellation fee</li>
                <li>13-8 days before departure: 50% cancellation fee</li>
                <li>7 days before departure: 100% cancellation fee</li>
              </ul>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please briefly explain why you need to cancel..."
              className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              rows={4}
              required
            />

            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setCancellingBooking(null)
                  setCancellationReason("")
                }}
                disabled={isCancelling}
                className="px-5 py-2.5 rounded-xl border font-bold hover:bg-slate-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling || !cancellationReason.trim()}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
