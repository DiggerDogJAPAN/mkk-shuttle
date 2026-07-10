import * as React from "react"
import { AdminGuard } from "@/components/auth/admin-guard"
import { generateSeoMetadata } from "@/lib/seo"
import { AdminSidebar, AdminMobileNav } from "@/components/admin/admin-navigation"

export const metadata = generateSeoMetadata({
  title: 'Admin Dashboard',
  path: '/admin',
  noIndex: true,
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col md:flex-row bg-background">
        <AdminSidebar />
        <AdminMobileNav />

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
