import * as React from "react"
import Link from "next/link"
import { AdminGuard } from "@/components/auth/admin-guard"
import { generateSeoMetadata } from "@/lib/seo"

export const metadata = generateSeoMetadata({
  title: 'Admin Dashboard',
  path: '/admin',
  noIndex: true,
})
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col md:flex-row bg-background">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {sidebarLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Nav (Simple horizontal scroll or stacked) */}
        <nav className="md:hidden border-b border-border bg-card overflow-x-auto">
          <ul className="flex p-2 space-x-2">
            {sidebarLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </div>
        </main>
        
      </div>
    </AdminGuard>
  )
}
