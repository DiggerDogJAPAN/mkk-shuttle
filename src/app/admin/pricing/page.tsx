"use client"

import { useState, useEffect, useMemo } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Trash2, Edit } from "lucide-react"

export default function AdminPricingPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [stops, setStops] = useState<any[]>([])
  const [prices, setPrices] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  
  const [showForm, setShowForm] = useState(false)
  const [routeId, setRouteId] = useState('')
  const [fromStopId, setFromStopId] = useState('')
  const [toStopId, setToStopId] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [label, setLabel] = useState('')
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [
        routesResult, 
        stopsResult, 
        pricesResult
      ] = await Promise.all([
        supabase.from('routes').select('*'),
        supabase.from('stops').select('*').order('stop_order', { ascending: true }),
        supabase.from('prices').select('*')
      ])

      if (routesResult.error) throw routesResult.error
      if (stopsResult.error) throw stopsResult.error
      if (pricesResult.error) throw pricesResult.error

      setRoutes(routesResult.data || [])
      setStops(stopsResult.data || [])
      setPrices(pricesResult.data || [])

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
  const stopsMap = useMemo(() => new Map(stops.map(s => [s.id, s])), [stops])

  const getRouteDisplayName = (route: any) => {
    if (!route) return 'Unknown Route'
    if (route.from_location && route.to_location) {
      return `${route.from_location} → ${route.to_location}`
    }
    return route.name || 'Unknown Route'
  }

  // Auto-generate label when route, fromStop, or toStop changes
  useEffect(() => {
    if (routeId && fromStopId && toStopId) {
      const r = routesMap.get(routeId)
      const fs = stopsMap.get(fromStopId)
      const ts = stopsMap.get(toStopId)
      
      if (r && fs && ts) {
        const routeLabel = r.name || `${r.from_location} → ${r.to_location}`
        const generatedLabel = `${routeLabel} | ${fs.name} → ${ts.name}`
        
        // Only auto-fill if label is empty or matches the old generated format
        // For simplicity, we just set it if it's empty, or the user hasn't explicitly edited it.
        // It's safest to just update it if the user changes the dropdowns.
        setLabel(generatedLabel)
      }
    }
  }, [routeId, fromStopId, toStopId, routesMap, stopsMap])

  // Filter available stops based on selected route
  const availableStops = useMemo(() => {
    if (!routeId) return stops
    return stops.filter(stop => stop.route_id === routeId)
  }, [routeId, stops])

  // Process and group prices for the UI
  const groupedPrices = useMemo(() => {
    const routesGroupMap = new Map<string, any[]>()

    prices.forEach(p => {
      const route = routesMap.get(p.route_id)
      const fromStop = stopsMap.get(p.from_stop_id)
      const toStop = stopsMap.get(p.to_stop_id)

      const routeName = getRouteDisplayName(route)
      
      const enrichedPrice = {
        ...p,
        fromStopName: fromStop?.name || 'Unknown',
        toStopName: toStop?.name || 'Unknown',
        fromStopOrder: fromStop?.stop_order ?? 999,
        toStopOrder: toStop?.stop_order ?? 999
      }

      if (!routesGroupMap.has(routeName)) {
        routesGroupMap.set(routeName, [])
      }
      routesGroupMap.get(routeName)!.push(enrichedPrice)
    })

    return Array.from(routesGroupMap.entries())
      .map(([routeName, routePrices]) => ({
        routeName,
        prices: routePrices.sort((a, b) => {
          if (a.fromStopOrder !== b.fromStopOrder) {
            return a.fromStopOrder - b.fromStopOrder
          }
          return a.toStopOrder - b.toStopOrder
        })
      }))
      .sort((a, b) => a.routeName.localeCompare(b.routeName))
  }, [prices, routesMap, stopsMap])

  const savePrice = async () => {
    if (!routeId || !fromStopId || !toStopId || price === '') {
      alert('Please fill out all required fields')
      return
    }

    if (fromStopId === toStopId) {
      alert('From and To stops must be different')
      return
    }

    setLoading(true)

    const payload = {
      route_id: routeId,
      from_stop_id: fromStopId,
      to_stop_id: toStopId,
      price: Number(price),
      label: label.trim() || null,
    }

    let error

    if (editingPriceId) {
      const result = await supabase
        .from('prices')
        .update(payload)
        .eq('id', editingPriceId)

      error = result.error
    } else {
      const result = await supabase
        .from('prices')
        .insert([payload])

      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error('Failed to save price:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to save price: ${error.message}`)
      return
    }

    setRouteId('')
    setFromStopId('')
    setToStopId('')
    setPrice('')
    setLabel('')
    setEditingPriceId(null)
    setShowForm(false)
    fetchData()
  }

  const deletePrice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this price rule?')) {
      return
    }

    const { error } = await supabase
      .from('prices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete price:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to delete price: ${error.message}`)
      return
    }

    fetchData()
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY' 
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeading title="Manage Pricing" description="Configure fares between specific stops." />
        <button 
          onClick={() => {
            setShowForm(true)
            setEditingPriceId(null)
            setRouteId('')
            setFromStopId('')
            setToStopId('')
            setPrice('')
            setLabel('')
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Price Rule
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editingPriceId ? 'Edit Price Rule' : 'Add Price Rule'}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Route</label>
              <select
                value={routeId}
                onChange={(e) => {
                  setRouteId(e.target.value)
                  setFromStopId('')
                  setToStopId('')
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

            <div className="space-y-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Price (¥)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 13000"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>

            <div className="space-y-2 lg:col-span-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Label (Optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Airport to Myoko | Narita Airport → Shin Akakura"
                className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={savePrice}
              disabled={loading || !routeId || !fromStopId || !toStopId || price === ''}
              className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors hover:bg-black/80"
            >
              {loading ? 'Saving...' : 'Save Price'}
            </button>

            <button
              onClick={() => {
                setShowForm(false)
                setEditingPriceId(null)
                setRouteId('')
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
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">Loading pricing rules...</div>
        ) : prices.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
            No price rules found.
          </div>
        ) : (
          <div className="space-y-8">
            {groupedPrices.map(routeGroup => (
              <div key={routeGroup.routeName} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-base">{routeGroup.routeName}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-1">
                    {routeGroup.prices.map(row => (
                      <div key={row.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 gap-4">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="font-medium text-slate-700 text-sm flex items-center gap-2">
                            {row.fromStopName}
                            <span className="text-slate-400">→</span>
                            {row.toStopName}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-bold tracking-widest shadow-sm">
                            {formatPrice(row.price)}
                          </span>
                          {row.label && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              {row.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setShowForm(true)
                              setEditingPriceId(row.id)
                              setRouteId(row.route_id || '')
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
                            onClick={() => deletePrice(row.id)}
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
