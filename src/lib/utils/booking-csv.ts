import type { SupabaseClient } from '@supabase/supabase-js'
import { getBookingReference } from './booking'

export interface BookingCsvRow {
  id: string
  status?: string | null
  first_name?: string | null
  last_name?: string | null
  date_of_birth?: string | null
  email?: string | null
  route?: { from_location?: string; to_location?: string } | null
  travel_date?: string | null
  departure_time?: string | null
  passengers?: number | null
  pickup?: { name?: string } | null
  dropoff?: { name?: string } | null
  phone?: string | null
  country?: string | null
  passport_number?: string | null
  hotel_name?: string | null
  flight_number?: string | null
  free_tickets?: boolean | null
  payment_status?: string | null
  price?: number | null
  created_at?: string | null
  refunded_at?: string | null
  refund_amount?: number | null
  cancellation_fee?: number | null
  cancellation_reason?: string | null
}

export interface BookingExportFilters {
  statusFilter: string
  searchTerm: string
  sortBy: string
}

const BATCH_SIZE = 1000

export async function fetchBookingsForCsv(
  supabase: Pick<SupabaseClient, 'from'>,
  { statusFilter, searchTerm, sortBy }: BookingExportFilters,
): Promise<BookingCsvRow[]> {
  const bookings: BookingCsvRow[] = []
  const ids = new Set<string>()
  let expectedCount: number | undefined

  while (true) {
    let query = supabase.from('bookings').select(
      '*, route:routes(*), pickup:stops!from_stop_id(*), dropoff:stops!to_stop_id(*)',
      { count: 'exact' },
    )
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`,
      )
    }
    if (sortBy === 'travel_date') query = query.order('travel_date', { ascending: true })
    if (sortBy === 'created_at') query = query.order('created_at', { ascending: false })
    // Equal dates must retain the same order across independent requests.
    query = query.order('id', { ascending: true })

    const { data, error, count } = await query.range(bookings.length, bookings.length + BATCH_SIZE - 1)
    if (error) throw new Error('A booking export batch failed. Please retry.')
    if (!data || count === null || !Number.isSafeInteger(count) || count < 0) {
      throw new Error('Could not verify the complete booking export. Please retry.')
    }
    if (expectedCount !== undefined && count !== expectedCount) {
      throw new Error('Bookings changed during export. Please retry.')
    }
    expectedCount = count
    if (data.length > BATCH_SIZE) throw new Error('Unexpected booking export batch size.')
    for (const booking of data as BookingCsvRow[]) {
      if (!booking.id || ids.has(booking.id)) {
        throw new Error('Duplicate or invalid booking in export. Please retry.')
      }
      ids.add(booking.id)
      bookings.push(booking)
    }
    if (bookings.length === expectedCount) return bookings
    if (data.length === 0 || bookings.length > expectedCount) {
      throw new Error('The booking export is incomplete. Please retry.')
    }
    // Advance by actual rows received, including when the API caps below 1000.
  }
}

export function formatBirthDate(value: string | null | undefined): string {
  if (!value) return ''
  // A birth date is a calendar date, not an instant: never convert timezones.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) throw new Error('A booking has an invalid date of birth.')
  const [, y, m, d] = match
  const year = Number(y), month = Number(m), day = Number(d)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) {
    throw new Error('A booking has an invalid date of birth.')
  }
  return value
}

export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let text = String(value)
  // CSV quoting alone does not stop Excel/Sheets from interpreting formulas.
  if (/^[\s\u0000-\u001f\u007f-\u009f]*[=+\-@]/u.test(text) || /^[\t\r\n]/u.test(text)) {
    text = `'${text}`
  }
  return /[,"\r\n]/u.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function buildBookingCsv(bookings: BookingCsvRow[]): string {
  const formatCsvDate = (value: string | null | undefined) =>
    value ? new Date(value).toISOString().split('T')[0] : ''
  const headers = [
    'Reference', 'Status', 'Customer Name', 'Date of Birth', 'Email', 'Route',
    'Travel Date', 'Departure Time', 'Passengers', 'Pickup', 'Drop-off',
    'First name', 'Last name', 'Phone', 'Country', 'Passport', 'Hotel',
    'Flight Number', 'Shuttle ticket request', 'Payment status', 'Total Price',
    'Created Date', 'Refunded Date', 'Refund Amount', 'Cancellation Fee', 'Cancellation Reason',
  ]
  const rows = bookings.map(b => [
    getBookingReference(b.id), b.status, `${b.first_name} ${b.last_name}`,
    formatBirthDate(b.date_of_birth), b.email,
    `${b.route?.from_location} to ${b.route?.to_location}`, b.travel_date,
    b.departure_time, b.passengers, b.pickup?.name, b.dropoff?.name,
    b.first_name, b.last_name, b.phone, b.country, b.passport_number,
    b.hotel_name, b.flight_number, b.free_tickets ? 'Yes' : 'No',
    b.payment_status || 'N/A', b.price, formatCsvDate(b.created_at),
    formatCsvDate(b.refunded_at), b.refund_amount || 0,
    b.cancellation_fee || 0, b.cancellation_reason || '',
  ].map(escapeCsvCell))
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}
