'use client'

import { 
  ArrowDown, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Plane, 
  Mountain,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingSummarySidebarProps {
  selectedRoute: any
  selectedSchedule: any
  departure: any
  arrival: any
  travelDate: string
  passengers: number
  totalPrice: number
  isLoading: boolean
}

export function BookingSummarySidebar({
  selectedRoute,
  selectedSchedule,
  departure,
  arrival,
  travelDate,
  passengers,
  totalPrice,
  isLoading
}: BookingSummarySidebarProps) {
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (time: string) => time?.slice(0, 5) || ""

  const hasSelections = selectedRoute || travelDate

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Journey Summary</h3>
        </div>

        {!hasSelections ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
              <Info className="w-8 h-8" />
            </div>
            <p className="text-slate-400 font-medium">Your selected journey will appear here.</p>
          </div>
        ) : (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Route Visual */}
            {(departure || arrival || selectedRoute) && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <div className="w-0.5 h-12 bg-slate-100 border-l border-dashed border-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white" />
                  </div>
                  <div className="flex-1 space-y-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pickup</p>
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        {departure?.name || selectedRoute?.from_location || "Select pickup"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Drop-off</p>
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        {arrival?.name || selectedRoute?.to_location || "Select drop-off"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Journey Details */}
            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departure Date</p>
                  <p className="text-sm font-bold text-slate-900">{formatDate(travelDate) || "Select date"}</p>
                </div>
              </div>

              {selectedSchedule && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departure Time</p>
                    <p className="text-sm font-bold text-slate-900">{formatTime(selectedSchedule.departure_time)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passengers</p>
                  <p className="text-sm font-bold text-slate-900">
                    {passengers} Adult{passengers > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Badges */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Ski Luggage Included
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <Info className="w-3 h-3" />
                Allow Time To Clear Customs
              </span>
            </div>

            {/* Price Section */}
            <div className="pt-8 mt-4 border-t-2 border-slate-50">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Fare</p>
                  <p className="text-4xl font-black text-slate-900">
                    ¥{totalPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax Included</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust Badge */}
      <div className="p-6 rounded-[2rem] bg-success/5 border border-success/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-success uppercase tracking-wider">Secure Booking</span>
          <span className="text-[10px] text-success/70 font-medium">Safe & Encrypted Payments</span>
        </div>
      </div>
    </div>
  )
}
