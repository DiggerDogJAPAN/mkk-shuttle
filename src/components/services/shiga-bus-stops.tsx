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

export function ShigaBusStops() {
  const airportStops: BusStop[] = [
    {
      title: "Narita Airport",
      stop: "Terminal 3, Bus Stop No. 6",
      description: "The shuttle picks up and drops off at the Terminal 3 bus stop area, Bus Stop No. 6. If you arrive at Terminal 1 or Terminal 2, please use the airport’s free inter-terminal transport to reach Terminal 3.",
      importantNote: "Narita Airport drop-off is Terminal 3 only.",
      buttonText: "View Narita Bus Map",
      externalLink: "https://www.narita-airport.jp/ja/access/bus/",
      type: "airport"
    },
    {
      title: "Haneda Airport",
      stop: "Haneda Airport Garden, 1F Bus Terminal, Bus Stop No. 5",
      description: "The shuttle meets at Haneda Airport Garden, 1st floor, Bus Stop No. 5. It is approximately 7 minutes from Haneda Airport Terminal 3 via the connecting passage.",
      buttonText: "View Haneda Bus Map",
      externalLink: "https://www.shopping-sumitomo-rd.com/haneda/facility/",
      type: "airport"
    }
  ]

  const areaStops: BusStop[] = [
    {
      title: "Yudanaka / Yamanouchi",
      stop: "Yudanaka / Yamanouchi area stop",
      description: "Main lower Shiga Kogen area stop before the mountain resort stops.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Maruike / Hasuike",
      stop: "Maruike / Hasuike bus stop",
      description: "Central Shiga Kogen stop serving the Maruike and Hasuike resort areas.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Hoppo",
      stop: "Hoppo bus stop",
      description: "Convenient stop for the Hoppo area of Shiga Kogen.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Takamagahara",
      stop: "Takamagahara bus stop",
      description: "Stop for the Takamagahara ski area and nearby accommodation.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Ichinose A",
      stop: "Ichinose A bus stop",
      description: "One of the main Ichinose area stops in Shiga Kogen.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Ichinose B",
      stop: "Ichinose B bus stop",
      description: "Additional Ichinose area stop for nearby hotels and ski access.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Yakebitai West",
      stop: "Yakebitai West bus stop",
      description: "Stop serving the western side of the Yakebitaiyama area.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Yakebitai South",
      stop: "Yakebitai South bus stop",
      description: "Stop serving the southern side of the Yakebitaiyama area.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Yakebitai East",
      stop: "Yakebitai East bus stop",
      description: "Stop serving the eastern side of the Yakebitaiyama area.",
      buttonText: "View Location",
      type: "resort"
    },
    {
      title: "Okushiga",
      stop: "Okushiga bus stop",
      description: "Final upper Shiga Kogen stop serving the Okushiga area.",
      buttonText: "View Location",
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
              Find your airport meeting point and Shiga Kogen area bus stops before travel.
            </p>
          </div>

          {/* Group 1: Airports */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-4 shrink-0">Airport Meeting Points</h3>
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
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-4 shrink-0">Shiga Kogen Area Stops</h3>
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
