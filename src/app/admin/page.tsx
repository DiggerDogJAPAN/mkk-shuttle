"use client"

import * as React from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CalendarDays, Route, Users, DollarSign, Loader2, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { getBookingReference, getStatusBadgeStyles, formatBookingStatus } from "@/lib/utils/booking"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const [stats, setStats] = React.useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  })
  const [recentBookingsCount, setRecentBookingsCount] = React.useState(0)
  const [recentBookings, setRecentBookings] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStats() {
      try {
        // 1. Total Bookings
        const { count: totalBookings } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })

        // 2. Pending Bookings
        const { count: pendingBookings } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

        // 3. Recent Bookings Count
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

        const { count: recentCount, error: recentError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', threeDaysAgo.toISOString())

        if (recentError) {
          console.error('Failed to fetch recent bookings count:', recentError)
        } else {
          setRecentBookingsCount(recentCount || 0)
        }

        // 4. Total Revenue
        const { data: revenueData } = await supabase
          .from('bookings')
          .select('price')
          .neq('status', 'cancelled')

        const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.price || 0), 0) || 0

        // 5. Recent Bookings
        const { data: recent } = await supabase
          .from('bookings')
          .select('*, route:routes(*)')
          .order('created_at', { ascending: false })
          .limit(5)

        setStats({
          totalBookings: totalBookings || 0,
          pendingBookings: pendingBookings || 0,
          totalCustomers: 0,
          totalRevenue,
        })
        setRecentBookings(recent || [])
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeading
        title="Admin Dashboard"
        description="Overview of your shuttle booking platform."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Bookings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time records
            </p>
          </CardContent>
        </Card>

        {/* Pending Bookings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        {/* Recent Bookings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Bookings
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{recentBookingsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 3 days
            </p>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">¥{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From active bookings
            </p>
          </CardContent>
        </Card>

      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Link href="/admin/bookings" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No recent bookings found.</p>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reference</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Route</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-mono font-medium">
                          {getBookingReference(booking.id)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">{booking.first_name} {booking.last_name}</span>
                            <span className="text-xs text-muted-foreground">{booking.email}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {booking.route?.from_location} → {booking.route?.to_location}
                        </td>
                        <td className="p-4 align-middle">
                          {new Date(booking.travel_date).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <span className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                            getStatusBadgeStyles(booking.status)
                          )}>
                            {formatBookingStatus(booking.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
