"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Loader2 } from "lucide-react"

const ALLOWED_PATHS = [
  "/coming-soon", 
  "/login", 
  "/signup", 
  "/forgot-password", 
  "/reset-password"
]

export function ComingSoonGate({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function checkAccess() {
      // 1. If site is live, always allow
      if (process.env.NEXT_PUBLIC_SITE_STATUS !== "coming-soon") {
        if (mounted) setIsAuthorized(true)
        return
      }

      // 2. If path is allowed for public, allow
      // (This prevents an infinite redirect loop when redirecting to /coming-soon)
      if (ALLOWED_PATHS.includes(pathname)) {
        if (mounted) setIsAuthorized(true)
        return
      }

      // 3. Site is coming-soon, path is not allowed. Check session and role.
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.replace("/coming-soon")
        return
      }

      // 4. User is logged in, check if admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (profile?.role === "admin") {
        if (mounted) setIsAuthorized(true)
      } else {
        router.replace("/coming-soon")
      }
    }

    checkAccess()

    return () => {
      mounted = false
    }
  }, [pathname, router])

  // If not authorized yet, but we are on a protected route while in coming-soon mode,
  // show a loading spinner to prevent the protected page content from flashing.
  if (!isAuthorized && process.env.NEXT_PUBLIC_SITE_STATUS === "coming-soon" && !ALLOWED_PATHS.includes(pathname)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-slate-500 mt-4 animate-pulse">Verifying access...</p>
      </div>
    )
  }

  // Once authorized, render the actual page content
  return <>{children}</>
}
