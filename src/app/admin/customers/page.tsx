"use client"

import * as React from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"
import { cn } from "@/lib/utils"
import { Loader2, User, Mail, Shield } from "lucide-react"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('role', { ascending: true }) // Show admins first then customers

        if (error) throw error
        setCustomers(data || [])
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeading title="Manage Customers" description={`Total: ${customers.length} registered users`} />

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/30">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{customer.full_name || `${customer.first_name} ${customer.last_name}`}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                        customer.role === 'admin' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {customer.role === 'admin' && <Shield className="h-3 w-3" />}
                        {customer.role}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right text-muted-foreground">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
