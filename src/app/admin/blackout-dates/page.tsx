"use client"

import { useState, useEffect, useMemo } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Trash2, Edit } from "lucide-react"
import { AdminCollapsibleSection } from "@/components/admin/admin-collapsible-section"
import { useAdminCollapsibleController } from "@/hooks/use-admin-collapsible"

export default function AdminBlackoutDatesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [availability, setAvailability] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const { expandAll, collapseAll, controllerProps } = useAdminCollapsibleController()

  const [showForm, setShowForm] = useState(false)
  const [routeId, setRouteId] = useState('')
  const [date, setDate] = useState('')
  const [blockType, setBlockType] = useState<'route' | 'schedule'>('route')
  const [scheduleId, setScheduleId] = useState('')
  const [label, setLabel] = useState('')
  const [isAvailable, setIsAvailable] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [
        routesResult, 
        schedulesResult, 
        availabilityResult
      ] = await Promise.all([
        supabase.from('routes').select('*'),
        supabase.from('route_schedules').select('*').order('departure_time', { ascending: true }),
        supabase.from('availability').select('*')
      ])

      if (routesResult.error) throw routesResult.error
      if (schedulesResult.error) throw schedulesResult.error
      if (availabilityResult.error) throw availabilityResult.error

      setRoutes(routesResult.data || [])
      setSchedules(schedulesResult.data || [])
      setAvailability(availabilityResult.data || [])

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

  // Lookups
  const routesMap = useMemo(() => new Map(routes.map(r => [r.id, r])), [routes])
  const schedulesMap = useMemo(() => new Map(schedules.map(s => [s.id, s])), [schedules])

  const getRouteDisplayName = (route: any) => {
    if (!route) return 'Unknown Route'
    if (route.from_location && route.to_location) {
      return `${route.from_location} → ${route.to_location}`
    }
    return route.name || 'Unknown Route'
  }

  // Auto-generate label
  useEffect(() => {
    if (routeId && date) {
      const r = routesMap.get(routeId)
      if (r) {
        const routeLabel = r.name || `${r.from_location} → ${r.to_location}`
        
        if (blockType === 'route') {
          setLabel(`${routeLabel} | Full route blocked`)
        } else if (blockType === 'schedule' && scheduleId) {
          const schedule = schedulesMap.get(scheduleId)
          const time = schedule?.departure_time ? schedule.departure_time.slice(0, 5) : 'Unknown Time'
          setLabel(`${routeLabel} | ${time} blocked`)
        }
      }
    }
  }, [routeId, date, blockType, scheduleId, routesMap, schedulesMap])

  // Filter schedules based on selected route
  const availableSchedules = useMemo(() => {
    if (!routeId) return schedules
    return schedules
      .filter(s => s.route_id === routeId)
      .sort((a, b) => (a.departure_time || '').localeCompare(b.departure_time || ''))
  }, [routeId, schedules])

  // Group availability records for the UI
  const groupedAvailability = useMemo(() => {
    const routesGroupMap = new Map<string, any[]>()

    availability.forEach(avail => {
      const route = routesMap.get(avail.route_id)
      const schedule = schedulesMap.get(avail.schedule_id)

      const routeName = getRouteDisplayName(route)
      
      const enrichedAvail = {
        ...avail,
        departureTime: schedule?.departure_time ? schedule.departure_time.slice(0, 5) : null
      }

      if (!routesGroupMap.has(routeName)) {
        routesGroupMap.set(routeName, [])
      }
      routesGroupMap.get(routeName)!.push(enrichedAvail)
    })

    return Array.from(routesGroupMap.entries())
      .map(([routeName, records]) => ({
        routeName,
        records: records.sort((a, b) => {
          // Sort by date first
          if (a.date !== b.date) {
            return (a.date || '').localeCompare(b.date || '')
          }
          // Then by departure time (nulls first meaning full route blocks)
          if (!a.departureTime && b.departureTime) return -1
          if (a.departureTime && !b.departureTime) return 1
          return (a.departureTime || '').localeCompare(b.departureTime || '')
        })
      }))
      .sort((a, b) => a.routeName.localeCompare(b.routeName))
  }, [availability, routesMap, schedulesMap])

  const saveAvailability = async () => {
    if (!routeId || !date) {
      alert('Please select a route and date')
      return
    }

    if (blockType === 'schedule' && !scheduleId) {
      alert('Please select a specific schedule to block')
      return
    }

    setLoading(true)

    const payload = {
      route_id: routeId,
      schedule_id: blockType === 'schedule' ? scheduleId : null,
      date: date,
      is_available: isAvailable, // Usually false for blackouts
      label: label.trim() || null,
    }

    let error

    if (editingId) {
      const result = await supabase
        .from('availability')
        .update(payload)
        .eq('id', editingId)

      error = result.error
    } else {
      const result = await supabase
        .from('availability')
        .insert([payload])

      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error('Failed to save blackout date:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to save blackout date: ${error.message}`)
      return
    }

    setRouteId('')
    setDate('')
    setBlockType('route')
    setScheduleId('')
    setLabel('')
    setIsAvailable(false)
    setEditingId(null)
    setShowForm(false)
    fetchData()
  }

  const deleteAvailability = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this blackout block?')) {
      return
    }

    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete blackout date:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to delete blackout date: ${error.message}`)
      return
    }

    fetchData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeading title="Blackout Dates" description="Block full routes or specific departures from being booked." />
        <button 
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setRouteId('')
            setDate('')
            setBlockType('route')
            setScheduleId('')
            setLabel('')
            setIsAvailable(false)
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Blackout
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? 'Edit Blackout' : 'Add Blackout'}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Route</label>
              <select
                value={routeId}
                onChange={(e) => {
                  setRouteId(e.target.value)
                  setScheduleId('')
                }}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              >
                <option value="">Select a route</option>
                {routes.sort((a, b) => getRouteDisplayName(a).localeCompare(getRouteDisplayName(b))).map(route => (
                  <option key={route.id} value={route.id}>
                    {getRouteDisplayName(route)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Block Type</label>
              <select
                value={blockType}
                onChange={(e) => {
                  setBlockType(e.target.value as 'route' | 'schedule')
                  if (e.target.value === 'route') {
                    setScheduleId('')
                  }
                }}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              >
                <option value="route">Full Route</option>
                <option value="schedule">Specific Departure Time</option>
              </select>
            </div>

            {blockType === 'schedule' && (
              <div className="space-y-2 lg:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Specific Schedule</label>
                <select
                  value={scheduleId}
                  onChange={(e) => setScheduleId(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm disabled:bg-slate-50 disabled:text-slate-400"
                  disabled={!routeId}
                >
                  <option value="">{routeId ? 'Select departure time' : 'Select route first'}</option>
                  {availableSchedules.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.departure_time?.slice(0, 5)} {s.label ? `- ${s.label}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={`space-y-2 ${blockType === 'schedule' ? 'lg:col-span-2' : 'lg:col-span-4'}`}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Christmas Day Block"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>
            
            <div className="space-y-2 lg:col-span-4 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isAvailable" 
                checked={isAvailable} 
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium text-slate-700">
                Mark as Available instead of Blacked Out
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={saveAvailability}
              disabled={loading || !routeId || !date || (blockType === 'schedule' && !scheduleId)}
              className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors hover:bg-black/80"
            >
              {loading ? 'Saving...' : 'Save Blackout'}
            </button>

            <button
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setRouteId('')
                setDate('')
                setBlockType('route')
                setScheduleId('')
                setLabel('')
                setIsAvailable(false)
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
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">Loading blackout dates...</div>
        ) : availability.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
            No blackout dates configured.
          </div>
        ) : (
          <div className="space-y-8">
            {groupedAvailability.length > 1 && (
              <div className="flex justify-end gap-4 pb-2">
                <button onClick={expandAll} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Expand all</button>
                <button onClick={collapseAll} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Collapse all</button>
              </div>
            )}
            {groupedAvailability.map(routeGroup => (
              <AdminCollapsibleSection
                key={routeGroup.routeName}
                title={routeGroup.routeName}
                count={routeGroup.records.length}
                countLabel="blackout dates"
                defaultOpen={groupedAvailability.length === 1}
                isEditing={routeGroup.records.some(r => r.id === editingId)}
                controller={controllerProps}
              >
                <div className="space-y-1">
                  {routeGroup.records.map(row => (
                    <div key={row.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 gap-4">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {row.date}
                        </span>
                        
                        {row.schedule_id ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold tracking-widest shadow-sm">
                            {row.departureTime}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-bold tracking-widest shadow-sm">
                            Full Route
                          </span>
                        )}

                        {!row.is_available && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">
                            Blocked
                          </span>
                        )}
                        
                        {row.is_available && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">
                            Available
                          </span>
                        )}

                        {row.label && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            {row.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setShowForm(true)
                            setEditingId(row.id)
                            setRouteId(row.route_id || '')
                            setDate(row.date || '')
                            setBlockType(row.schedule_id ? 'schedule' : 'route')
                            setScheduleId(row.schedule_id || '')
                            setLabel(row.label || '')
                            setIsAvailable(row.is_available)
                          }}
                          className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAvailability(row.id)}
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
          </div>
        )}
      </div>
    </div>
  )
}
