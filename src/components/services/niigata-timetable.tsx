"use client"

import { useState } from "react"
import { Container } from "@/components/ui/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plane, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Calendar, 
  Info,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"

type TimetableRow = {
  [key: string]: string;
}

type TimetableData = {
  title: string;
  columns: string[];
  rows: TimetableRow[];
  notes: string[];
}

export function NiigataTimetable() {
  const [activeTab, setActiveTab] = useState<"to-myoko" | "from-myoko">("to-myoko")

  const toMyokoData: TimetableData = {
    title: "Niigata Airport to Myoko Area",
    columns: [
      "Niigata Airport", "Joetsu-Myoko Station", "Lotte Arai Resort", 
      "Myoko Kogen Bus Terminal", "Hotel Windsor", "Akakura Kanko Resort", 
      "Akakura Onsen", "Price"
    ],
    rows: [
      {
        "Niigata Airport": "14:00",
        "Joetsu-Myoko Station": "16:05",
        "Lotte Arai Resort": "16:30",
        "Myoko Kogen Bus Terminal": "17:00",
        "Hotel Windsor": "17:06",
        "Akakura Kanko Resort": "17:08",
        "Akakura Onsen": "17:10",
        "Price": "¥4,500 - ¥6,500"
      }
    ],
    notes: [
      "Highway route with 0–1 rest stops of approximately 15 minutes.",
      "Myoko / Akakura Area includes Myoko Kogen Bus Terminal, Hotel Windsor, Akakura Kanko Resort, and Akakura Onsen.",
      "Price breakdown: Joetsu-Myoko (¥4,500), Lotte Arai (¥5,000), Myoko/Akakura (¥6,500)."
    ]
  }

  const fromMyokoData: TimetableData = {
    title: "Myoko Area to Niigata Airport",
    columns: [
      "Akakura Onsen", "Akakura Kanko Resort", "Hotel Windsor", 
      "Myoko Kogen Bus Terminal", "Lotte Arai Resort", "Joetsu-Myoko Station", 
      "Niigata Airport", "Price"
    ],
    rows: [
      {
        "Akakura Onsen": "07:40",
        "Akakura Kanko Resort": "07:45",
        "Hotel Windsor": "07:50",
        "Myoko Kogen Bus Terminal": "07:55",
        "Lotte Arai Resort": "08:25",
        "Joetsu-Myoko Station": "08:50",
        "Niigata Airport": "11:00",
        "Price": "¥4,500 - ¥6,500"
      }
    ],
    notes: [
      "Highway route with 0–1 rest stops of approximately 15 minutes.",
      "Arrival times may vary depending on road and weather conditions.",
      "Price breakdown: To Joetsu-Myoko (¥4,500), To Lotte Arai (¥5,000), From Myoko/Akakura (¥6,500)."
    ]
  }

  const currentData = activeTab === "to-myoko" ? toMyokoData : fromMyokoData

  return (
    <section id="timetables" className="py-24 bg-white border-t border-slate-100">
      <Container>
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              2025–2026 Winter Season
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Niigata Airport Shuttle Timetables
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              2025–2026 winter season services between Niigata Airport, Joetsu-Myoko Station, Lotte Arai, Myoko Kogen, and Akakura.
            </p>
          </div>

          {/* Important Notices Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Info className="w-5 h-5" />
                <span>Operating Information</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span><strong>Season:</strong> 21 December 2025 – 5 March 2026</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span>Reservations are required in advance.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span>Bookings are accepted until 13 days before departure.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>Travel Advisory</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>Please arrive at the meeting point at least 10 minutes before departure.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>Arrival times are estimates and may vary due to weather or traffic conditions.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Timetable Controls */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 p-2 rounded-2xl w-fit self-center">
              <button
                onClick={() => setActiveTab("to-myoko")}
                className={cn(
                  "px-6 py-3 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
                  activeTab === "to-myoko" 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Plane className="w-4 h-4 rotate-45" />
                Niigata Airport to Myoko
              </button>
              <button
                onClick={() => setActiveTab("from-myoko")}
                className={cn(
                  "px-6 py-3 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
                  activeTab === "from-myoko" 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <MapPin className="w-4 h-4" />
                Myoko to Niigata Airport
              </button>
            </div>

            {/* Timetable Display */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{currentData.title}</h3>
                  <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-medium">Winter Season Schedule</p>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href="/book" 
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "rounded-xl font-bold"
                    )}
                  >
                    Book This Route <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto rounded-3xl border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      {currentData.columns.map((col, i) => (
                        <th key={i} className="px-4 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 min-w-[120px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentData.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                        {currentData.columns.map((col, j) => (
                          <td key={j} className={cn(
                            "px-4 py-6 text-sm font-medium",
                            row[col] === "-" ? "text-slate-300" : "text-slate-700",
                            (col.includes("Price") || col.includes("Airport")) && "font-bold text-slate-900"
                          )}>
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.rows.map((row, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                      <Badge variant="outline" className="rounded-lg bg-slate-50 border-slate-100 text-slate-500">Service {i + 1}</Badge>
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">View Schedule</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      {currentData.columns.map((col, j) => {
                        if (row[col] === "-") return null;
                        return (
                          <div key={j} className={cn(
                            "space-y-1",
                            (col.includes("Price") || col.includes("Airport")) ? "col-span-1" : "col-span-1"
                          )}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{col}</p>
                            <p className={cn(
                              "text-sm font-bold",
                              (col.includes("Price")) ? "text-secondary" : "text-slate-900"
                            )}>{row[col]}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Notes */}
              <div className="space-y-6 pt-6">
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Prices include tax
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Info className="w-4 h-4 text-slate-400" />
                    Confirm availability during booking
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Route Specific Notes</h4>
                  <ul className="space-y-3">
                    {currentData.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-slate-400 italic leading-relaxed">
                  Schedules may change depending on weather, traffic, road conditions, and operating dates. 
                  Please confirm availability during booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
