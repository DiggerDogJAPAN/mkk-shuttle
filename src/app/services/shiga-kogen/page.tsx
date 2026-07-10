import { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Plane,
  ArrowRight,
  MapPin,
  Clock,
  Mountain,
  ShieldCheck,
  CheckCircle2,
  Backpack,
  CalendarDays
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ShigaTimetable } from "@/components/services/shiga-timetable"
import { ShigaBusStops } from "@/components/services/shiga-bus-stops"
import { FAQSection } from "@/components/services/faq-section"

export const metadata: Metadata = {
  title: "Shiga Kogen Airport Shuttle | Myoko Shuttle",
  description: "Direct winter shuttle services between Tokyo airports and Shiga Kogen ski resorts with luggage-friendly transport.",
}

export default function ShigaKogenPage() {
  const serviceFeatures = [
    { icon: MapPin, text: "Direct to Shiga Kogen" },
    { icon: Backpack, text: "Ski & Snowboard Friendly" },
    { icon: Mountain, text: "Resort Drop-offs" },
    { icon: Clock, text: "Winter Season Service" },
    { icon: ShieldCheck, text: "Reservations Required" },
  ]

  return (
    <div className="flex flex-col">
      {/* Informational Hero Section */}
      <section className="relative bg-slate-50 py-12 md:py-20 overflow-hidden border-b border-slate-100">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Side: Content & Pricing */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  <Plane className="w-3.5 h-3.5" />
                  Airport Express
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                  Tokyo Airport Transfers <span className="text-primary">to Shiga Kogen</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Direct winter shuttle services from Narita and Haneda airports to Shiga Kogen ski resorts, with luggage-friendly transport and scheduled resort drop-offs.
                </p>
              </div>

              {/* Pricing Badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 group transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <Plane className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">Narita Airport</p>
                    <p className="text-xl font-bold text-slate-900">From <span className="text-primary">¥13,000</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 group transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <Plane className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">Haneda Airport</p>
                    <p className="text-xl font-bold text-slate-900">From <span className="text-primary">¥12,000</span></p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/book"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "h-14 px-8 text-lg font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all hover:-translate-y-0.5"
                  )}
                >
                  Book Your Shuttle
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#bus-stop-locations"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "ghost" }),
                    "h-14 px-8 text-lg font-semibold rounded-xl border border-slate-200 hover:bg-white hover:border-slate-300 transition-all"
                  )}
                >
                  View Bus Stop Locations
                </Link>
              </div>
            </div>

            {/* Right Side: Information Panel */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 transition-opacity group-hover:opacity-10">
                  <ShieldCheck className="w-24 h-24 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-8">Service Information</h3>

                <div className="space-y-6">
                  {serviceFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all duration-300">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <span className="text-lg font-medium text-slate-700">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Instant Confirmation</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Sign in and book online.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Timetables Section */}
      <ShigaTimetable />

      {/* Pickup & Drop-off Locations Section */}
      <ShigaBusStops />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  )
}
