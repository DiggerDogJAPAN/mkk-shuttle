"use client"

import { useState, useEffect, useMemo } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Trash2, Edit } from "lucide-react"

export default function AdminStopsPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [stops, setStops] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const [showForm, setShowForm] = useState(false)
  const [routeId, setRouteId] = useState('')
  const [name, setName] = useState('')
  const [stopOrder, setStopOrder] = useState<number | ''>('')
  const [label, setLabel] = useState('')
  const [editingStopId, setEditingStopId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [routesResult, stopsResult] = await Promise.all([
        supabase.from('routes').select('*').order('name'),
        supabase.from('stops').select('*, route:routes(*)').order('stop_order', { ascending: true })
      ])

      if (routesResult.error) throw routesResult.error
      if (stopsResult.error) throw stopsResult.error

      setRoutes(routesResult.data || [])
      
      // Sort stops by route name, then stop order
      const sortedStops = (stopsResult.data || []).sort((a: any, b: any) => {
        const nameA = a.route?.name || ''
        const nameB = b.route?.name || ''
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return (a.stop_order || 0) - (b.stop_order || 0)
      })

      setStops(sortedStops)
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

  const saveStop = async () => {
    if (!routeId || !name || stopOrder === '') {
      alert('Please select a route, enter a stop name, and provide a stop order')
      return
    }

    setLoading(true)

    const payload = {
      route_id: routeId,
      name: name.trim(),
      stop_order: Number(stopOrder),
      label: label.trim() || null,
    }

    let error

    if (editingStopId) {
      const result = await supabase
        .from('stops')
        .update(payload)
        .eq('id', editingStopId)

      error = result.error
    } else {
      const result = await supabase
        .from('stops')
        .insert([payload])

      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error('Failed to save stop:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to save stop: ${error.message}`)
      return
    }

    setRouteId('')
    setName('')
    setStopOrder('')
    setLabel('')
    setEditingStopId(null)
    setShowForm(false)
    fetchData()
  }

  const deleteStop = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this stop?')) {
      return
    }

    const { error } = await supabase
      .from('stops')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete stop:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to delete stop: ${error.message}`)
      return
    }

    fetchData()
  }

  const groupedStops = useMemo(() => {
    const routesMap = new Map<string, any[]>()

    stops.forEach(stop => {
      const routeName = stop.route?.from_location && stop.route?.to_location 
        ? `${stop.route.from_location} → ${stop.route.to_location}` 
        : stop.route?.name || 'Unknown Route'

      if (!routesMap.has(routeName)) {
        routesMap.set(routeName, [])
      }
      routesMap.get(routeName)!.push(stop)
    })

    return Array.from(routesMap.entries())
      .map(([routeName, routeStops]) => ({
        routeName,
        stops: routeStops
      }))
      .sort((a, b) => a.routeName.localeCompare(b.routeName))
  }, [stops])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeading title="Manage Stops" description="Configure shuttle route stops and order." />
        <button 
          onClick={() => {
            setShowForm(true)
            setEditingStopId(null)
            setRouteId('')
            setName('')
            setStopOrder('')
            setLabel('')
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Stop
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingStopId ? 'Edit Stop' : 'Add Stop'}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 lg:col-span-2">
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Stop Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Akakura Kanko Hotel"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Order</label>
              <input
                type="number"
                value={stopOrder}
                onChange={(e) => setStopOrder(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 1"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>

            <div className="space-y-2 lg:col-span-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Label (Optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Main Stop, Drop-off only"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={saveStop}
              disabled={loading}
              className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors hover:bg-black/80"
            >
              {loading ? 'Saving...' : 'Save Stop'}
            </button>

            <button
              onClick={() => {
                setShowForm(false)
                setEditingStopId(null)
                setRouteId('')
                setName('')
                setStopOrder('')
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
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">Loading stops...</div>
        ) : stops.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
            No stops found.
          </div>
        ) : (
          <div className="space-y-8">
            {groupedStops.map(routeGroup => (
              <div key={routeGroup.routeName} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-base">{routeGroup.routeName}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-1">
                    {routeGroup.stops.map(stop => (
                      <div key={stop.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            {stop.stop_order}
                          </span>
                          <span className="font-medium text-slate-700 text-sm">
                            {stop.name}
                          </span>
                          {stop.label && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              {stop.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setShowForm(true)
                              setEditingStopId(stop.id)
                              setRouteId(stop.route_id || '')
                              setName(stop.name || '')
                              setStopOrder(stop.stop_order ?? '')
                              setLabel(stop.label || '')
                            }}
                            className="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteStop(stop.id)}
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
