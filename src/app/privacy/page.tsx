import { Metadata } from "next"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { PageHeading } from "@/components/ui/page-heading"

export const metadata: Metadata = {
  title: "Privacy Policy | Myoko Shuttle",
  description: "Myoko Shuttle respects your privacy and is committed to protecting your personal information.",
}

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <div className="space-y-4">
          <p>We collect personal information that you provide to us directly when you make a booking, create an account, or contact us. This may include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name and contact information (email address, phone number)</li>
            <li>Country of residence</li>
            <li>Passenger information and travel details</li>
            <li>Pickup and drop-off locations, including flight and accommodation information</li>
            <li>Payment information processed securely through Stripe</li>
            <li>Website usage data and analytics information</li>
          </ul>
          <p className="font-bold text-slate-900 italic">Myoko Shuttle does not directly store full credit card details on our servers.</p>
        </div>
      )
    },
    {
      title: "2. How We Use Your Information",
      content: (
        <div className="space-y-4">
          <p>We use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processing and managing your shuttle bookings</li>
            <li>Coordinating shuttle operations and logistics</li>
            <li>Sending booking confirmations, updates, and service alerts</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>Securely processing payments through our payment partner</li>
            <li>Improving our website functionality and service quality</li>
            <li>Complying with legal and operational requirements</li>
          </ul>
        </div>
      )
    },
    {
      title: "3. Payment Processing",
      content: (
        <p>All online payments are securely processed through Stripe, a leading global payment processor. Myoko Shuttle does not store full payment card information on its own servers, ensuring a high level of security for your financial data.</p>
      )
    },
    {
      title: "4. Sharing of Information",
      content: (
        <div className="space-y-4">
          <p>We only share your personal information when necessary to provide our services or comply with legal obligations. This may include sharing with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Payment processors (Stripe) to handle transactions</li>
            <li>Operational partners and local transport providers where required</li>
            <li>Accommodation providers to coordinate pickup/drop-off</li>
            <li>Legal authorities when required by law or to protect our rights</li>
          </ul>
          <p className="font-bold text-primary">Personal information is never sold to third parties.</p>
        </div>
      )
    },
    {
      title: "5. Cookies and Analytics",
      content: (
        <p>Our website uses cookies and analytics tools to enhance your user experience, maintain session functionality, and monitor website performance. These tools help us understand how users interact with our site so we can continue to improve our services.</p>
      )
    },
    {
      title: "6. Data Storage and Security",
      content: (
        <p>We implement reasonable technical and organizational security measures to protect your personal information against unauthorized access, loss, misuse, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
      )
    },
    {
      title: "7. Customer Rights",
      content: (
        <div className="space-y-4">
          <p>You have certain rights regarding your personal information, including the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of any inaccurate or incomplete information</li>
            <li>Request deletion of your information, subject to certain legal and operational requirements</li>
          </ul>
        </div>
      )
    },
    {
      title: "8. Third-Party Links",
      content: (
        <p>Our website may contain links to external third-party websites. Please be aware that Myoko Shuttle is not responsible for the privacy practices or content of these external sites.</p>
      )
    },
    {
      title: "9. Changes to This Policy",
      content: (
        <p>We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. Updates will be posted on this page without prior notice.</p>
      )
    },
    {
      title: "10. Contact Information",
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
          title="Privacy Policy" 
          description="Myoko Shuttle respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect customer information when using our website and shuttle services." 
        />
        
        <div className="mt-16 space-y-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4 pb-8 border-b border-slate-100 last:border-0">
              <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              <div className="text-slate-600 leading-relaxed font-medium">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            By using the Myoko Shuttle website and services, you agree to the terms outlined in this Privacy Policy.
          </p>
        </div>
      </Container>
    </Section>
  )
}
