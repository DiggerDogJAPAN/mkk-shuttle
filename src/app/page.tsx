import Link from "next/link"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"
import { ShieldCheck, Armchair, Clock, ArrowRight, CalendarDays, Mountain, Plane, Snowflake, MapPin, Languages } from "lucide-react"
import { generateSeoMetadata } from "@/lib/seo"

export const metadata = generateSeoMetadata({
  title: 'Airport Shuttle Between Tokyo Airports & Myoko',
  description:
    'Book airport shuttle transfers between Narita, Haneda and Myoko Kogen with secure online payment and easy booking management.',
  path: '/',
})

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-slate-50 border-b border-slate-100 overflow-hidden py-12 lg:py-20 flex items-center min-h-[600px] lg:min-h-[680px]">
        {/* Full-width Snowy Mountain Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image 
            src="/images/snowy-mountain.jpg" 
            alt="Snowy Mountain background" 
            fill 
            className="object-cover object-right-bottom opacity-85"
            priority
          />
          {/* Strong gradient overlay: solid/very bright on the left, fading to transparent on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/10 lg:from-slate-50 lg:via-slate-50/85 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-2xl lg:max-w-[55%] space-y-8">
            <div className="space-y-4">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center rounded-full bg-blue-50/85 backdrop-blur-sm border border-blue-100/50 px-3.5 py-1.5 text-xs font-bold text-[#1E3A5F] uppercase tracking-wider w-fit">
                <ShieldCheck className="w-3.5 h-3.5 mr-2 text-[#1E3A5F]" />
                Safe. Comfortable. On Time.
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Myoko Airport <br />
                <span className="text-[#1E3A5F]">Shuttle Transfers</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Book reliable shuttle transport between Tokyo airports, Myoko Kogen, Madarao and Shiga Kogen.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/book"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "h-14 px-8 text-md font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
                )}
              >
                Book Your Bus
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/services/narita-haneda"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "h-14 px-8 text-md font-bold rounded-xl bg-white text-slate-700 border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5"
                )}
              >
                <CalendarDays className="w-5 h-5 text-slate-500 group-hover:text-slate-900" />
                View Timetables
              </Link>
            </div>

            {/* Destination Chips */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Destinations We Serve
              </span>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/services/narita-haneda"
                  className="px-3.5 py-1.5 bg-blue-50/40 hover:bg-blue-50 border border-blue-100/50 text-slate-600 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Narita & Haneda
                </Link>
                <Link
                  href="/services/local-shuttle"
                  className="px-3.5 py-1.5 bg-blue-50/40 hover:bg-blue-50 border border-blue-100/50 text-slate-600 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Myoko
                </Link>
                <Link
                  href="/services/shiga-kogen"
                  className="px-3.5 py-1.5 bg-blue-50/40 hover:bg-blue-50 border border-blue-100/50 text-slate-600 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Shiga Kogen
                </Link>
                <Link
                  href="/services/narita-haneda"
                  className="px-3.5 py-1.5 bg-blue-50/40 hover:bg-blue-50 border border-blue-100/50 text-slate-600 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Madarao
                </Link>
                <Link
                  href="/services/local-shuttle"
                  className="px-3.5 py-1.5 bg-blue-50/40 hover:bg-blue-50 border border-blue-100/50 text-slate-600 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Local Shuttle
                </Link>
              </div>
            </div>

            {/* Service Highlights Grid */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 border border-blue-100/30 text-[#1E3A5F]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight">Trusted & Reliable</span>
                  <span className="text-xs text-slate-500 mt-0.5">Safe journeys you can count on</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 border border-blue-100/30 text-[#1E3A5F]">
                  <Armchair className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight">Comfortable Travel</span>
                  <span className="text-xs text-slate-500 mt-0.5">Modern buses with premium comfort</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 border border-blue-100/30 text-[#1E3A5F]">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight">On Time, Every Time</span>
                  <span className="text-xs text-slate-500 mt-0.5">Punctual service you can rely on</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 border border-blue-100/30 text-[#1E3A5F]">
                  <Languages className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight">English Support</span>
                  <span className="text-xs text-slate-500 mt-0.5">Here to help before, during and after your trip</span>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Bento Services Section */}
      <section className="px-4 py-8 md:px-6 md:py-16 bg-background">
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* LEFT COLUMN: Flagship Featured Card */}
            <div className="h-full">
              <Link
                href="/services/narita-haneda"
                className="group relative flex flex-col h-full min-h-[500px] lg:min-h-full overflow-hidden rounded-[2.5rem] shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: "url('/images/service-airport.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="relative flex-1 flex flex-col justify-end p-10 md:p-14 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest w-fit">
                    Flagship Service
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">Tokyo Airport Transfers</h3>
                    <p className="text-xl text-white/80 max-w-md leading-relaxed">
                      Direct shuttle services between Narita, Haneda, and Myoko area ski resorts.
                    </p>
                  </div>
                  <div className="pt-6">
                    <span className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold rounded-2xl bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-slate-900 group-hover:border-white group-hover:-translate-y-1 group-hover:shadow-xl group/btn">
                      View Airport Transfers
                      <ArrowRight className="w-5 h-5 transition-colors group-hover/btn:text-slate-900" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* RIGHT COLUMN: Modern Informational Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Card 1: Shiga Kogen Shuttle */}
              <Link
                href="/services/shiga-kogen"
                className="group relative flex flex-col justify-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Mountain className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                    From ¥11,000
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Shiga Kogen Shuttle</h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span>Tokyo Airports</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Shiga Kogen</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    APPROX. 5 HRS
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                    VIEW TRANSFERS <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Card 2: Niigata Airport Transfers */}
              <Link
                href="/services/niigata-airport"
                className="group relative flex flex-col justify-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                    From ¥5,000
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Niigata Airport Transfers</h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span>Niigata Airport</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Myoko Destinations</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    APPROX. 2 HRS
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                    VIEW TRANSFERS <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Card 3: Mt. Myoko Local Shuttle */}
              <Link
                href="/services/local-shuttle"
                className="group relative flex flex-col justify-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    Daily Service
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Mt. Myoko Local Shuttle</h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span>Akakura</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Ikenotaira</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Suginohara</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    Winter Scheduled
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                    VIEW LOCAL SERVICES <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Card 4: Snow Monkey Park */}
              <Link
                href="/services/snow-monkey"
                className="group relative flex flex-col justify-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Snowflake className="w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                    Day Trips
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Snow Monkey Park</h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span>Myoko / Madarao</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Jigokudani</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    Full Day Tours
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                    VIEW TIMETABLE <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
