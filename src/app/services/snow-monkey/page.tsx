import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/ui/container"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  ArrowRight,
  Info,
  AlertTriangle,
  CreditCard,
  MapPin,
  Play,
  Ticket,
  Footprints,
  Bus
} from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Snow Monkey Park Shuttle Bus | Myoko Shuttle",
  description: "Visit the world-famous Jigokudani Wild Monkey Park with easy return shuttle transport from Myoko and Lotte Arai.",
}

export default function SnowMonkeyPage() {
  const outboundTimes = [
    { stop: "Lotte Arai Resort", time: "08:55" },
    { stop: "Akakura Onsen Ski Resort", time: "10:00" },
    { stop: "Akakura Kanko Resort", time: "10:02" },
    { stop: "Hotel Windsor", time: "10:04" },
    { stop: "Myoko Kogen Bus Terminal", time: "10:10" },
    { stop: "Snow Monkey Park", time: "11:10" },
  ]

  const returnTimes = [
    { stop: "Snow Monkey Park", time: "14:00" },
    { stop: "Myoko Kogen Bus Terminal", time: "15:00" },
    { stop: "Akakura Onsen Ski Resort", time: "15:10" },
    { stop: "Akakura Kanko Resort", time: "15:13" },
    { stop: "Hotel Windsor", time: "15:15" },
    { stop: "Lotte Arai Resort", time: "16:00" },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-slate-900 overflow-hidden py-20">
        {/* Background Decorative Element */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/snow-monkey/1.jpg" 
            alt="Snow Monkey" 
            fill 
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A86A]/20 text-[#C9A86A] text-xs font-bold uppercase tracking-wider border border-[#C9A86A]/30">
                  <Ticket className="w-3.5 h-3.5" />
                  Winter Experience
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                  Snow Monkey Park <br />
                  <span className="text-[#C9A86A]">Shuttle Bus</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
                  Visit the world-famous Jigokudani Wild Monkey Park with easy return shuttle transport from Myoko and Lotte Arai.
                </p>
              </div>

              {/* Key Info Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="h-10 w-10 rounded-xl bg-[#C9A86A]/20 flex items-center justify-center text-[#C9A86A]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operating Dates</p>
                    <p className="text-sm font-bold text-white">Feb 9 – Mar 3, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="h-10 w-10 rounded-xl bg-[#C9A86A]/20 flex items-center justify-center text-[#C9A86A]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment</p>
                    <p className="text-sm font-bold text-white">Cash Only / On Board</p>
                  </div>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-xs text-slate-400 block mb-1">Akakura Return</span>
                  <span className="text-2xl font-bold text-white">¥5,000</span>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-xs text-slate-400 block mb-1">Lotte Arai Return</span>
                  <span className="text-2xl font-bold text-white">¥8,000</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="#timetable"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "h-14 px-8 text-lg font-bold rounded-xl flex items-center justify-center gap-3 bg-[#C9A86A] hover:bg-[#BFA16A] text-slate-900 border-none shadow-xl shadow-[#C9A86A]/20 transition-all hover:-translate-y-0.5"
                  )}
                >
                  View Timetable
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#notes"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "ghost" }),
                    "h-14 px-8 text-lg font-bold rounded-xl bg-black/20 text-white backdrop-blur-md border border-white/30 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white hover:text-slate-900 hover:border-white hover:-translate-y-1 hover:shadow-xl group"
                  )}
                >
                  Important Notes
                </Link>
              </div>
            </div>

            {/* Right: Video Card */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#C9A86A]/20 rounded-[2.5rem] blur-2xl group-hover:bg-[#C9A86A]/30 transition-all duration-500" />
              <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-slate-800">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/OLLPDuprgSg" 
                  title="Snow Monkey Park"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Timetable Section */}
      <section id="timetable" className="py-24 bg-white scroll-mt-20">
        <Container>
          <div className="flex flex-col gap-12">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Snow Monkey Shuttle Timetable
              </h2>
              <p className="text-lg text-slate-600">
                Scheduled return services from Myoko and Lotte Arai to Jigokudani Wild Monkey Park.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Outbound */}
              <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Outbound Schedule</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">To Snow Monkey Park</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {outboundTimes.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors",
                          idx === outboundTimes.length - 1 ? "bg-[#C9A86A]" : "bg-slate-300 group-hover:bg-primary"
                        )} />
                        <span className={cn(
                          "text-sm font-medium",
                          idx === outboundTimes.length - 1 ? "text-[#C9A86A] font-bold" : "text-slate-600"
                        )}>{item.stop}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A86A] text-slate-900">
                    <ArrowRight className="w-6 h-6 rotate-180" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Return Schedule</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">From Snow Monkey Park</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {returnTimes.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors",
                          idx === 0 ? "bg-[#C9A86A]" : "bg-slate-700 group-hover:bg-[#C9A86A]"
                        )} />
                        <span className={cn(
                          "text-sm font-medium",
                          idx === 0 ? "text-[#C9A86A] font-bold" : "text-slate-400"
                        )}>{item.stop}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <Container>
          <div className="flex flex-col gap-12">
            <div className="max-w-3xl space-y-4 text-center mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Experience the Magic
              </h2>
              <p className="text-lg text-slate-600">
                See the world-famous Japanese macaques in their natural winter habitat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">
              <div className="md:col-span-8 relative rounded-[2.5rem] overflow-hidden group">
                <Image 
                  src="/images/snow-monkey/1.jpg" 
                  alt="Snow Monkey 1" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
              <div className="md:col-span-4 grid grid-rows-2 gap-6">
                <div className="relative rounded-[2.5rem] overflow-hidden group">
                  <Image 
                    src="/images/snow-monkey/2.jpg" 
                    alt="Snow Monkey 2" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>
                <div className="relative rounded-[2.5rem] overflow-hidden group">
                  <Image 
                    src="/images/snow-monkey/3.jpg" 
                    alt="Snow Monkey 3" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Important Notes Section */}
      <section id="notes" className="py-24 bg-white scroll-mt-20">
        <Container>
          <div className="flex flex-col gap-12">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Important Notes
              </h2>
              <p className="text-lg text-slate-600">
                Please read these details carefully before planning your trip to the monkey park.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4B483]/20 text-[#BFA16A]">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">Tickets & Payment</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Tickets are for return travel only. Please pay cash on board before departure. No advance reservations are required or accepted.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Info className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">Entrance Fees</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      The park entrance fee is <strong>not included</strong> in the shuttle price. Entrance is ¥800 for adults and ¥400 for children.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Footprints className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">The Walk to the Park</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      The park is a 25-30 minute walk through the forest from the bus stop. Please ensure you allow enough time to return for the 14:00 departure.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 rounded-3xl bg-[#D4B483]/10 border border-[#D4B483]/20">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C9A86A] text-slate-900">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#C9A86A]">Operating Policy</h4>
                    <p className="text-sm text-[#BFA16A] leading-relaxed">
                      If there are no passengers on the morning outbound bus, the return shuttle at 14:00 will not operate.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-10 rounded-[3rem] bg-slate-900 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Bus className="w-32 h-32" />
              </div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h3 className="text-3xl font-bold">Ready to see the Snow Monkeys?</h3>
                <p className="text-slate-400">
                  No booking needed. Simply check the timetable and meet us at your nearest bus stop. 
                  Remember to bring cash for the journey.
                </p>
                <div className="pt-4">
                  <Link 
                    href="#timetable"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-14 px-10 rounded-xl bg-[#C9A86A] hover:bg-[#BFA16A] text-slate-900 border-none font-bold text-lg shadow-xl shadow-[#C9A86A]/20 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center"
                    )}
                  >
                    See You On Board
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
