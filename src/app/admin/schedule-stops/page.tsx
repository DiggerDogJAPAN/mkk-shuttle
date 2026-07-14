"use client"

import { useState, useEffect, useMemo } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Trash2, Edit } from "lucide-react"
import { AdminCollapsibleSection } from "@/components/admin/admin-collapsible-section"
import { useAdminCollapsibleController } from "@/hooks/use-admin-collapsible"

export default function AdminScheduleStopsPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [routeSchedules, setRouteSchedules] = useState<any[]>([])
  const [stops, setStops] = useState<any[]>([])
  const [scheduleStops, setScheduleStops] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const { expandAll, collapseAll, controllerProps } = useAdminCollapsibleController()

  const [showForm, setShowForm] = useState(false)
  const [scheduleId, setScheduleId] = useState('')
  const [stopId, setStopId] = useState('')
  const [label, setLabel] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [
        routesResult, 
        schedulesResult, 
        stopsResult, 
        scheduleStopsResult
      ] = await Promise.all([
        supabase.from('routes').select('*'),
        supabase.from('route_schedules').select('*').order('departure_time', { ascending: true }),
        supabase.from('stops').select('*'),
        supabase.from('schedule_stops').select('*')
      ])

      if (routesResult.error) throw routesResult.error
      if (schedulesResult.error) throw schedulesResult.error
      if (stopsResult.error) throw stopsResult.error
      if (scheduleStopsResult.error) throw scheduleStopsResult.error

      setRoutes(routesResult.data || [])
      setRouteSchedules(schedulesResult.data || [])
      setStops(stopsResult.data || [])
      setScheduleStops(scheduleStopsResult.data || [])

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

  // Lookups for efficient rendering and sorting
  const routesMap = useMemo(() => new Map(routes.map(r => [r.id, r])), [routes])
  const schedulesMap = useMemo(() => new Map(routeSchedules.map(s => [s.id, s])), [routeSchedules])
  const stopsMap = useMemo(() => new Map(stops.map(s => [s.id, s])), [stops])

  const getRouteDisplayName = (route: any) => {
    if (!route) return 'Unknown Route'
    if (route.from_location && route.to_location) {
      return `${route.from_location} → ${route.to_location}`
    }
    return route.name || 'Unknown Route'
  }

  // Derived list of schedules for the dropdown
  const scheduleOptions = useMemo(() => {
    return routeSchedules.map(schedule => {
      const route = routesMap.get(schedule.route_id)
      const routeName = getRouteDisplayName(route)
      const time = schedule.departure_time ? schedule.departure_time.slice(0, 5) : 'Unknown Time'
      
      // For sorting the dropdown
      const sortKey = `${routeName} ${time}`
      
      return {
        id: schedule.id,
        display: `${routeName} - ${time}`,
        sortKey
      }
    }).sort((a, b) => a.sortKey.localeCompare(b.sortKey))
  }, [routeSchedules, routesMap])

  // Process and sort schedule_stops for the table
  const tableData = useMemo(() => {
    return scheduleStops.map(ss => {
      const schedule = schedulesMap.get(ss.schedule_id)
      const route = schedule ? routesMap.get(schedule.route_id) : null
      const stop = stopsMap.get(ss.stop_id)

      const routeName = getRouteDisplayName(route)
      const departureTime = schedule?.departure_time ? schedule.departure_time.slice(0, 5) : 'N/A'
      const stopName = ss.stop_name || stop?.name || 'Unknown Stop'
      const stopOrder = stop?.stop_order ?? 999 // Fallback high number if no order

      return {
        ...ss,
        routeName,
        departureTime,
        stopName,
        stopOrder
      }
    }).sort((a, b) => {
      // 1. route name
      if (a.routeName < b.routeName) return -1
      if (a.routeName > b.routeName) return 1
      // 2. departure time
      if (a.departureTime < b.departureTime) return -1
      if (a.departureTime > b.departureTime) return 1
      // 3. stop order
      return a.stopOrder - b.stopOrder
    })
  }, [scheduleStops, schedulesMap, routesMap, stopsMap])

  // Filter available stops based on selected schedule (UX enhancement to only show stops for that route)
  const availableStops = useMemo(() => {
    if (!scheduleId) return stops // Fallback to all stops if no schedule selected
    const selectedSchedule = schedulesMap.get(scheduleId)
    if (!selectedSchedule) return stops
    return stops
      .filter(stop => stop.route_id === selectedSchedule.route_id)
      .sort((a, b) => (a.stop_order || 0) - (b.stop_order || 0))
  }, [scheduleId, schedulesMap, stops])

  const saveScheduleStop = async () => {
    if (!scheduleId || !stopId) {
      alert('Please select both a schedule and a stop')
      return
    }

    const selectedStop = stopsMap.get(stopId)
    if (!selectedStop) {
      alert('Invalid stop selected')
      return
    }

    setLoading(true)

    const payload = {
      schedule_id: scheduleId,
      stop_id: stopId,
      stop_name: selectedStop.name, // Automatically copy from the selected stop
      label: label.trim() || null,
    }

    let error

    if (editingId) {
      const result = await supabase
        .from('schedule_stops')
        .update(payload)
        .eq('id', editingId)

      error = result.error
    } else {
      const result = await supabase
        .from('schedule_stops')
        .insert([payload])

      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error('Failed to save schedule stop:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to save schedule stop: ${error.message}`)
      return
    }

    setScheduleId('')
    setStopId('')
    setLabel('')
    setEditingId(null)
    setShowForm(false)
    fetchData()
  }

  const deleteScheduleStop = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this stop from the schedule?')) {
      return
    }

    const { error } = await supabase
      .from('schedule_stops')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete schedule stop:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to delete schedule stop: ${error.message}`)
      return
    }

    fetchData()
  }

  // Group data by Route -> Departure Time
  const groupedData = useMemo(() => {
    const routesMap = new Map<string, Map<string, any[]>>()
    
    tableData.forEach(row => {
      if (!routesMap.has(row.routeName)) {
        routesMap.set(row.routeName, new Map<string, any[]>())
      }
      const departuresMap = routesMap.get(row.routeName)!
      if (!departuresMap.has(row.departureTime)) {
        departuresMap.set(row.departureTime, [])
      }
      departuresMap.get(row.departureTime)!.push(row)
    })
    
    return Array.from(routesMap.entries()).map(([routeName, departuresMap]) => ({
      routeName,
      departures: Array.from(departuresMap.entries()).map(([departureTime, stops]) => ({
        departureTime,
        stops
      }))
    }))
  }, [tableData])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeading title="Schedule Stops" description="Configure which stops are serviced by specific departures." />
        <button 
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setScheduleId('')
            setStopId('')
            setLabel('')
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Schedule Stop
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? 'Edit Schedule Stop' : 'Add Schedule Stop'}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Schedule</label>
              <select
                value={scheduleId}
                onChange={(e) => setScheduleId(e.target.value)}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              >
                <option value="">Select a schedule</option>
                {scheduleOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.display}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Stop</label>
              <select
                value={stopId}
                onChange={(e) => setStopId(e.target.value)}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm disabled:bg-slate-50 disabled:text-slate-400"
                disabled={!scheduleId}
              >
                <option value="">{scheduleId ? 'Select a stop' : 'Select schedule first'}</option>
                {availableStops.map(stop => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name} (Order: {stop.stop_order})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Label (Optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Drop-off only"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={saveScheduleStop}
              disabled={loading || !scheduleId || !stopId}
              className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors hover:bg-black/80"
            >
              {loading ? 'Saving...' : 'Save Schedule Stop'}
            </button>

            <button
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setScheduleId('')
                setStopId('')
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
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">Loading schedule stops...</div>
        ) : tableData.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
            No schedule stops found.
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              const flatGroups = groupedData.flatMap(routeGroup => 
                routeGroup.departures.map(depGroup => ({
                  routeName: routeGroup.routeName,
                  departureTime: depGroup.departureTime,
                  stops: depGroup.stops
                }))
              )

              return (
                <>
                  {flatGroups.length > 1 && (
                    <div className="flex justify-end gap-4 pb-2">
                      <button onClick={expandAll} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Expand all</button>
                      <button onClick={collapseAll} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Collapse all</button>
                    </div>
                  )}
                  {flatGroups.map(group => (
                    <AdminCollapsibleSection
                      key={`${group.routeName}-${group.departureTime}`}
                      title={group.routeName}
                      subtitle={group.departureTime}
                      count={group.stops.length}
                      countLabel="stops"
                      defaultOpen={flatGroups.length === 1}
                      isEditing={group.stops.some(s => s.id === editingId)}
                      controller={controllerProps}
                    >
                      <div className="space-y-1">
                        {group.stops.map(row => (
                          <div key={row.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                {row.stopOrder !== 999 ? row.stopOrder : '?'}
                              </span>
                              <span className="font-medium text-slate-700 text-sm">
                                {row.stopName}
                              </span>
                              {row.label && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                  {row.label}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setShowForm(true)
                                  setEditingId(row.id)
                                  setScheduleId(row.schedule_id || '')
                                  setStopId(row.stop_id || '')
                                  setLabel(row.label || '')
                                }}
                                className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteScheduleStop(row.id)}
                                className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AdminCollapsibleSection>
                  ))}
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
