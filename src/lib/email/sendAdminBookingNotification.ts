import { resend } from '@/lib/resend'

export const sendAdminBookingNotification = async (booking: any) => {
  const bookingReference = booking.id?.slice(0, 8).toUpperCase()

  const route = `${booking.routes?.from_location || ''} to ${
    booking.routes?.to_location || ''
  }`

  const pickup = booking.from_stop?.name || ''
  const dropoff = booking.to_stop?.name || ''
  const departureTime = booking.departure_time?.slice(0, 5) || ''

  await resend.emails.send({
    from: 'MKK Shuttle <bookings@myokoshuttle.com>',
    replyTo: 'myokoshuttle@gmail.com',
    to: 'myokoshuttle@gmail.com',
    subject: 'New Booking Received – MKK Shuttle',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>New Booking Received – MKK Shuttle</title>
      </head>

      <body style="margin:0; padding:0; background-color:#F5F5F5; font-family:Arial, Helvetica, sans-serif; color:#333333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 15px;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #DDDDDD;">

                <tr>
                  <td style="background:#222222; padding:20px; text-align:left;">
                    <h1 style="margin:0; font-size:20px; color:#ffffff;">
                      New Booking Notification
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px 20px;">

                    <p style="margin:0 0 20px; font-size:16px;">
                      A new booking has been confirmed and paid.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:0 0 20px;">
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold; width:35%;">Reference</td>
                        <td style="padding:10px; border:1px solid #EEEEEE; font-family:monospace; font-size:16px;">${bookingReference}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Customer Name</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${booking.first_name} ${booking.last_name}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Customer Email</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;"><a href="mailto:${booking.email}" style="color:#0055CC;">${booking.email}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Phone</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${booking.phone || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Travel Date</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${booking.travel_date}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Departure Time</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${departureTime}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Route</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${route}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Pickup</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${pickup}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Drop-off</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${dropoff}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Passengers</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${booking.passengers}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Hotel</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${booking.hotel_name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Flight Number</td>
                        <td style="padding:10px; border:1px solid #EEEEEE;">${booking.flight_number || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px; border:1px solid #EEEEEE; background:#FAFAFA; font-weight:bold;">Total Paid</td>
                        <td style="padding:10px; border:1px solid #EEEEEE; font-weight:bold; color:#006600;">¥${Number(booking.price || 0).toLocaleString()}</td>
                      </tr>
                    </table>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  })
}
