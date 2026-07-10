import { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Bus,
  ArrowRight,
  MapPin,
  Clock,
  Mountain,
  CheckCircle2,
  Backpack,
  CalendarDays
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LocalTimetable } from "@/components/services/local-timetable"
import { LocalBusStops } from "@/components/services/local-bus-stops"

export const metadata: Metadata = {
  title: "Local Mt. Myoko Shuttle | Myoko Shuttle",
  description: "Convenient local shuttle transportation between resorts, stations, and hotels around Mt. Myoko during the winter season.",
}

export default function LocalShuttlePage() {
  const serviceFeatures = [
    { icon: Mountain, text: "Resort-to-Resort Transport" },
    { icon: Clock, text: "Winter Season Operation" },
    { icon: Backpack, text: "Ski & Snowboard Friendly" },
    { icon: ArrowRight, text: "Multiple Daily Services" },
    { icon: MapPin, text: "Convenient Local Access" },
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
                  <Bus className="w-3.5 h-3.5" />
                  Local Connection
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                  Local Shuttle Services <span className="text-primary">Around Mt. Myoko</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Convenient local shuttle transportation between Myoko Kogen Station, Akakura, Ikenotaira, Suginohara, Tangram, Madarao, and surrounding resort areas during the winter season.
                </p>
              </div>

              {/* Pricing Badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 group transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <MapPin className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">Local Routes</p>
                    <p className="text-xl font-bold text-slate-900">From <span className="text-primary">¥500</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100 group transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <Mountain className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">Resort Transfers</p>
                    <p className="text-xl font-bold text-slate-900">Up to <span className="text-primary">¥3,500</span></p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="#timetables"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "h-14 px-8 text-lg font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all hover:-translate-y-0.5"
                  )}
                >
                  View Timetables
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
                  <Bus className="w-24 h-24 text-primary" />
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
                    <p className="text-sm font-bold text-slate-900">Easy Daily Use</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Pay on the bus with cash or card.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Timetables Section */}
      <LocalTimetable />

      {/* Bus Stop Locations Section */}
      <LocalBusStops />
    </div>
  )
}
