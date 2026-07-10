import { Container } from "@/components/ui/container"
import { FAQSection } from "@/components/services/faq-section"
import { generateSeoMetadata } from '@/lib/seo'
import { getFaqSchema } from '@/lib/schema'

export const metadata = generateSeoMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Find answers about MKK Shuttle airport transfers, bookings, payments, cancellations, refunds, luggage and travel times.',
  path: '/faq',
})

export default function FAQPage() {
  return (
    <div className="flex flex-col pt-12">
      <FAQSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqSchema()),
        }}
      />
    </div>
  )
}
