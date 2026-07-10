import { Metadata } from "next"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { BookingForm } from "@/components/booking/booking-form"
import { BookingInfoRow } from "@/components/booking/booking-info-row"
import { BookingHero } from "@/components/booking/booking-hero"

export const metadata: Metadata = {
  title: "Book Your Shuttle | Myoko Shuttle",
  description: "Select your route, schedule, and complete your booking.",
}

export default function BookIndexPage() {
  return (
    <Section className="pb-16 pt-8 md:pt-12">
      <Container className="max-w-[1440px]">
        {/* New Premium Hero Section */}
        <BookingHero />
        
        {/* Informational Row */}
        <BookingInfoRow />

        {/* Main Booking Form & Sidebar */}
        <BookingForm />
      </Container>
    </Section>
  )
}
