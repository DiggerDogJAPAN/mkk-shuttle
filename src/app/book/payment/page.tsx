import { Metadata } from "next"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { PageHeading } from "@/components/ui/page-heading"

export const metadata: Metadata = {
  title: "Payment | Book Myoko Shuttle",
  description: "Secure checkout.",
}

export default function BookPaymentPage() {
  return (
    <Section>
      <Container>
        <PageHeading 
          title="Payment" 
          description="Step 3: Securely pay for your booking." 
        />
        <div className="mt-8 border-2 border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
          Booking step 3 placeholder
        </div>
      </Container>
    </Section>
  )
}
