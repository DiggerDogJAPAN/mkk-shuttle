"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { supabase } from "@/lib/supabaseClient"
import { Plus } from "lucide-react"

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null)

  const fetchRoutes = async () => {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch routes:', error)
      return
    }

    setRoutes(data || [])
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  const saveRoute = async () => {
    if (!fromLocation || !toLocation) {
      alert('Please enter both from and to locations')
      return
    }

    setLoading(true)

    const generatedName = `${fromLocation.trim()} → ${toLocation.trim()}`

    const payload = {
      name: generatedName,
      from_location: fromLocation.trim(),
      to_location: toLocation.trim(),
    }

    let error

    if (editingRouteId) {
      const result = await supabase
        .from('routes')
        .update(payload)
        .eq('id', editingRouteId)

      error = result.error
    } else {
      const result = await supabase
        .from('routes')
        .insert([payload])

      error = result.error
    }

    setLoading(false)

    if (error) {
      console.error('Failed to save route:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      alert(`Failed to save route: ${error.message}`)
      return
    }

    setFromLocation('')
    setToLocation('')
    setEditingRouteId(null)
    setShowForm(false)
    fetchRoutes()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeading title="Manage Routes" description="Configure shuttle service routes and destinations." />
        <button 
          onClick={() => {
            setShowForm(true)
            setEditingRouteId(null)
            setFromLocation('')
            setToLocation('')
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Route
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editingRouteId ? 'Edit Route' : 'Add Route'}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="From location"
              className="rounded-lg border p-3"
            />

            <input
              type="text"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              placeholder="To location"
              className="rounded-lg border p-3"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={saveRoute}
              disabled={loading}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Route'}
            </button>

            <button
              onClick={() => {
                setShowForm(false)
                setEditingRouteId(null)
                setFromLocation('')
                setToLocation('')
              }}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-white">
        {routes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No routes found.
          </div>
        ) : (
          <div className="divide-y">
            {routes.map((route) => (
              <div
                key={route.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div>
                  <div className="font-semibold">
                    {route.from_location} to {route.to_location}
                  </div>

                  {route.name && (
                    <div className="text-sm text-gray-500">
                      {route.name}
                    </div>
                  )}

                  {route.created_at && (
                    <div className="text-xs text-gray-400">
                      Created: {new Date(route.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowForm(true)
                    setEditingRouteId(route.id)
                    setFromLocation(route.from_location || '')
                    setToLocation(route.to_location || '')
                  }}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
