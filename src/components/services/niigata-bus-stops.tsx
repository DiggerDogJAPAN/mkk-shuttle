"use client"

import { Container } from "@/components/ui/container"
import { 
  Plane, 
  MapPin, 
  Hotel, 
  Train, 
  Mountain, 
  ExternalLink, 
  Info, 
  AlertCircle,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

type BusStop = {
  title: string;
  stop: string;
  description: string;
  importantNote?: string;
  buttonText: string;
  externalLink?: string;
  type: "airport" | "resort" | "hotel" | "station";
}

export function NiigataBusStops() {
  const airportStops: BusStop[] = [
    {
      title: "Niigata Airport",
      stop: "Niigata Airport bus pickup area",
      description: "Pickup and drop-off point at Niigata Airport. Please check your booking confirmation and arrive at the meeting point at least 10 minutes before departure.",
      buttonText: "View Location",
      type: "airport"
    },
    {
      title: "Joetsu-Myoko Station",
      stop: "Joetsu-Myoko Station bus pickup area",
      description: "Pickup and drop-off point at Joetsu-Myoko Station for connections to and from Niigata Airport.",
      buttonText: "View Location",
      type: "station"
    }
  ]

  const areaStops: BusStop[] = [
    {
      title: "Lotte Arai Resort",
      stop: "Main hotel entrance mini roundabout",
      description: "Pickup and drop-off point outside the main hotel building.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Myoko Kogen Bus Terminal",
      stop: "Myoko Kogen Bus Terminal",
      description: "Central Myoko Kogen bus stop for local transport connections.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Hotel Windsor / Shin Akakura",
      stop: "Hotel Windsor",
      description: "Bus stop located in front of Hotel Windsor in the Shin Akakura area.",
      buttonText: "View Location",
      externalLink: "https://jamjamliner.jp/meetmap/meetmap.html?MEETMAP=akakura",
      type: "hotel"
    },
    {
      title: "Akakura Kanko Resort",
      stop: "Akakura Kanko Resort Sanroku Station Rotary",
      description: "Located at the bottom of the resort near the gondola area.",
      buttonText: "View Location",
      externalLink: "https://jamjamliner.jp/meetmap/meetmap.html?MEETMAP=akakura_kanko",
      type: "resort"
    },
    {
      title: "Akakura Onsen",
      stop: "Akakura Onsen Ski Area Large Bus Parking Area",
      description: "Main Akakura Onsen stop near the ski area entrance.",
      buttonText: "View Location",
      externalLink: "https://jamjamliner.jp/meetmap/meetmap.html?MEETMAP=akakura_spa",
      type: "resort"
    }
  ]

  const getIcon = (type: BusStop["type"]) => {
    switch (type) {
      case "airport": return <Plane className="w-5 h-5" />;
      case "resort": return <Mountain className="w-5 h-5" />;
      case "hotel": return <Hotel className="w-5 h-5" />;
      case "station": return <Train className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  }

  const StopCard = ({ stop }: { stop: BusStop }) => (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
          {getIcon(stop.type)}
        </div>
        <h3 className="text-xl font-bold text-slate-900 leading-tight">{stop.title}</h3>
      </div>
      
      <div className="space-y-4 flex-1">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meeting Point</p>
          <p className="text-sm font-bold text-primary leading-snug">{stop.stop}</p>
        </div>
        
        <p className="text-sm text-slate-600 leading-relaxed">
          {stop.description}
        </p>

        {stop.importantNote && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-700 leading-normal">{stop.importantNote}</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        {stop.externalLink ? (
          <a 
            href={stop.externalLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-primary transition-colors group/btn"
          >
            {stop.buttonText}
            <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>
        ) : (
          <span className="text-xs font-medium text-slate-400 italic">Location coming soon</span>
        )}
      </div>
    </div>
  )

  return (
    <section id="bus-stop-locations" className="py-24 bg-slate-50/50 scroll-mt-20">
      <Container>
        <div className="flex flex-col gap-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Pickup & Drop-off Locations
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Find your Niigata Airport meeting point and Myoko area bus stops before travel.
            </p>
          </div>

          {/* Group 1: Airports */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-4 shrink-0">Airport / Station Meeting Points</h3>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {airportStops.map((stop, idx) => (
                <StopCard key={idx} stop={stop} />
              ))}
            </div>
          </div>

          {/* Group 2: Resorts/Area */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-4 shrink-0">Myoko Area Stops</h3>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {areaStops.map((stop, idx) => (
                <StopCard key={idx} stop={stop} />
              ))}
            </div>
          </div>

          {/* Footer Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-200">
            <div className="flex gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Please arrive early:</span> We recommend being at your meeting point at least 10 minutes before the scheduled departure.
              </p>
            </div>
            <div className="flex gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Service updates:</span> Pickup and drop-off points may change depending on weather, snow conditions, road access, or operating requirements.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
