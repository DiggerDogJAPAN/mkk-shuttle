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
  ChevronRight,
  CreditCard,
  MapPin,
  Mountain
} from "lucide-react"
import { cn } from "@/lib/utils"

type TimetableRow = {
  mark: string;
  times: string[];
}

type RouteData = {
  title: string;
  period: string;
  fare: string;
  directions: {
    label: string;
    columns: string[];
    rows: TimetableRow[];
  }[];
  notes: string[];
  status?: "active" | "suspended";
}

export function LocalTimetable() {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [directionIndex, setDirectionIndex] = useState<number>(0)

  const routes: RouteData[] = [
    {
      title: "Akakura - Ikenotaira - Suginohara Line",
      period: "20 December 2025 - 22 March 2026",
      fare: "One way: ¥1,000 | Akakura Onsen to Hotel Windsor: ¥500",
      status: "active",
      directions: [
        {
          label: "Akakura to Ikenotaira to Suginohara",
          columns: [
            "Service", "Myoko Kogen Terminal", "Akakura Onsen Ski Area", 
            "Akakura Kanko Resort", "Hotel Windsor", "Alpen Blick Spa", 
            "Ikenotaira Ski Area", "Tourist Association", "Lime Resort", 
            "Suginozawa Fire Hut", "Suginohara Ski Area"
          ],
          rows: [
            { mark: "◎", times: ["07:50", "08:00", "08:02", "08:05", "08:12", "08:15", "08:18", "08:19", "08:23", "08:27"] },
            { mark: "★", times: ["08:20", "08:30", "08:32", "08:34", "08:40", "08:45", "08:48", "08:49", "08:53", "08:57"] },
            { mark: "◎", times: ["-", "09:00", "09:02", "09:04", "09:10", "09:15", "09:18", "09:19", "09:23", "09:27"] },
            { mark: "★", times: ["-", "09:30", "09:32", "09:34", "09:40", "09:45", "09:48", "09:49", "09:53", "09:57"] },
            { mark: "◎", times: ["-", "10:00", "10:02", "10:04", "10:10", "10:15", "10:18", "10:19", "10:23", "10:27"] },
            { mark: "★", times: ["-", "15:00", "15:02", "15:04", "15:10", "15:15", "15:18", "15:19", "15:23", "15:27"] },
            { mark: "◎", times: ["-", "15:30", "15:32", "15:34", "15:42", "15:45", "15:48", "15:49", "15:53", "15:57"] },
            { mark: "★", times: ["-", "16:00", "16:02", "16:04", "16:10", "16:15", "16:18", "16:19", "16:23", "16:27"] },
          ]
        },
        {
          label: "Suginohara to Ikenotaira to Akakura",
          columns: [
            "Service", "Suginohara Ski Area", "Suginozawa Fire Hut", 
            "Ikenotaira Lime Resort", "Tourist Association", "Ikenotaira Ski Area", 
            "Alpen Blick Spa", "Akakura Kanko Resort", "Akakura Onsen Ski Area", 
            "Hotel Windsor", "Myoko Kogen Terminal"
          ],
          rows: [
            { mark: "◎", times: ["08:30", "08:33", "08:38", "08:39", "08:45", "08:47", "08:56", "08:58", "-", "-"] },
            { mark: "★", times: ["09:00", "09:03", "09:08", "09:09", "09:15", "09:17", "09:26", "09:28", "-", "-"] },
            { mark: "◎", times: ["09:30", "09:33", "09:38", "09:39", "09:45", "09:47", "09:56", "09:58", "-", "-"] },
            { mark: "★", times: ["14:15", "14:18", "14:23", "14:24", "14:30", "14:33", "14:41", "14:43", "-", "-"] },
            { mark: "◎", times: ["15:00", "15:03", "15:08", "15:09", "15:15", "15:17", "15:25", "15:27", "-", "-"] },
            { mark: "★", times: ["15:30", "15:33", "15:38", "15:39", "15:45", "15:47", "15:56", "15:58", "-", "-"] },
            { mark: "◎", times: ["16:00", "16:03", "16:08", "16:09", "16:15", "16:17", "16:26", "16:28", "16:30", "16:35"] },
            { mark: "★", times: ["16:30", "16:33", "16:38", "16:39", "16:45", "16:47", "16:56", "16:58", "17:02", "17:07"] },
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
      title: "Lotte Arai Resort - Akakura - Madarao Kogen Line",
      period: "Winter Season (Start Date Undecided)",
      fare: "Variable by distance (e.g. Lotte Arai to Madarao: ¥3,600)",
      status: "suspended",
      directions: [
        {
          label: "Lotte Arai Resort to Akakura to Madarao",
          columns: [
            "Lotte Arai Resort", "Akakura Onsen", "Akakura Kanko", 
            "Hotel Windsor", "Myoko Kogen Terminal", "Tangram", "Madarao Kogen Hotel"
          ],
          rows: [
            { mark: "-", times: ["07:20", "08:05", "08:07", "08:09", "08:12", "08:30", "08:50"] },
            { mark: "-", times: ["08:55", "10:00", "10:02", "10:04", "10:10", "-", "-"] },
            { mark: "-", times: ["14:00", "14:50", "14:52", "14:54", "15:00", "15:20", "15:40"] },
            { mark: "-", times: ["16:00", "16:40", "16:43", "16:46", "16:50", "Terminates", "-"] },
          ]
        },
        {
          label: "Madarao to Akakura to Lotte Arai Resort",
          columns: [
            "Madarao Hotel", "Tangram", "Myoko Kogen Terminal", 
            "Akakura Onsen", "Akakura Kanko", "Hotel Windsor", "Lotte Arai Resort"
          ],
          rows: [
            { mark: "-", times: ["-", "-", "08:00", "08:10", "08:12", "08:14", "08:55"] },
            { mark: "-", times: ["09:00", "09:15", "-", "09:45", "09:50", "-", "10:30"] },
            { mark: "-", times: ["-", "-", "15:00", "15:10", "15:13", "15:15", "16:00"] },
            { mark: "-", times: ["15:45", "16:05", "16:25", "16:33", "16:31", "16:35", "17:15"] },
          ]
        }
      ],
      notes: [
        "This route is currently suspended / operation start date undecided.",
        "Please tell the driver your destination before boarding and pay the fare shown for your journey.",
        "Check current operation status before travel."
      ]
    }
  ]

  const currentRoute = routes[activeTab]
  const currentDirection = currentRoute.directions[directionIndex]

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
              Winter local shuttle services connecting Akakura, Ikenotaira, Suginohara, Myoko Kogen, Lotte Arai, Tangram, and Madarao.
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
                <div className="flex items-center justify-between mb-2">
                  <div className={cn(
                    "p-2 rounded-xl",
                    activeTab === idx ? "bg-white/10" : "bg-slate-50"
                  )}>
                    <Mountain className="w-5 h-5" />
                  </div>
                  {route.status === "suspended" && (
                    <Badge variant="warning" className="bg-amber-500 hover:bg-amber-500 border-none">
                      Suspended
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
                  {dir.label.split(" to ")[0]} to {dir.label.split(" to ").pop()}
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
                        <th key={i} className="px-5 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentDirection.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-5 py-6 border-b border-slate-100">
                          <Badge variant="outline" className={cn(
                            "rounded-md font-bold border-none",
                            row.mark === "◎" ? "bg-primary text-white" : 
                            row.mark === "★" ? "bg-secondary text-white" : 
                            "bg-slate-100 text-slate-400"
                          )}>
                            {row.mark}
                          </Badge>
                        </td>
                        {row.times.map((time, j) => (
                          <td key={j} className={cn(
                            "px-5 py-6 text-sm font-bold border-b border-slate-100",
                            time === "-" ? "text-slate-300 font-medium" : "text-slate-900"
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
                {currentDirection.rows.map((row, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                          "rounded-md font-bold border-none",
                          row.mark === "◎" ? "bg-primary text-white" : 
                          row.mark === "★" ? "bg-secondary text-white" : 
                          "bg-slate-100 text-slate-400"
                        )}>
                          {row.mark}
                        </Badge>
                        <span className="text-xs font-bold text-slate-400">SERVICE {i + 1}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Schedule</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {currentDirection.columns.slice(1).map((col, j) => {
                        const time = row.times[j];
                        if (time === "-") return null;
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
                ))}
              </div>

              {/* Local Fare Examples for Tab 2 */}
              {activeTab === 1 && (
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-slate-900">Route Fare Examples</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { route: "Local Short Rides", price: "from ¥500" },
                      { route: "Lotte Arai to Akakura", price: "¥2,000" },
                      { route: "Bus Terminal to Akakura", price: "¥1,500" },
                      { route: "Lotte Arai to Tangram", price: "¥3,200" },
                      { route: "Lotte Arai to Madarao", price: "¥3,600" },
                      { route: "Tangram to Madarao", price: "¥600" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100">
                        <span className="text-sm font-medium text-slate-600">{item.route}</span>
                        <span className="text-sm font-bold text-slate-900">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-6 leading-relaxed">
                    Please tell the driver your destination before boarding and pay the fare shown for your journey. Prices include tax.
                  </p>
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
                    {currentRoute.notes.map((note, i) => (
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
