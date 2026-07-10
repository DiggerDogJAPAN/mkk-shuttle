"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Loader2 } from "lucide-react"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    let isMounted = true

    async function checkAdminStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          if (isMounted) {
            router.push('/login')
          }
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (error || !profile || profile.role !== 'admin') {
          console.error("Unauthorized access attempt:", error)
          if (isMounted) {
            router.push('/')
          }
          return
        }

        if (isMounted) {
          setIsAuthorized(true)
        }
      } catch (err) {
        console.error("Error verifying admin status:", err)
        if (isMounted) {
          router.push('/')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkAdminStatus()

    return () => {
      isMounted = false
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
