import { ShieldCheck, Snowflake, Mountain, MapPin, Languages } from "lucide-react"

export function BookingHero() {
  return (
    <div className="relative mb-10">
      {/* Intentional Premium Container */}
      <div className="relative bg-slate-50/40 border border-slate-100/80 rounded-[3rem] overflow-hidden p-6 md:p-8 lg:px-16 lg:py-10 shadow-sm">
        {/* Subtle Background Texture */}
        <div className="absolute top-0 right-0 w-1/2 h-full -z-10 opacity-30">
          <div className="absolute top-[-20%] right-[-10%] w-full h-[140%] bg-gradient-to-br from-primary/5 via-transparent to-success/5 blur-3xl rotate-12" />
        </div>

        <div className="max-w-3xl">
          {/* Eyebrow Label */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-3">
            Winter Transfers
          </p>

          {/* Main Heading - Refined Scale */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-[1.1]">
            Reserve Your <span className="text-primary">Winter Shuttle</span>
          </h1>

          {/* Supporting Text - Constrained Width */}
          <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mb-8">
            Direct airport and resort shuttle services connecting Narita, Haneda, Myoko, Shiga Kogen, Madarao, and surrounding destinations.
          </p>

          {/* Compact Trust Indicators with Anchor Line */}
          <div className="pt-6 border-t border-slate-200/60 max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
              {[
                { label: "Secure Stripe Payments", icon: ShieldCheck },
                { label: "Ski Luggage Included", icon: Mountain },
                { label: "English Support", icon: Languages }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                    <item.icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 tracking-tight whitespace-nowrap uppercase opacity-80">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Destination Chips - Tighter Grouping */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "Narita & Haneda",
                "Myoko",
                "Shiga Kogen",
                "Madarao",
                "Niigata"
              ].map((city) => (
                <span key={city} className="px-2.5 py-1 rounded-lg bg-white border border-slate-100/80 shadow-sm text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
