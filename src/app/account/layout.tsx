import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { PageHeading } from "@/components/ui/page-heading"
import { AuthGuard } from "@/components/auth/auth-guard"
import { User, Ticket } from "lucide-react"
import { generateSeoMetadata } from "@/lib/seo"

export const metadata = generateSeoMetadata({
  title: 'My Account',
  path: '/account',
  noIndex: true,
})

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <Section>
        <Container>
          <PageHeading 
            title="My Account" 
            description="Manage your profile and bookings." 
          />
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 shrink-0">
              <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
                <Link 
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <User className="w-4 h-4" />
                  Overview
                </Link>
                <Link 
                  href="/account/bookings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <Ticket className="w-4 h-4" />
                  My Bookings
                </Link>
              </nav>
            </aside>
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </Container>
      </Section>
    </AuthGuard>
  )
}
