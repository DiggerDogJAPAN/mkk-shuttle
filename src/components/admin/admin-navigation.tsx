'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CalendarDays,
  Map,
  Clock,
  Users,
  DollarSign,
  Ban,
  MapPin,
  MapPinned
} from "lucide-react"

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Routes", href: "/admin/routes", icon: Map },
  { name: "Schedules", href: "/admin/schedules", icon: Clock },
  { name: "Stops", href: "/admin/stops", icon: MapPin },
  { name: "Schedule Stops", href: "/admin/schedule-stops", icon: MapPinned },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { name: "Blackout Dates", href: "/admin/blackout-dates", icon: Ban },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "bg-[#1F3A5F]/5 text-[#1F3A5F] font-semibold"
                      : "text-slate-500 font-medium hover:bg-[#F0ECE5] hover:text-slate-900"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-[#1F3A5F] rounded-r-full" />
                  )}
                  <link.icon 
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive
                        ? "text-[#1F3A5F]"
                        : "text-slate-400 group-hover:text-[#1F3A5F]"
                    )} 
                  />
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden border-b border-border bg-card overflow-x-auto scrollbar-hide">
      <ul className="flex p-2 space-x-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href

          return (
            <li key={link.href} className="shrink-0 relative">
              <Link
                href={link.href}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "bg-[#1F3A5F]/5 text-[#1F3A5F] font-semibold"
                    : "text-slate-500 font-medium hover:bg-[#F0ECE5] hover:text-slate-900"
                )}
              >
                <link.icon 
                  className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    isActive
                      ? "text-[#1F3A5F]"
                      : "text-slate-400 group-hover:text-[#1F3A5F]"
                  )} 
                />
                <span className="hidden sm:inline">{link.name}</span>
              </Link>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1/2 bg-[#1F3A5F] rounded-t-full" />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
