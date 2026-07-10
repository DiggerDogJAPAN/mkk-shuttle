"use client"

import { Info, Mountain, Clock, Cloud, AlertTriangle } from "lucide-react"

export function BookingInfoRow() {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3 ml-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Important Information</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100/50">
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-8">
          {[
            { icon: Clock, text: "Book at least 13 days in advance" },
            { icon: Mountain, text: "Ski & snowboard luggage included" },
            { icon: AlertTriangle, text: "Please arrive 10 mins before departure" },
            { icon: Cloud, text: "Shuttle timing may change due to weather" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                <item.icon className="w-4 h-4" />
              </div>
              <p className="text-[11px] md:text-xs font-bold text-slate-600 uppercase tracking-tight">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
