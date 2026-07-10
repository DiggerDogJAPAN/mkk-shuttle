import { Metadata } from "next"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { PageHeading } from "@/components/ui/page-heading"

export const metadata: Metadata = {
  title: "Commercial Disclosure | Myoko Shuttle",
  description: "Information provided in accordance with the Act on Specified Commercial Transactions.",
}

export default function CommerceDisclosurePage() {
  const sections = [
    { label: "Business Name", value: "Myoko Shuttle" },
    { label: "Representative", value: "Mitsuru Kamikura" },
    { label: "Business Address", value: "1-16-6 Minamigaoka, Myoko City, Niigata 949-2106, Japan" },
    { label: "Phone Number", value: "+81 255-77-4677" },
    { label: "Email Address", value: "info@myokoshuttle.com" },
    { label: "Website", value: "https://www.myokoshuttle.com" },
    {
      label: "Sales Price",
      value: "Prices are displayed on each service and booking page and include Japanese consumption tax unless otherwise stated."
    },
    {
      label: "Additional Fees",
      value: "Customers are responsible for internet connection fees and any bank transfer or payment processing fees charged by their provider if applicable."
    },
    { label: "Payment Methods", value: "Credit Card, Cash (selected local services only)" },
    { label: "Payment Timing", value: "Credit card payments are processed at the time of booking unless otherwise stated." },
    {
      label: "Service Delivery",
      value: "Transportation services are provided on the selected operating date and route shown during booking."
    },
    {
      label: "Cancellations and Refunds",
      value: (
        <div className="space-y-4">
          <p>Cancellation fees may apply depending on the timing of cancellation before departure:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>21+ days before departure: 10% cancellation fee</li>
            <li>20–14 days before departure: 30% cancellation fee</li>
            <li>13-8 days before departure: 50% cancellation fee</li>
            <li>7 days before departure: 100% cancellation fee</li>
          </ul>
        </div>
      )
    },
    {
      label: "Service Changes and Interruptions",
      value: "Services may be delayed, modified, or cancelled due to weather, road conditions, traffic, natural disasters, operational issues, or safety concerns."
    },
    {
      label: "Refund Policy",
      value: "If Myoko Shuttle cancels a service before departure and no alternative transportation is provided, customers will receive a refund for the affected booking."
    },
    {
      label: "Important Notes",
      value: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Travel times are estimates only</li>
          <li>Customers should arrive at meeting points before departure</li>
          <li>Luggage restrictions may apply depending on service type</li>
          <li>Some local shuttle services may operate without reservation</li>
        </ul>
      )
    }
  ]

  return (
    <Section className="py-20">
      <Container className="max-w-4xl">
        <PageHeading
          title="Commercial Disclosure"
          description="Information provided in accordance with the Act on Specified Commercial Transactions."
        />

        <div className="mt-16 space-y-0 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 md:grid-cols-3 p-8 gap-4 border-b border-slate-50 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
            >
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest md:pt-1">
                {section.label}
              </div>
              <div className="md:col-span-2 text-slate-700 leading-relaxed font-medium">
                {section.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            For questions regarding bookings, payments, or cancellations, please contact us directly before travel.
          </p>
        </div>
      </Container>
    </Section>
  )
}
