"use client"

import * as React from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"
import { getBookingReference, getStatusBadgeStyles, formatBookingStatus } from "@/lib/utils/booking"
import { cn } from "@/lib/utils"
import { Loader2, Search, Filter, Download } from "lucide-react"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("")
  const [selectedBooking, setSelectedBooking] = React.useState<any | null>(null)
  const [isEditingBooking, setIsEditingBooking] = React.useState(false)
  const [bookingForm, setBookingForm] = React.useState<any | null>(null)
  const [routeStops, setRouteStops] = React.useState<any[]>([])
  const [cancellingBooking, setCancellingBooking] = React.useState<any | null>(null)
  const [cancellationReason, setCancellationReason] = React.useState("")
  const [isCancelling, setIsCancelling] = React.useState(false)
  const [refundOverride, setRefundOverride] = React.useState('policy')

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setPage(0)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm])
  const [page, setPage] = React.useState(0)
  const [totalCount, setTotalCount] = React.useState(0)
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('travel_date')
  const pageSize = 25

  const handleExportCSV = async () => {
    let query = supabase
      .from('bookings')
      .select('*, route:routes(*), pickup:stops!from_stop_id(*), dropoff:stops!to_stop_id(*)')

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    if (debouncedSearchTerm) {
      query = query.or(
        `first_name.ilike.%${debouncedSearchTerm}%,last_name.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%`
      )
    }

    if (sortBy === 'travel_date') {
      query = query.order('travel_date', { ascending: true })
    }

    if (sortBy === 'created_at') {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('CSV export failed:', error)
      alert('CSV export failed')
      return
    }

    if (!data || data.length === 0) {
      alert('No bookings to export')
      return
    }

    const formatCsvDate = (value: string | null | undefined) => {
      if (!value) return ''
      return new Date(value).toISOString().split('T')[0]
    }

    const headers = [
      "Reference",
      "Status",
      "Customer Name",
      "Email",
      "Route",
      "Travel Date",
      "Departure Time",
      "Passengers",
      "Pickup",
      "Drop-off",
      "First name",
      "Last name",
      "Phone",
      "Country",
      "Passport",
      "Hotel",
      "Flight Number",
      "Shuttle ticket request",
      "Payment status",
      "Total Price",
      "Created Date",
      "Refunded Date",
      "Refund Amount",
      "Cancellation Fee",
      "Cancellation Reason"
    ]

    const escape = (val: any) => {
      if (val === null || val === undefined) return ""
      const s = String(val)
      if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
        return `"${s.replace(/"/g, "\"\"")}"`
      }
      return s
    }

    const rows = data.map(b => [
      getBookingReference(b.id),
      b.status,
      `${b.first_name} ${b.last_name}`,
      b.email,
      `${b.route?.from_location} to ${b.route?.to_location}`,
      b.travel_date,
      b.departure_time,
      b.passengers,
      b.pickup?.name,
      b.dropoff?.name,
      b.first_name,
      b.last_name,
      b.phone,
      b.country,
      b.passport_number,
      b.hotel_name,
      b.flight_number,
      b.free_tickets ? "Yes" : "No",
      b.payment_status || "N/A",
      b.price,
      formatCsvDate(b.created_at),
      formatCsvDate(b.refunded_at),
      b.refund_amount || 0,
      b.cancellation_fee || 0,
      b.cancellation_reason || ""
    ].map(escape))

    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const date = new Date().toISOString().split("T")[0]
    link.setAttribute("href", url)
    link.setAttribute("download", `bookings-export-${date}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const fetchBookings = async () => {
    setLoading(true)
    const from = page * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('bookings')
      .select('*, route:routes(*), pickup:stops!from_stop_id(*), dropoff:stops!to_stop_id(*)', { count: 'exact' })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    if (debouncedSearchTerm) {
      query = query.or(
        `first_name.ilike.%${debouncedSearchTerm}%,last_name.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%`
      )
    }

    if (sortBy === 'travel_date') {
      query = query.order('travel_date', { ascending: true })
    }

    if (sortBy === 'created_at') {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Failed to fetch bookings:', error)
      setLoading(false)
      return
    }

    setBookings(data || [])
    setTotalCount(count || 0)
    setLoading(false)
  }

  React.useEffect(() => {
    fetchBookings()
  }, [page, statusFilter, sortBy, debouncedSearchTerm])

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
          refundOverride: refundOverride,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel booking')
      }

      setCancellingBooking(null)
      setCancellationReason("")
      setRefundOverride('policy')
      
      fetchBookings()

      if (selectedBooking && selectedBooking.id === cancellingBooking.id) {
        setSelectedBooking(result.booking)
        setBookingForm(result.booking)
      }

      if (result.refundAmount > 0) {
        alert("Booking cancelled and refund processed.")
      } else {
        alert("Booking cancelled successfully.")
      }

    } catch (err: any) {
      console.error(err)
      alert(err.message || "Failed to cancel booking. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const fetchStopsForBookingRoute = async (routeId: string) => {
    const { data, error } = await supabase
      .from('stops')
      .select('*')
      .eq('route_id', routeId)
      .order('stop_order', { ascending: true })

    if (error) {
      console.error('Failed to fetch route stops:', error)
      setRouteStops([])
      return
    }

    setRouteStops(data || [])
  }

  const updateBookingStop = async (
    field: 'from_stop_id' | 'to_stop_id',
    value: string
  ) => {
    const nextForm = {
      ...bookingForm,
      [field]: value,
    }

    setBookingForm(nextForm)

    const fromStopId =
      field === 'from_stop_id'
        ? value
        : nextForm.from_stop_id

    const toStopId =
      field === 'to_stop_id'
        ? value
        : nextForm.to_stop_id

    if (!fromStopId || !toStopId || !nextForm.route_id) {
      return
    }

    const { data, error } = await supabase
      .from('prices')
      .select('price')
      .eq('route_id', nextForm.route_id)
      .eq('from_stop_id', fromStopId)
      .eq('to_stop_id', toStopId)
      .maybeSingle()

    if (error) {
      console.error('Failed to look up price:', error)
      return
    }

    if (data) {
      setBookingForm((prev: any) => ({
        ...prev,
        price: data.price * Number(prev.passengers || 1),
      }))
    } else {
      alert('No price found for this pickup/drop-off combination. Please check the price manually.')
    }
  }

  const updateBookingForm = (field: string, value: any) => {
    setBookingForm((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveBookingEdits = async () => {
    if (!selectedBooking || !bookingForm) return



    const {
      data: { user },
    } = await supabase.auth.getUser()

    const updates = {
      travel_date: bookingForm.travel_date,
      departure_time: bookingForm.departure_time,
      passengers: Number(bookingForm.passengers),
      price: Number(bookingForm.price),

      from_stop_id: bookingForm.from_stop_id,
      to_stop_id: bookingForm.to_stop_id,

      first_name: bookingForm.first_name,
      last_name: bookingForm.last_name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      country: bookingForm.country,
      date_of_birth: bookingForm.date_of_birth,
      passport_number: bookingForm.passport_number,

      flight_number: bookingForm.flight_number,
      hotel_name: bookingForm.hotel_name,
      free_tickets: bookingForm.free_tickets,
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', selectedBooking.id)
      .select('*, route:routes(*), pickup:stops!from_stop_id(*), dropoff:stops!to_stop_id(*)')
      .single()

    if (error) {
      console.error('Failed to update booking:', error)
      alert('Failed to update booking')
      return
    }

    setSelectedBooking(data)
    setBookingForm(data)
    setIsEditingBooking(false)
    fetchBookings()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <PageHeading title="Manage Bookings" description={`${totalCount} matching bookings`} />
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-2 items-center">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(0)
              }}
              className="h-10 border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(0)
              }}
              className="h-10 border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="travel_date">Upcoming travel date</option>
              <option value="created_at">Newest booking created</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search reference or customer..."
              className="pl-9 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/30">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reference</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Route</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stops</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date/Pax</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-24 text-center align-middle text-muted-foreground">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                      onClick={() => {
                        setSelectedBooking(booking)
                        setBookingForm({ ...booking })
                        setIsEditingBooking(false)
                        fetchStopsForBookingRoute(booking.route_id)
                      }}
                    >
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
                        <div className="flex flex-col">
                          <span className="font-medium truncate max-w-[150px]">
                            {booking.route?.from_location} → {booking.route?.to_location}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col text-xs space-y-1">
                          <span className="text-muted-foreground italic">Pick: {booking.pickup?.name}</span>
                          <span className="text-muted-foreground italic">Drop: {booking.dropoff?.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-xs">
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-slate-900">
                            Travel: {new Date(booking.travel_date).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Created: {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-slate-500 font-semibold">
                            {booking.passengers} pax
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium">
                        ¥{booking.price?.toLocaleString()}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-slate-500">
          Showing {totalCount === 0 ? 0 : page * pageSize + 1}-
          {Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Previous
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={(page + 1) * pageSize >= totalCount}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedBooking(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  Booking Details
                </h2>

                <p className="text-sm text-gray-500">
                  Reference: {getBookingReference(selectedBooking.id)}
                </p>
              </div>

              <div className="flex gap-2">
                {!isEditingBooking ? (
                  <button
                    onClick={() => setIsEditingBooking(true)}
                    className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={saveBookingEdits}
                      className="rounded-lg bg-black px-3 py-1 text-sm text-white hover:bg-gray-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setBookingForm({ ...selectedBooking })
                        setIsEditingBooking(false)
                      }}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">
                  Journey
                </h3>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Route:</span>{' '}
                    {selectedBooking.route?.from_location} to {selectedBooking.route?.to_location}
                  </div>

                  <div>
                    <span className="text-gray-500">Travel Date:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="date"
                        value={bookingForm?.travel_date || ''}
                        onChange={(e) => updateBookingForm('travel_date', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.travel_date
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Departure Time:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="time"
                        value={bookingForm?.departure_time || ''}
                        onChange={(e) => updateBookingForm('departure_time', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.departure_time?.slice(0, 5)
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Pickup:</span>{' '}
                    {isEditingBooking ? (
                      <select
                        value={bookingForm?.from_stop_id || ''}
                        onChange={(e) =>
                          updateBookingStop('from_stop_id', e.target.value)
                        }
                        className="rounded border p-1 text-sm w-full mt-1"
                      >
                        <option value="">Select pickup</option>
                        {routeStops.map((stop) => (
                          <option key={stop.id} value={stop.id}>
                            {stop.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      selectedBooking.pickup?.name
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Drop-off:</span>{' '}
                    {isEditingBooking ? (
                      <select
                        value={bookingForm?.to_stop_id || ''}
                        onChange={(e) =>
                          updateBookingStop('to_stop_id', e.target.value)
                        }
                        className="rounded border p-1 text-sm w-full mt-1"
                      >
                        <option value="">Select drop-off</option>
                        {routeStops.map((stop) => (
                          <option key={stop.id} value={stop.id}>
                            {stop.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      selectedBooking.dropoff?.name
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Passengers:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="number"
                        min="1"
                        value={bookingForm?.passengers || ''}
                        onChange={(e) => updateBookingForm('passengers', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.passengers
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Total Price:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="number"
                        min="0"
                        value={bookingForm?.price || ''}
                        onChange={(e) => updateBookingForm('price', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      `¥${Number(selectedBooking.price || 0).toLocaleString()}`
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Status:</span>{' '}
                    <div className="mt-1 flex items-center gap-3">
                      <span className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                        getStatusBadgeStyles(selectedBooking.status)
                      )}>
                        {formatBookingStatus(selectedBooking.status)}
                      </span>
                      
                      {!isEditingBooking && selectedBooking.status === 'paid' && (
                        <button
                          onClick={() => setCancellingBooking(selectedBooking)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">
                  Customer
                </h3>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>{' '}
                    {isEditingBooking ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={bookingForm?.first_name || ''}
                          onChange={(e) => updateBookingForm('first_name', e.target.value)}
                          className="rounded border p-1 text-sm w-full"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={bookingForm?.last_name || ''}
                          onChange={(e) => updateBookingForm('last_name', e.target.value)}
                          className="rounded border p-1 text-sm w-full"
                        />
                      </div>
                    ) : (
                      `${selectedBooking.first_name} ${selectedBooking.last_name}`
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Email:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="email"
                        value={bookingForm?.email || ''}
                        onChange={(e) => updateBookingForm('email', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.email
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Phone:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="tel"
                        value={bookingForm?.phone || ''}
                        onChange={(e) => updateBookingForm('phone', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.phone
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Country:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="text"
                        value={bookingForm?.country || ''}
                        onChange={(e) => updateBookingForm('country', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.country
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Date of Birth:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="date"
                        value={bookingForm?.date_of_birth || ''}
                        onChange={(e) => updateBookingForm('date_of_birth', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.date_of_birth
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Passport Number:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="text"
                        value={bookingForm?.passport_number || ''}
                        onChange={(e) => updateBookingForm('passport_number', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.passport_number
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">
                  Travel Details
                </h3>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Flight Number:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="text"
                        value={bookingForm?.flight_number || ''}
                        onChange={(e) => updateBookingForm('flight_number', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.flight_number
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Hotel in Myoko:</span>{' '}
                    {isEditingBooking ? (
                      <input
                        type="text"
                        value={bookingForm?.hotel_name || ''}
                        onChange={(e) => updateBookingForm('hotel_name', e.target.value)}
                        className="rounded border p-1 text-sm w-full mt-1"
                      />
                    ) : (
                      selectedBooking.hotel_name
                    )}
                  </div>

                  <div>
                    <span className="text-gray-500">Free Shuttle Tickets:</span>{' '}
                    {isEditingBooking ? (
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!bookingForm?.free_tickets}
                          onChange={(e) => updateBookingForm('free_tickets', e.target.checked)}
                          className="rounded border"
                        />
                        <span>Requested</span>
                      </div>
                    ) : (
                      selectedBooking.free_tickets ? 'Requested' : 'Not requested'
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">
                  Booking Info
                </h3>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Created:</span>{' '}
                    {selectedBooking.created_at
                      ? new Date(selectedBooking.created_at).toLocaleString()
                      : ''}
                  </div>

                  <div>
                    <span className="text-gray-500">Terms Accepted:</span>{' '}
                    {selectedBooking.accepted_terms ? 'Yes' : 'No'}
                  </div>

                  <div>
                    <span className="text-gray-500">Refund Policy Accepted:</span>{' '}
                    {selectedBooking.accepted_refund_policy ? 'Yes' : 'No'}
                  </div>

                  {selectedBooking.status === 'cancelled' && (
                    <>
                      <div className="pt-2 border-t mt-2">
                        <span className="text-gray-500">Cancelled At:</span>{' '}
                        {selectedBooking.cancelled_at
                          ? new Date(selectedBooking.cancelled_at).toLocaleString()
                          : ''}
                      </div>

                      <div>
                        <span className="text-gray-500">Cancellation Reason:</span>{' '}
                        {selectedBooking.cancellation_reason || ''}
                      </div>
                    </>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {cancellingBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setCancellingBooking(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
            
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-100 mb-6 text-sm">
              <p className="font-bold mb-2">Cancellation Policy</p>
              <p className="mb-2">Refunds are calculated automatically based on the travel date and original payment amount.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>21+ days before departure: 10% cancellation fee</li>
                <li>20–14 days before departure: 30% cancellation fee</li>
                <li>13–8 days before departure: 50% cancellation fee</li>
                <li>7 days or less before departure: 100% cancellation fee</li>
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Option
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="refundOverride"
                    value="policy"
                    checked={refundOverride === 'policy'}
                    onChange={(e) => setRefundOverride(e.target.value)}
                  />
                  <span className="text-sm">1. Apply standard cancellation policy</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="refundOverride"
                    value="full"
                    checked={refundOverride === 'full'}
                    onChange={(e) => setRefundOverride(e.target.value)}
                  />
                  <span className="text-sm">2. Full refund — service cancelled by operator</span>
                </label>
              </div>
              {refundOverride === 'full' && (
                <p className="mt-2 text-xs text-amber-700 font-medium bg-amber-50 p-2 rounded border border-amber-100">
                  This will refund 100% of the booking amount and apply no cancellation fee.
                </p>
              )}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please briefly explain the reason for this administrative cancellation..."
              className="w-full rounded-xl border p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              rows={4}
              required
            />

            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setCancellingBooking(null)
                  setCancellationReason("")
                  setRefundOverride('policy')
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
