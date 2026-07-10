import { resend } from '@/lib/resend'

export const sendCancellationEmail = async (booking: any) => {
  const bookingReference = booking.id?.slice(0, 8).toUpperCase()

  const route = `${booking.routes?.from_location || ''} to ${
    booking.routes?.to_location || ''
  }`

  const pickup = booking.from_stop?.name || ''
  const dropoff = booking.to_stop?.name || ''
  const departureTime = booking.departure_time?.slice(0, 5) || ''
  
  const isRefunded = booking.status === 'refunded'
  const subject = isRefunded
    ? 'Your MKK Shuttle booking has been cancelled and refunded'
    : 'Your MKK Shuttle booking has been cancelled'

  await resend.emails.send({
    from: 'MKK Shuttle <bookings@myokoshuttle.com>',
    replyTo: 'myokoshuttle@gmail.com',
    to: booking.email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>${subject}</title>
      </head>

      <body style="margin:0; padding:0; background-color:#F8F6F2; font-family:Arial, Helvetica, sans-serif; color:#1F1F1F;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #F0ECE5;">

                <tr>
                  <td style="background:#1F3A5F; padding:34px 36px; text-align:left;">
                    <div style="font-size:13px; letter-spacing:2px; text-transform:uppercase; color:#D8C7A3; font-weight:bold;">
                      MKK Shuttle
                    </div>

                    <h1 style="margin:12px 0 0; font-size:30px; line-height:1.2; color:#ffffff;">
                      Booking Cancelled
                    </h1>

                    <p style="margin:14px 0 0; font-size:16px; line-height:1.6; color:#EDE7DC;">
                      ${isRefunded ? 'Your booking has been cancelled and your refund is being processed.' : 'Your booking has been cancelled.'}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:34px 36px;">

                    <p style="margin:0 0 22px; font-size:16px; line-height:1.6; color:#444444;">
                      Hi ${booking.first_name || 'there'},
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px; background:#F8F6F2; border:1px solid #F0ECE5; border-radius:14px;">
                      <tr>
                        <td style="padding:22px;">
                          <div style="font-size:12px; letter-spacing:1.5px; text-transform:uppercase; color:#7A6B4A; font-weight:bold; margin-bottom:8px;">
                            Booking Reference
                          </div>

                          <div style="font-size:28px; line-height:1.2; color:#1F3A5F; font-weight:bold;">
                            ${bookingReference}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:0 0 30px;">
                      <tr>
                        <td colspan="2" style="padding:0 0 14px;">
                          <h2 style="margin:0; font-size:20px; color:#1F1F1F;">
                            Booking details
                          </h2>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; color:#777777; font-size:14px;">Travel Date</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; color:#1F1F1F; font-size:14px; font-weight:bold;">${booking.travel_date}</td>
                      </tr>

                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; color:#777777; font-size:14px;">Departure Time</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; color:#1F1F1F; font-size:14px; font-weight:bold;">${departureTime}</td>
                      </tr>

                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; color:#777777; font-size:14px;">Route</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; color:#1F1F1F; font-size:14px; font-weight:bold;">${route}</td>
                      </tr>

                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; color:#777777; font-size:14px;">Pickup</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; color:#1F1F1F; font-size:14px; font-weight:bold;">${pickup}</td>
                      </tr>

                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; color:#777777; font-size:14px;">Drop-off</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; color:#1F1F1F; font-size:14px; font-weight:bold;">${dropoff}</td>
                      </tr>

                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; color:#777777; font-size:14px;">Passengers</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; color:#1F1F1F; font-size:14px; font-weight:bold;">${booking.passengers}</td>
                      </tr>
                      
                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; color:#777777; font-size:14px;">Cancellation Reason</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; color:#1F1F1F; font-size:14px;">${booking.cancellation_reason || 'N/A'}</td>
                      </tr>

                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; color:#777777; font-size:14px;">Cancellation Fee</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; color:#1F1F1F; font-size:14px; font-weight:bold;">¥${Number(booking.cancellation_fee || 0).toLocaleString()}</td>
                      </tr>

                      <tr>
                        <td style="padding:13px 0; border-top:1px solid #eeeeee; border-bottom:1px solid #eeeeee; color:#777777; font-size:14px;">Refund Amount</td>
                        <td align="right" style="padding:13px 0; border-top:1px solid #eeeeee; border-bottom:1px solid #eeeeee; color:#1F3A5F; font-size:16px; font-weight:bold;">¥${Number(booking.refund_amount || 0).toLocaleString()}</td>
                      </tr>
                    </table>

                    ${isRefunded ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 30px; background:#FBF9F5; border-left:4px solid #B3844C; border-radius:10px;">
                      <tr>
                        <td style="padding:20px;">
                          <h3 style="margin:0 0 10px; font-size:17px; color:#1F1F1F;">
                            Refund Information
                          </h3>

                          <p style="margin:0; font-size:14px; line-height:1.6; color:#555555;">
                            Refunds usually appear on the original payment method within 5–10 business days, depending on the card issuer.
                          </p>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:#555555;">
                      Need help?
                    </p>

                    <p style="margin:0; font-size:14px; line-height:1.6;">
                      <a href="mailto:myokoshuttle@gmail.com" style="color:#1F3A5F; text-decoration:underline;">
                        myokoshuttle@gmail.com
                      </a>
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="background:#F8F6F2; padding:22px 36px; border-top:1px solid #F0ECE5;">
                    <p style="margin:0; font-size:12px; line-height:1.6; color:#888888;">
                      MKK Shuttle<br />
                      This email was sent about your shuttle booking.
                    </p>
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
