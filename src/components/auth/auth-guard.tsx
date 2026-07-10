"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          if (isMounted) {
            router.push('/login')
          }
          return
        }

        if (isMounted) {
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error("Error verifying auth status:", err)
        if (isMounted) {
          router.push('/login')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
