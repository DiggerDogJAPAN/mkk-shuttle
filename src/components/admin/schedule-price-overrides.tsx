"use client"

import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Trash2, Edit } from "lucide-react"

export function SchedulePriceOverrides() {
  const [routes, setRoutes] = useState<any[]>([])
  const [stops, setStops] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [overrides, setOverrides] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const [showForm, setShowForm] = useState(false)
  
  // Form State
  const [editingOverrideId, setEditingOverrideId] = useState<string | null>(null)
  const [routeId, setRouteId] = useState('')
  const [scheduleId, setScheduleId] = useState('')
  const [fromStopId, setFromStopId] = useState('')
  const [toStopId, setToStopId] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [label, setLabel] = useState('')

  const fetchData = async () => {
    try {
      const [
        routesResult, 
        stopsResult, 
        schedulesResult,
        overridesResult
      ] = await Promise.all([
        supabase.from('routes').select('*'),
        supabase.from('stops').select('*').order('stop_order', { ascending: true }),
        supabase.from('route_schedules').select('*').order('departure_time', { ascending: true }),
        supabase.from('schedule_price_overrides').select('*')
      ])

      if (routesResult.error) throw routesResult.error
      if (stopsResult.error) throw stopsResult.error
      if (schedulesResult.error) throw schedulesResult.error
      if (overridesResult.error) throw overridesResult.error

      setRoutes(routesResult.data || [])
      setStops(stopsResult.data || [])
      setSchedules(schedulesResult.data || [])
      setOverrides(overridesResult.data || [])

    } catch (error: any) {
      console.error('Failed to fetch schedule overrides data:', {
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
  const stopsMap = useMemo(() => new Map(stops.map(s => [s.id, s])), [stops])
  const schedulesMap = useMemo(() => new Map(schedules.map(s => [s.id, s])), [schedules])

  const getRouteDisplayName = (route: any) => {
    if (!route) return 'Unknown Route'
    if (route.from_location && route.to_location) {
      return `${route.from_location} → ${route.to_location}`
    }
    return route.name || 'Unknown Route'
  }

  const formatTime = (time: string) => time?.slice(0, 5) || ''

  // Derived options
  const availableSchedules = useMemo(() => {
    if (!routeId) return []
    return schedules.filter(s => s.route_id === routeId)
  }, [routeId, schedules])

  const availableStops = useMemo(() => {
    if (!routeId) return []
    return stops.filter(stop => stop.route_id === routeId)
  }, [routeId, stops])

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY' 
    }).format(amount)
  }

  const handleRouteSelect = (newRouteId: string) => {
    setRouteId(newRouteId)
    // Reset dependant fields
    setScheduleId('')
    setFromStopId('')
    setToStopId('')
  }

  const saveOverride = async () => {
    if (!scheduleId || !fromStopId || !toStopId || price === '') return

    if (fromStopId === toStopId) {
      alert("From Stop and To Stop cannot be the same.")
      return
    }

    // Duplicate protection
    const isDuplicate = overrides.some(o => 
      o.schedule_id === scheduleId && 
      o.from_stop_id === fromStopId && 
      o.to_stop_id === toStopId &&
      o.id !== editingOverrideId
    )

    if (isDuplicate) {
      alert("A price override already exists for this departure time and journey.\nPlease edit the existing override instead.")
      return
    }

    setLoading(true)

    const payload = {
      schedule_id: scheduleId,
      from_stop_id: fromStopId,
      to_stop_id: toStopId,
      price: Number(price),
      label: label.trim() || null,
    }

    let error

    if (editingOverrideId) {
      const result = await supabase
        .from('schedule_price_overrides')
        .update(payload)
        .eq('id', editingOverrideId)
      error = result.error
    } else {
      const result = await supabase
        .from('schedule_price_overrides')
        .insert([payload])
      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error('Failed to save schedule price override:', error)
      // Supabase unique constraint error code is 23505
      if (error.code === '23505') {
        alert("A price override already exists for this departure time and journey.\nPlease edit the existing override instead.")
      } else {
        alert("Failed to save schedule price override.")
      }
      return
    }

    alert(`Schedule price override ${editingOverrideId ? 'updated' : 'added'}.`)
    
    // Reset form
    setRouteId('')
    setScheduleId('')
    setFromStopId('')
    setToStopId('')
    setPrice('')
    setLabel('')
    setEditingOverrideId(null)
    setShowForm(false)
    
    fetchData()
  }

  const deleteOverride = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule price override?\n\nThe standard route price will be used after this override is removed.')) {
      return
    }

    const { error } = await supabase
      .from('schedule_price_overrides')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete schedule price override:', error)
      alert("Failed to delete schedule price override.")
      return
    }

    alert('Schedule price override deleted. The standard price will now apply.')
    fetchData()
  }

  // Display data
  const displayOverrides = useMemo(() => {
    return overrides.map(o => {
      const schedule = schedulesMap.get(o.schedule_id)
      const route = schedule ? routesMap.get(schedule.route_id) : null
      const fromStop = stopsMap.get(o.from_stop_id)
      const toStop = stopsMap.get(o.to_stop_id)

      return {
        ...o,
        routeId: route?.id || '',
        routeName: getRouteDisplayName(route),
        scheduleTime: schedule ? formatTime(schedule.departure_time) : 'Unknown Time',
        fromStopName: fromStop?.name || 'Unknown Stop',
        toStopName: toStop?.name || 'Unknown Stop'
      }
    }).sort((a, b) => {
      if (a.routeName !== b.routeName) return a.routeName.localeCompare(b.routeName)
      return a.scheduleTime.localeCompare(b.scheduleTime)
    })
  }, [overrides, schedulesMap, routesMap, stopsMap])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Schedule Price Overrides</h2>
          <p className="mt-2 text-slate-500">
            Set a different stop-to-stop price for a specific departure time. If no override exists, the standard price is used.
          </p>
        </div>
        <button 
          onClick={() => {
            setShowForm(true)
            setEditingOverrideId(null)
            setRouteId('')
            setScheduleId('')
            setFromStopId('')
            setToStopId('')
            setPrice('')
            setLabel('')
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Schedule Price Override
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">
            {editingOverrideId ? 'Edit Schedule Price Override' : 'Add Schedule Price Override'}
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2 lg:col-span-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Route</label>
              <select
                value={routeId}
                onChange={(e) => handleRouteSelect(e.target.value)}
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

            <div className="space-y-2 lg:col-span-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Departure Time</label>
              <select
                value={scheduleId}
                onChange={(e) => setScheduleId(e.target.value)}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm disabled:bg-slate-50 disabled:text-slate-400"
                disabled={!routeId}
              >
                <option value="">{routeId ? 'Select departure time' : 'Select route first'}</option>
                {availableSchedules.sort((a, b) => a.departure_time.localeCompare(b.departure_time)).map(schedule => {
                  const time = formatTime(schedule.departure_time)
                  const display = schedule.label ? `${time} — ${schedule.label}` : time
                  return (
                    <option key={schedule.id} value={schedule.id}>
                      {display}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">From Stop</label>
              <select
                value={fromStopId}
                onChange={(e) => setFromStopId(e.target.value)}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm disabled:bg-slate-50 disabled:text-slate-400"
                disabled={!routeId}
              >
                <option value="">{routeId ? 'Select from stop' : 'Select route first'}</option>
                {availableStops.map(stop => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">To Stop</label>
              <select
                value={toStopId}
                onChange={(e) => setToStopId(e.target.value)}
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm disabled:bg-slate-50 disabled:text-slate-400"
                disabled={!routeId}
              >
                <option value="">{routeId ? 'Select to stop' : 'Select route first'}</option>
                {availableStops.map(stop => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Price (¥)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Math.floor(Math.max(0, Number(e.target.value)))
                  setPrice(val)
                }}
                placeholder="e.g. 15000"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>

            <div className="space-y-2 lg:col-span-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Label (Optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Evening shuttle surcharge"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={saveOverride}
              disabled={loading || !scheduleId || !fromStopId || !toStopId || price === '' || fromStopId === toStopId}
              className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors hover:bg-black/80"
            >
              {loading ? 'Saving...' : 'Save Override'}
            </button>

            <button
              onClick={() => {
                setShowForm(false)
                setEditingOverrideId(null)
                setRouteId('')
                setScheduleId('')
                setFromStopId('')
                setToStopId('')
                setPrice('')
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
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">Loading overrides...</div>
        ) : overrides.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="font-semibold text-slate-700">No schedule price overrides have been added.</p>
            <p className="mt-1">All departure times are currently using the standard route prices.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Departure Time</th>
                  <th className="px-6 py-4">From</th>
                  <th className="px-6 py-4">To</th>
                  <th className="px-6 py-4">Override Price</th>
                  <th className="px-6 py-4">Label</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayOverrides.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{row.routeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{row.scheduleTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.fromStopName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.toStopName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-bold tracking-widest shadow-sm">
                        {formatPrice(row.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.label && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                          {row.label}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setShowForm(true)
                            setEditingOverrideId(row.id)
                            setRouteId(row.routeId || '')
                            setScheduleId(row.schedule_id || '')
                            setFromStopId(row.from_stop_id || '')
                            setToStopId(row.to_stop_id || '')
                            setPrice(row.price ?? '')
                            setLabel(row.label || '')
                          }}
                          className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOverride(row.id)}
                          className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
