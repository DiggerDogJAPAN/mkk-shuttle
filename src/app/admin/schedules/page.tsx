"use client"

import { useState, useEffect, useMemo } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Trash2, Edit } from "lucide-react"

export default function AdminSchedulesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const [showForm, setShowForm] = useState(false)
  const [routeId, setRouteId] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [label, setLabel] = useState('')
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [routesResult, schedulesResult] = await Promise.all([
        supabase.from('routes').select('*').order('name'),
        supabase.from('route_schedules').select('*, route:routes(*)').order('departure_time')
      ])

      if (routesResult.error) throw routesResult.error
      if (schedulesResult.error) throw schedulesResult.error

      setRoutes(routesResult.data || [])
      
      // Sort schedules by route name, then departure time
      const sortedSchedules = (schedulesResult.data || []).sort((a: any, b: any) => {
        const nameA = a.route?.name || ''
        const nameB = b.route?.name || ''
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return (a.departure_time || '').localeCompare(b.departure_time || '')
      })

      setSchedules(sortedSchedules)
    } catch (error: any) {
      console.error('Failed to fetch data:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const saveSchedule = async () => {
    if (!routeId || !departureTime) {
      alert('Please select a route and enter a departure time')
      return
    }

    setLoading(true)

    const payload = {
      route_id: routeId,
      departure_time: departureTime,
      label: label.trim() || null,
    }

    let error

    if (editingScheduleId) {
      const result = await supabase
        .from('route_schedules')
        .update(payload)
        .eq('id', editingScheduleId)

      error = result.error
    } else {
      const result = await supabase
        .from('route_schedules')
        .insert([payload])

      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error('Failed to save schedule:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to save schedule: ${error.message}`)
      return
    }

    setRouteId('')
    setDepartureTime('')
    setLabel('')
    setEditingScheduleId(null)
    setShowForm(false)
    fetchData()
  }

  const deleteSchedule = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return
    }

    const { error } = await supabase
      .from('route_schedules')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete schedule:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to delete schedule: ${error.message}`)
      return
    }

    fetchData()
  }

  const groupedSchedules = useMemo(() => {
    const routesMap = new Map<string, any[]>()

    schedules.forEach(schedule => {
      const routeName = schedule.route?.from_location && schedule.route?.to_location 
        ? `${schedule.route.from_location} → ${schedule.route.to_location}` 
        : schedule.route?.name || 'Unknown Route'

      if (!routesMap.has(routeName)) {
        routesMap.set(routeName, [])
      }
      routesMap.get(routeName)!.push(schedule)
    })

    return Array.from(routesMap.entries())
      .map(([routeName, routeSchedules]) => ({
        routeName,
        schedules: routeSchedules
      }))
      .sort((a, b) => a.routeName.localeCompare(b.routeName))
  }, [schedules])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeading title="Manage Schedules" description="Configure shuttle departure times and labels." />
        <button 
          onClick={() => {
            setShowForm(true)
            setEditingScheduleId(null)
            setRouteId('')
            setDepartureTime('')
            setLabel('')
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Schedule
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingScheduleId ? 'Edit Schedule' : 'Add Schedule'}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Route</label>
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              >
                <option value="">Select a route</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.from_location && route.to_location ? `${route.from_location} → ${route.to_location}` : route.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Departure Time</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Label (Optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Express, Morning"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={saveSchedule}
              disabled={loading}
              className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors hover:bg-black/80"
            >
              {loading ? 'Saving...' : 'Save Schedule'}
            </button>

            <button
              onClick={() => {
                setShowForm(false)
                setEditingScheduleId(null)
                setRouteId('')
                setDepartureTime('')
                setLabel('')
              }}
              className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border-none shadow-none bg-transparent">
        {initialLoading ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">Loading schedules...</div>
        ) : schedules.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
            No schedules found.
          </div>
        ) : (
          <div className="space-y-8">
            {groupedSchedules.map(routeGroup => (
              <div key={routeGroup.routeName} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-base">{routeGroup.routeName}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-1">
                    {routeGroup.schedules.map(schedule => (
                      <div key={schedule.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-bold tracking-widest shadow-sm">
                            {schedule.departure_time ? schedule.departure_time.slice(0, 5) : 'N/A'}
                          </span>
                          {schedule.label && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              {schedule.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setShowForm(true)
                              setEditingScheduleId(schedule.id)
                              setRouteId(schedule.route_id || '')
                              setDepartureTime(schedule.departure_time ? schedule.departure_time.slice(0, 5) : '')
                              setLabel(schedule.label || '')
                            }}
                            className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSchedule(schedule.id)}
                            className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
