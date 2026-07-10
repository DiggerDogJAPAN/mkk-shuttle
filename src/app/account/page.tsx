"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getBookingReference, getStatusBadgeStyles, formatBookingStatus } from "@/lib/utils/booking"
import { Ticket, ArrowRight, Loader2 } from "lucide-react"

export default function AccountIndexPage() {
  const [profile, setProfile] = useState<any>(null)
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        setProfile(profileData)

        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*, route:routes(*), pickup:stops!from_stop_id(*), dropoff:stops!to_stop_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        setRecentBookings(bookingsData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{profile?.first_name ? `, ${profile.first_name}` : ""}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your bookings and account settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="block text-sm text-muted-foreground">Name</span>
              <span className="font-medium">{profile?.first_name} {profile?.last_name}</span>
            </div>
            <div>
              <span className="block text-sm text-muted-foreground">Email</span>
              <span className="font-medium">{profile?.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col items-start">
            <Link 
              href="/book" 
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
            >
              Make a New Booking
            </Link>
            <Link 
              href="/account/bookings" 
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-full sm:w-auto bg-background border border-border")}
            >
              View All Bookings
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Recent Bookings</h2>
          <Link href="/account/bookings" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Ticket className="w-12 h-12 mb-4 opacity-20" />
              <p>You have no recent bookings.</p>
              <Link href="/book" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-4 bg-background border border-border")}>
                Book a Shuttle
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recentBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm bg-muted px-2 py-1 rounded">
                        {getBookingReference(booking.id)}
                      </span>
                      <span className="text-sm font-medium">
                        {booking.travel_date}
                      </span>
                    </div>
                    <p className="font-medium">
                      {booking.route?.from_location} to {booking.route?.to_location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                      getStatusBadgeStyles(booking.status)
                    )}>
                      {formatBookingStatus(booking.status)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
