export default function BookingCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border bg-white p-8 text-center">
        <h1 className="text-2xl font-bold">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-gray-500">
          Your booking was created, but payment was not completed.
        </p>

        <a
          href="/account"
          className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
        >
          View My Bookings
        </a>
      </div>
    </div>
  )
}
