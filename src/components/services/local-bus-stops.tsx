"use client"

import { Container } from "@/components/ui/container"
import { 
  MapPin, 
  Mountain, 
  Hotel, 
  Train, 
  ArrowRight, 
  ExternalLink, 
  Info, 
  AlertTriangle,
  Bus
} from "lucide-react"
import { cn } from "@/lib/utils"

type BusStop = {
  title: string;
  type: "resort" | "hotel" | "station";
  externalLink?: string;
}

type RouteGroup = {
  title: string;
  status?: "active" | "suspended";
  flow: string[];
  stops: BusStop[];
}

export function LocalBusStops() {
  const routes: RouteGroup[] = [
    {
      title: "Akakura / Ikenotaira / Suginohara Line",
      status: "active",
      flow: ["Bus Terminal", "Akakura Onsen", "Akakura Kanko", "Hotel Windsor", "Ikenotaira", "Suginohara"],
      stops: [
        { title: "Myoko Kogen Bus Terminal", type: "station" },
        { title: "Akakura Onsen Ski Area", type: "resort" },
        { title: "Akakura Kanko Resort Ski Area", type: "resort" },
        { title: "Hotel Windsor", type: "hotel" },
        { title: "Ikenotaira Alpen Blick Spa", type: "hotel" },
        { title: "Ikenotaira Ski Area", type: "resort" },
        { title: "Ikenotaira Tourist Association", type: "station" },
        { title: "Lime Resort", type: "hotel" },
        { title: "Suginozawa Fire Hut", type: "station" },
        { title: "Suginohara Ski Area", type: "resort" },
      ]
    },
    {
      title: "Lotte Arai / Akakura / Madarao Line",
      status: "suspended",
      flow: ["Lotte Arai", "Akakura", "Bus Terminal", "Tangram", "Madarao"],
      stops: [
        { title: "Lotte Arai Resort", type: "resort" },
        { title: "Akakura Onsen Ski Area", type: "resort" },
        { title: "Akakura Kanko Resort Ski Area", type: "resort" },
        { title: "Hotel Windsor", type: "hotel" },
        { title: "Myoko Kogen Bus Terminal", type: "station" },
        { title: "Tangram", type: "resort" },
        { title: "Madarao Kogen Hotel", type: "hotel" },
      ]
    }
  ]

  const getIcon = (type: BusStop["type"]) => {
    switch (type) {
      case "resort": return <Mountain className="w-4 h-4" />;
      case "hotel": return <Hotel className="w-4 h-4" />;
      case "station": return <Train className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  }

  return (
    <section id="bus-stop-locations" className="py-24 bg-slate-50/50 scroll-mt-20">
      <Container>
        <div className="flex flex-col gap-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Local Shuttle Bus Stops
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Main pickup and drop-off points for the Mt. Myoko local shuttle services.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16">
            {routes.map((route, idx) => (
              <div key={idx} className="space-y-10">
                {/* Route Header & Flow */}
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Bus className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">{route.title}</h3>
                    </div>
                    {route.status === "suspended" && (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider border border-amber-100">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Operation Start Undecided
                      </div>
                    )}
                  </div>

                  {/* Route Flow Display */}
                  <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm overflow-x-auto">
                    <div className="flex items-center gap-4 min-w-max">
                      {route.flow.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{point}</span>
                          </div>
                          {pIdx < route.flow.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-slate-200 mt-[-20px]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stop Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {route.stops.map((stop, sIdx) => (
                    <div key={sIdx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                          {getIcon(stop.type)}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{stop.title}</h4>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                        {stop.externalLink ? (
                          <a 
                            href={stop.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5"
                          >
                            View Map
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Location Coming Soon</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm max-w-2xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Important:</span> Bus stop locations may change depending on snow conditions, road access, and operating requirements. Please confirm your pickup point locally or at your accommodation front desk.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
