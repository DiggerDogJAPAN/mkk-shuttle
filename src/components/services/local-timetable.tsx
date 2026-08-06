"use client"

import { useState } from "react"
import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  Info,
  CreditCard,
  Mountain
} from "lucide-react"
import { cn } from "@/lib/utils"

type TimetableRow = {
  mark: string;
  times: string[];
}

type DirectionData = {
  label: string;
  columns: string[];
  rows: TimetableRow[];
  notes?: string[];
}

type RouteData = {
  title: string;
  period: string;
  fare: string;
  directions: DirectionData[];
  notes: string[];
  status?: "active" | "suspended";
}

export function LocalTimetable() {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [directionIndex, setDirectionIndex] = useState<number>(0)

  const routes: RouteData[] = [
    {
      title: "Akakura - Ikenotaira - Suginohara Line",
      period: "20 December 2026 - 22 March 2027",
      fare: "One way: ¥1,000 | Akakura Onsen to Hotel Windsor: ¥500",
      status: "active",
      directions: [
        {
          label: "Akakura to Ikenotaira to Suginohara",
          columns: [
            "Service", "Myoko Bus Terminal", "Akakura Onsen",
            "Akakura Kanko", "Hotel Windsor", "Alpen Blick Spa",
            "Ikenotaira Ski Resort", "Ikenotaira T.O", "Lime Resort",
            "Suginozawa Fire Station", "Suginohara Ski Resort"
          ],
          rows: [
            { mark: "◎", times: ["7:50", "8:00", "8:02", "8:05", "8:12", "8:15", "8:18", "8:19", "8:23", "8:27"] },
            { mark: "★", times: ["8:20", "8:30", "8:32", "8:34", "8:40", "8:45", "8:48", "8:49", "8:53", "8:57"] },
            { mark: "◎", times: ["—", "9:00", "9:02", "9:04", "9:10", "9:15", "9:18", "9:19", "9:23", "9:27"] },
            { mark: "★", times: ["—", "9:30", "9:32", "9:34", "9:40", "9:45", "9:48", "9:49", "9:53", "9:57"] },
            { mark: "◎", times: ["—", "10:00", "10:02", "10:04", "10:10", "10:15", "10:18", "10:19", "10:23", "10:27"] },
            { mark: "★", times: ["—", "15:00", "15:02", "15:04", "15:10", "15:15", "15:18", "15:19", "15:23", "15:27"] },
            { mark: "◎", times: ["—", "15:30", "15:32", "15:34", "15:42", "15:45", "15:48", "15:49", "15:53", "15:57"] },
            { mark: "★", times: ["—", "16:00", "16:02", "16:04", "16:10", "16:15", "16:18", "16:19", "16:23", "16:27"] },
          ],
          notes: [
            "Stops marked with — are not served by the bus. Boarding and drop-off are not available.",
            "Services marked with ◎ operate from December 20 to March 22.",
            "Services marked with ★ operate until March 1. These services do not operate from March 2 onward."
          ]
        },
        {
          label: "Suginohara to Ikenotaira to Akakura",
          columns: [
            "Service", "Suginohara Ski Resort", "Suginozawa Fire Station",
            "Lime Resort Myoko", "Ikenotaira T.O", "Ikenotaira Ski Resort",
            "Alpen Blick Spa", "Akakura Kanko", "Akakura Onsen",
            "Hotel Windsor", "Myoko Bus Terminal"
          ],
          rows: [
            { mark: "◎", times: ["8:30", "8:33", "8:38", "8:39", "8:45", "8:47", "8:56", "8:58", "—", "—"] },
            { mark: "★", times: ["9:00", "9:03", "9:08", "9:09", "9:15", "9:17", "9:26", "9:28", "—", "—"] },
            { mark: "◎", times: ["9:30", "9:33", "9:38", "9:39", "9:45", "9:47", "9:56", "9:58", "—", "—"] },
            { mark: "★", times: ["14:15", "14:18", "14:23", "14:24", "14:30", "14:33", "14:41", "14:43", "—", "—"] },
            { mark: "◎", times: ["15:00", "15:03", "15:08", "15:09", "15:15", "15:17", "15:25", "15:27", "—", "—"] },
            { mark: "★", times: ["15:30", "15:33", "15:38", "15:39", "15:45", "15:47", "15:56", "15:58", "—", "—"] },
            { mark: "◎", times: ["16:00", "16:03", "16:08", "16:09", "16:15", "16:17", "16:26", "16:28", "16:30", "16:35"] },
            { mark: "★", times: ["16:30", "16:33", "16:38", "16:39", "16:45", "16:47", "16:56", "16:58", "17:02", "17:07"] },
          ],
          notes: [
            "Stops marked with — are not served by the bus. Boarding and drop-off are not available. ",
            "Services marked with ◎ operate from December 20 to March 22.",
            "Services marked with ★ operate until March 1. These services do not operate from March 2 onward."
          ]
        }
      ],
      notes: [
        "◎ operates from 20 December to 22 March",
        "★ operates until 1 March only. No ★ services from 2 March onward.",
        "Payment can be made when boarding.",
        "Please arrive 5-10 minutes before departure."
      ]
    },
    {
      title: "Lotte Arai Resort - Akakura - Tangram Line",
      period: "Winter Season (Start Date Undecided)",
      fare: "Variable by distance (e.g. Lotte Arai to Tangram: ¥3,900)",
      status: "suspended",
      directions: [
        {
          label: "Lotte Arai Resort to Tangram via Akakura",
          columns: [
            "Lotte Arai Resort", "Akakura Onsen", "Akakura Kanko",
            "Hotel Windsor", "Myoko Kogen Bus Terminal", "Tangram"
          ],
          rows: [
            { mark: "-", times: ["—", "8:00", "7:57", "8:05", "7:50", "8:30"] },
            { mark: "-", times: ["9:45", "10:40", "10:37", "10:45", "10:30", "—"] },
            { mark: "-", times: ["16:05", "16:50", "16:47", "16:45", "17:00 (Final stop)", "—"] },
          ]
        },
        {
          label: "Tangram to Lotte Arai Resort via Akakura",
          columns: [
            "Tangram", "Myoko Kogen Bus Terminal", "Akakura Onsen",
            "Akakura Kanko", "Hotel Windsor", "Lotte Arai Resort"
          ],
          rows: [
            { mark: "-", times: ["8:30", "8:50", "9:00", "9:47", "9:05", "9:45"] },
            { mark: "-", times: ["—", "15:20", "15:10", "15:13", "15:15", "16:05*"] },
          ]
        }
      ],
      notes: [
        "Times shown in parentheses are drop-off only.",
        "Service to Madarao Kogen Hotel is no longer available.",
        "The service arriving at Lotte Arai Resort at 16:05 only continues to Lotte Arai Resort when at least one passenger is travelling there from the Akakura area."
      ]
    }
  ]

  const currentRoute = routes[activeTab]
  const currentDirection = currentRoute.directions[directionIndex]
  const currentNotes = currentDirection.notes || currentRoute.notes
  const hasServiceColumn = currentDirection.columns[0] === "Service"

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    setDirectionIndex(0)
  }

  return (
    <section id="timetables" className="py-24 bg-white border-t border-slate-100 scroll-mt-20">
      <Container>
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              Winter Local Network
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Local Shuttle Timetables
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Winter local shuttle services connecting Akakura, Ikenotaira, Suginohara, Myoko Kogen, Lotte Arai, and Tangram.
            </p>
          </div>

          {/* Route Selector Tabs */}
          <div className="flex flex-col md:flex-row gap-4">
            {routes.map((route, idx) => (
              <button
                key={idx}
                onClick={() => handleTabChange(idx)}
                className={cn(
                  "flex-1 p-6 rounded-[2rem] text-left transition-all border-2",
                  activeTab === idx
                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={cn(
                    "p-2 rounded-xl",
                    activeTab === idx ? "bg-white/10" : "bg-slate-50"
                  )}>
                    <Mountain className="w-5 h-5" />
                  </div>
                  {route.status === "suspended" && (
                    <Badge variant="warning" className="bg-amber-500 hover:bg-amber-500 border-none whitespace-nowrap shrink-0">
                      Operation Start Undecided
                    </Badge>
                  )}
                </div>
                <h3 className="font-bold text-lg leading-tight">{route.title}</h3>
                <p className={cn(
                  "text-xs mt-2 font-medium uppercase tracking-wider",
                  activeTab === idx ? "text-white/60" : "text-slate-400"
                )}>
                  {route.period}
                </p>
              </button>
            ))}
          </div>

          {/* Active Route Content */}
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Status Banner for Suspended Routes */}
            {currentRoute.status === "suspended" && (
              <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900">Operation Start Date Undecided</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    This route is currently suspended for the 2025–2026 season. Please check current operation status or contact local tourist associations before planning your travel.
                  </p>
                </div>
              </div>
            )}

            {/* Direction Toggle */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-1.5 rounded-2xl w-fit">
              {currentRoute.directions.map((dir, idx) => (
                <button
                  key={idx}
                  onClick={() => setDirectionIndex(idx)}
                  className={cn(
                    "px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
                    directionIndex === idx
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <ArrowRight className={cn("w-4 h-4", idx === 1 && "rotate-180")} />
                  {dir.label.split(" to ")[0]} to {dir.label.split(" to ").pop()?.replace(" via Akakura", "")}
                </button>
              ))}
            </div>

            {/* Timetable Display */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{currentDirection.label}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      {currentRoute.fare}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Scrollable Table */}
              <div className="hidden lg:block overflow-x-auto rounded-3xl border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-slate-50/50">
                      {currentDirection.columns.map((col, i) => (
                        <th key={i} className="px-5 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentDirection.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                        {hasServiceColumn && (
                          <td className="px-5 py-6 border-b border-slate-100 whitespace-nowrap">
                            <Badge variant="outline" className={cn(
                              "rounded-md font-bold border-none px-2 py-0.5 text-xs",
                              row.mark === "◎" ? "bg-emerald-600 text-white" :
                                row.mark === "★" ? "bg-primary text-white" :
                                  "bg-slate-100 text-slate-400"
                            )}>
                              {row.mark}
                            </Badge>
                          </td>
                        )}
                        {row.times.map((time, j) => (
                          <td key={j} className={cn(
                            "px-5 py-6 text-sm font-bold border-b border-slate-100 whitespace-nowrap",
                            time === "-" || time === "—" ? "text-slate-300 font-medium" : "text-slate-900"
                          )}>
                            {time}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentDirection.rows.map((row, i) => {
                  const stopsList = hasServiceColumn ? currentDirection.columns.slice(1) : currentDirection.columns
                  return (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                        <div className="flex items-center gap-2">
                          {hasServiceColumn && row.mark !== "-" && (
                            <Badge variant="outline" className={cn(
                              "rounded-md font-bold border-none px-2 py-0.5 text-xs",
                              row.mark === "◎" ? "bg-emerald-600 text-white" :
                                row.mark === "★" ? "bg-primary text-white" :
                                  "bg-slate-100 text-slate-400"
                            )}>
                              {row.mark}
                            </Badge>
                          )}
                          <span className="text-xs font-bold text-slate-400">SERVICE {i + 1}</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-wider">Schedule</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {stopsList.map((col, j) => {
                          const time = row.times[j];
                          if (time === "-" || time === "—") return null;
                          return (
                            <div key={j} className="flex items-center justify-between group">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{col}</p>
                              <div className="flex items-center gap-3">
                                <div className="h-px w-8 bg-slate-100 group-hover:bg-primary/20 transition-colors" />
                                <p className="text-sm font-bold text-slate-900">{time}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* One-Way Fare Table for Tab 2 (Lotte Arai Resort - Akakura - Tangram Line) */}
              {activeTab === 1 && (
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-lg text-slate-900">One-Way Fares</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Tell the driver your destination before boarding and pay the applicable fare.
                    </p>
                  </div>

                  {/* Scrollable Fare Matrix Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse min-w-max text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-100/70 border-b border-slate-200">
                          <th className="px-4 py-4 font-bold text-slate-700 uppercase tracking-wider sticky left-0 bg-slate-100 z-10 whitespace-nowrap shadow-[1px_0_0_0_#e2e8f0]">
                            From / To
                          </th>
                          {[
                            "Lotte Arai Resort",
                            "Akakura Onsen",
                            "Akakura Kanko",
                            "Hotel Windsor",
                            "Myoko Bus Terminal",
                            "Tangram"
                          ].map((header, i) => (
                            <th key={i} className="px-4 py-4 font-bold text-slate-600 whitespace-nowrap text-center">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          {
                            from: "Lotte Arai Resort",
                            fares: ["—", "¥2,200", "¥2,200", "¥2,200", "¥2,200", "¥3,900"]
                          },
                          {
                            from: "Akakura Onsen Ski Resort",
                            fares: ["¥2,200", "—", "¥500", "¥500", "¥1,500", "¥1,700"]
                          },
                          {
                            from: "Akakura Kanko Resort Ski Area",
                            fares: ["¥2,200", "¥500", "—", "¥500", "¥1,500", "¥1,700"]
                          },
                          {
                            from: "Hotel Windsor",
                            fares: ["¥2,200", "¥500", "¥500", "—", "¥1,500", "¥1,700"]
                          },
                          {
                            from: "Myoko Kogen Bus Terminal",
                            fares: ["¥2,200", "¥1,500", "¥1,500", "¥1,500", "—", "¥1,700"]
                          },
                          {
                            from: "Tangram",
                            fares: ["¥3,900", "¥1,700", "¥1,700", "¥1,700", "¥1,700", "—"]
                          }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3.5 font-semibold text-slate-900 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[1px_0_0_0_#f1f5f9]">
                              {row.from}
                            </td>
                            {row.fares.map((price, j) => (
                              <td
                                key={j}
                                className={cn(
                                  "px-4 py-3.5 text-center font-bold whitespace-nowrap",
                                  price === "—" ? "text-slate-300 font-normal" : "text-slate-800"
                                )}
                              >
                                {price}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Route Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Service Guidelines
                  </h4>
                  <ul className="space-y-3">
                    {currentNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Travel Notes
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      Schedules and fares may change without notice depending on weather, traffic, road conditions, and operating dates.
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      Tickets may also be available at tourist associations, ski resorts, and some accommodation providers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
