"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { PageHeading } from "@/components/ui/page-heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle2, Ticket } from "lucide-react"

import { getBookingReference } from "@/lib/utils/booking"

function ConfirmationDetails() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  return (
    <Card className="border-success/20 shadow-sm">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <CardTitle className="text-2xl text-foreground">Booking Confirmed!</CardTitle>
        <p className="text-muted-foreground mt-2">
          Thank you for choosing Myoko Shuttle. Your booking has been successfully received.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-muted-foreground font-medium">Booking Reference</span>
            <span className="font-mono font-bold text-foreground">
              {bookingId ? getBookingReference(bookingId) : "PENDING"}
            </span>
          </div>
          
          {/* Placeholder for actual booking data fetch later */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-muted-foreground mb-1">Status</span>
              <span className="inline-flex items-center rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
                Pending Payment
              </span>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1">Passengers</span>
              <span className="font-medium text-foreground">...</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/account/bookings" 
            className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
          >
            <Ticket className="w-4 h-4 mr-2" />
            View My Bookings
          </Link>
          <Link 
            href="/book" 
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-full sm:w-auto bg-background border border-border")}
          >
            Make Another Booking
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl mx-auto">
          <PageHeading 
            title="Success" 
            description="Your shuttle transfer request is complete." 
          />
          <div className="mt-8">
            <Suspense fallback={
              <div className="py-24 text-center text-muted-foreground">Loading confirmation details...</div>
            }>
              <ConfirmationDetails />
            </Suspense>
          </div>
        </div>
      </Container>
    </Section>
  )
}
