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
  AlertTriangle,
  ArrowRightLeft
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

export function TimetableSection() {
  const [activeTab, setActiveTab] = useState<"to-myoko" | "from-myoko">("to-myoko")

  const toMyokoData: TimetableData = {
    title: "Narita / Haneda Airport to Myoko & Madarao",
    columns: [
      "Narita Airport", "Haneda Airport", "Miyoshi PA", "Iiyama Station",
      "Madarao Kogen", "Hotel Tangram", "Ikenotaira", "Shin-Akakura",
      "Akakura Kanko", "Akakura Onsen", "Price Narita", "Price Haneda"
    ],
    rows: [
      {
        "Narita Airport": "-",
        "Haneda Airport": "08:00",
        "Saku PA": "11:30",
        "Iiyama Station": "12:40",
        "Madarao Kogen": "13:10",
        "Hotel Tangram": "13:30",
        "Ikenotaira": "-",
        "Shin-Akakura": "14:00",
        "Akakura Kanko": "14:05",
        "Akakura Onsen": "14:10",
        "Price Narita": "-",
        "Price Haneda": "¥11,500"
      },
      {
        "Narita Airport": "10:00",
        "Haneda Airport": "10:30",
        "Saku PA": "14:00",
        "Iiyama Station": "15:10",
        "Madarao Kogen": "15:40",
        "Hotel Tangram": "16:00",
        "Ikenotaira": "-",
        "Shin-Akakura": "16:30",
        "Akakura Kanko": "16:35",
        "Akakura Onsen": "16:40",
        "Price Narita": "¥12,500",
        "Price Haneda": "¥11,500"
      },
      {
        "Narita Airport": "21:20",
        "Haneda Airport": "22:20",
        "Saku PA": "-",
        "Iiyama Station": "-",
        "Madarao Kogen": "07:25*",
        "Hotel Tangram": "07:50*",
        "Ikenotaira": "08:20*",
        "Shin-Akakura": "08:30*",
        "Akakura Kanko": "-",
        "Akakura Onsen": "08:35*",
        "Price Narita": "¥13,500",
        "Price Haneda": "¥12,500"
      }
    ],
    notes: [
      "Akakura stops include Akakura Onsen Ski Area, Akakura Kanko Resort Ski Area, and Hotel Windsor.",
      "The Night bus arrival does not stop at Akakura Kanko Resort Ski Area.",
      "Lotte Arai Resort has an additional ¥1,500 surcharge.",
      "Some services may have blackout dates. Check availability when booking.",
      "* Next day arrival."
    ]
  }

  const fromMyokoData: TimetableData = {
    title: "Myoko & Madarao to Haneda / Narita Airport",
    columns: [
      "Akakura Onsen", "Akakura Kanko", "Shin-Akakura", "Ikenotaira",
      "Tangram Madarao", "Madarao Kogen", "Iiyama Station", "Miyoshi PA",
      "Tokyo Terminal", "Haneda Airport", "Narita Airport",
      "Price Narita", "Price Haneda", "Price Tokyo"
    ],
    rows: [
      {
        "Akakura Onsen": "08:00",
        "Akakura Kanko": "08:05",
        "Shin-Akakura": "08:10",
        "Ikenotaira": "-",
        "Tangram Madarao": "08:30",
        "Madarao Kogen": "08:40",
        "Iiyama Station": "09:10",
        "Saku PA": "11:00",
        "Tokyo Terminal": "14:30",
        "Haneda Airport": "15:10",
        "Narita Airport": "15:30",
        "Price Narita": "¥12,500",
        "Price Haneda": "¥11,500",
        "Price Tokyo": "¥9,500"
      },
      {
        "Akakura Onsen": "10:00",
        "Akakura Kanko": "10:05",
        "Shin-Akakura": "10:10",
        "Ikenotaira": "-",
        "Tangram Madarao": "10:30",
        "Madarao Kogen": "10:40",
        "Iiyama Station": "11:10",
        "Saku PA": "13:00",
        "Tokyo Terminal": "-",
        "Haneda Airport": "-",
        "Narita Airport": "17:00",
        "Price Narita": "¥12,500",
        "Price Haneda": "-",
        "Price Tokyo": "-"
      },
      {
        "Akakura Onsen": "14:20",
        "Akakura Kanko": "-",
        "Shin-Akakura": "14:25",
        "Ikenotaira": "14:35",
        "Tangram Madarao": "15:05",
        "Madarao Kogen": "15:40",
        "Iiyama Station": "-",
        "Saku PA": "-",
        "Tokyo Terminal": "21:36",
        "Haneda Airport": "-",
        "Narita Airport": "-",
        "Price Narita": "-",
        "Price Haneda": "-",
        "Price Tokyo": "¥9,500"
      }
    ],
    notes: [
      "Akakura pickup points include Akakura Onsen Ski Area, Akakura Kanko Resort Ski Area, and Hotel Windsor.",
      "Lotte Arai Resort departures have an additional ¥1,500 surcharge.",
      "Some services may have blackout dates. Check availability when booking."
    ]
  }

  const currentData = activeTab === "to-myoko" ? toMyokoData : fromMyokoData

  return (
    <section id="timetables" className="py-24 bg-white border-t border-slate-100">
      <Container>
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              2025–2026 Winter Season
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Airport Shuttle Timetables
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Direct services between Narita Airport, Haneda Airport, Myoko, Madarao, Tangram, Akakura, and Lotte Arai.
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
                  <span><strong>Season:</strong> 19 December 2025 – 23 March 2026</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span>Reservations are required in advance.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span>Buses do not operate on days with no reservations.</span>
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
                Airports to Myoko / Madarao
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
                Myoko / Madarao to Airports
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
                        <th key={i} className="px-4 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
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
