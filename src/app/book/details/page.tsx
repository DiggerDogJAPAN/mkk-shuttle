import { Metadata } from "next"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { PageHeading } from "@/components/ui/page-heading"

export const metadata: Metadata = {
  title: "Passenger Details | Book Myoko Shuttle",
  description: "Enter your passenger details.",
}

export default function BookDetailsPage() {
  return (
    <Section>
      <Container>
        <PageHeading 
          title="Passenger Details" 
          description="Step 2: Enter your information." 
        />
        <div className="mt-8 border-2 border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
          Booking step 2 placeholder
        </div>
      </Container>
    </Section>
  )
}
