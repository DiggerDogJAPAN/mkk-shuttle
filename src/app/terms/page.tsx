import { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { PageHeading } from "@/components/ui/page-heading"

export const metadata: Metadata = {
  title: "Terms & Conditions | Myoko Shuttle",
  description: "Please read these Terms & Conditions carefully before using the Myoko Shuttle website or booking any transportation services.",
}

export default function TermsPage() {
  const sections = [
    {
      title: "1. General Terms",
      content: (
        <div className="space-y-4">
          <p>Myoko Shuttle provides seasonal transportation services within the Myoko, Madarao, and Shiga Kogen resort areas of Japan.</p>
          <p>By using this website or making a booking for any of our services, you agree to be bound by these Terms & Conditions. Myoko Shuttle reserves the right to update or modify these terms at any time without prior notice.</p>
        </div>
      )
    },
    {
      title: "2. Bookings",
      content: (
        <div className="space-y-4">
          <p>All bookings are subject to vehicle and driver availability. To ensure a successful journey, customers must provide accurate and complete booking information, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full passenger details and counts</li>
            <li>Accurate flight numbers and arrival/departure times</li>
            <li>Correct accommodation names and pickup/drop-off locations</li>
            <li>Reliable contact information (email and mobile phone)</li>
          </ul>
          <p>Myoko Shuttle is not responsible for service interruptions caused by incorrect or incomplete information. Please note that some local shuttle services may operate on a walk-on basis without a formal reservation.</p>
        </div>
      )
    },
    {
      title: "3. Payment Terms",
      content: (
        <div className="space-y-4">
          <p>All prices are displayed in Japanese Yen (JPY) and include Japanese consumption tax unless otherwise specified. Online payments are processed securely through our payment partner, Stripe.</p>
          <p>For certain local shuttle services, cash payment may be required directly on board before departure. Please refer to your specific booking confirmation for payment details.</p>
        </div>
      )
    },
    {
      title: "4. Airport Transfer Services",
      content: (
        <div className="space-y-4">
          <p>Punctuality is essential for airport transfer services. Customers must arrive at designated meeting points at least 10 minutes before their scheduled departure time.</p>
          <p>Due to strict airport operating restrictions and schedule commitments, buses cannot wait for delayed passengers. Customers are responsible for allowing sufficient time for immigration, baggage collection, customs, and inter-terminal transfers.</p>
        </div>
      )
    },
    {
      title: "5. Delays and Missed Services",
      content: (
        <div className="space-y-4">
          <p>Myoko Shuttle is not responsible for service delays or missed departures caused by factors beyond our control, including weather conditions, traffic congestion, road closures, accidents, or natural disasters.</p>
          <p>If a customer misses a scheduled service due to delayed flights or late arrival at the meeting point, refunds may not be available. We strongly encourage all customers to obtain comprehensive travel insurance to cover such eventualities.</p>
        </div>
      )
    },
    {
      id: "cancellations-and-refunds",
      title: "6. Cancellations and Refunds",
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4">Standard Cancellation Policy</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b border-slate-200 pb-2">
                <span>21+ days before departure</span>
                <span className="font-bold text-slate-900">10% cancellation fee</span>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-2">
                <span>20–14 days before departure</span>
                <span className="font-bold text-slate-900">30% cancellation fee</span>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-2">
                <span>13–8 days before departure</span>
                <span className="font-bold text-slate-900">50% cancellation fee</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>7 days or less / Same day / No-show</span>
                <span className="font-bold text-error">100% cancellation fee</span>
              </li>
            </ul>
          </div>
          <p>No credit system is offered for cancelled bookings. Refunds are handled according to this cancellation fee schedule. Refund processing times may vary depending on your payment provider. Please note that service fees charged by payment processors may not be refundable where applicable.</p>
        </div>
      )
    },
    {
      title: "7. Service Changes and Cancellations",
      content: (
        <div className="space-y-4">
          <p>Myoko Shuttle reserves the right to modify, delay, reroute, or cancel services due to weather, heavy snow, road closures, operational issues, safety concerns, or insufficient passenger numbers.</p>
          <p>If Myoko Shuttle cancels a service and no alternative transportation is provided, affected customers will receive a full refund for the cancelled portion of their booking.</p>
        </div>
      )
    },
    {
      title: "8. Luggage Policy",
      content: (
        <div className="space-y-4">
          <p>Standard luggage and one set of ski or snowboard equipment per person are permitted. Customers must accurately declare any oversized or additional luggage during the booking process.</p>
          <p>Space is limited on some local services. Myoko Shuttle is not responsible for lost, stolen, or damaged luggage unless such loss or damage is proven to be caused by our direct negligence.</p>
        </div>
      )
    },
    {
      title: "9. Passenger Conduct",
      content: (
        <div className="space-y-4">
          <p>Passengers must follow all instructions provided by drivers and Myoko Shuttle staff. Dangerous, illegal, or disruptive behavior may result in immediate refusal of service without a refund.</p>
          <p>Smoking and consumption of alcohol are strictly prohibited onboard all vehicles.</p>
        </div>
      )
    },
    {
      title: "10. Liability Limitation",
      content: (
        <div className="space-y-4">
          <p>Myoko Shuttle's liability is limited to the cost of the transportation service booked. We are not liable for any indirect or consequential losses, including missed flights, missed reservations, additional accommodation costs, or other damages resulting from service delays or interruptions.</p>
          <p>All travel times provided are estimates only and are not guaranteed.</p>
        </div>
      )
    },
    {
      title: "11. Website Use",
      content: (
        <p>The content on this website is for general informational purposes only. Service details and schedules are subject to change without notice. Unauthorized copying, distribution, or misuse of any website content is strictly prohibited.</p>
      )
    },
    {
      title: "12. Privacy",
      content: (
        <p>Your use of our website and services is also governed by our <Link href="/privacy" className="text-primary hover:underline font-bold">Privacy Policy</Link>, which outlines how we collect and protect your personal information.</p>
      )
    },
    {
      title: "13. Governing Law",
      content: (
        <p>These Terms & Conditions are governed by and construed in accordance with the laws of Japan.</p>
      )
    },
    {
      title: "14. Contact Information",
      content: (
        <div className="space-y-2">
          <p className="font-bold text-slate-900">Myoko Shuttle</p>
          <p>Email: <a href="mailto:info@myokoshuttle.com" className="text-primary hover:underline">info@myokoshuttle.com</a></p>
          <p>Phone: +81 255-77-4677</p>
        </div>
      )
    }
  ]

  return (
    <Section className="py-20">
      <Container className="max-w-4xl">
        <PageHeading
          title="Terms & Conditions"
          description="Please read these Terms & Conditions carefully before using the Myoko Shuttle website or booking any transportation services."
        />

        <div className="mt-16 space-y-12">
          {sections.map((section, idx) => (
            <div key={idx} id={section.id} className="space-y-4 pb-8 border-b border-slate-100 last:border-0 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              <div className="text-slate-600 leading-relaxed font-medium">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Customers are encouraged to contact Myoko Shuttle before travel if they have questions regarding bookings, schedules, luggage, or cancellations.
          </p>
        </div>
      </Container>
    </Section>
  )
}
