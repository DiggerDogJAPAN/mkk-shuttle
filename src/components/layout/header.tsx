"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Container } from "@/components/ui/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { Menu, X, User, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
      setIsAdmin(data?.role === 'admin')
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        checkAdmin(currentUser.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
        setIsAdmin(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          checkAdmin(currentUser.id).finally(() => setLoading(false))
        } else {
          setLoading(false)
          setIsAdmin(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setIsMobileMenuOpen(false)
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between relative">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-bold text-xl text-primary inline-block">
                Myoko Shuttle
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none group">
                  Routes
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              } />
              <DropdownMenuContent align="center" className="w-64 p-2">
                <DropdownMenuItem render={
                  <Link href="/services/narita-haneda" className="w-full flex items-center px-2 py-2">
                    Tokyo Airports - Myoko Area
                  </Link>
                } />
                <DropdownMenuItem render={
                  <Link href="/services/shiga-kogen" className="w-full flex items-center px-2 py-2">
                    Tokyo Airports - Shiga Kogen
                  </Link>
                } />
                <DropdownMenuItem render={
                  <Link href="/services/niigata-airport" className="w-full flex items-center px-2 py-2">
                    Niigata Airport - Myoko Area
                  </Link>
                } />
                <DropdownMenuItem render={
                  <Link href="/services/local-shuttle" className="w-full flex items-center px-2 py-2">
                    Mt. Myoko Local Shuttle
                  </Link>
                } />
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/services/snow-monkey"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Snow Monkey Park
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-2">
              {!loading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 outline-none">
                          <User className="h-4 w-4" />
                          <span>My Account</span>
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem render={
                          <Link href="/account" className="w-full cursor-pointer flex items-center">
                            Dashboard
                          </Link>
                        } />
                        <DropdownMenuItem render={
                          <Link href="/account/bookings" className="w-full cursor-pointer flex items-center">
                            My Bookings
                          </Link>
                        } />
                        {isAdmin && (
                          <DropdownMenuItem render={
                            <Link href="/admin" className="w-full cursor-pointer flex items-center">
                              Admin Panel
                            </Link>
                          } />
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="cursor-pointer text-destructive focus:text-destructive w-full text-left"
                        >
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                      Log in
                    </Link>
                  )}
                </>
              )}

              <Link href="/book" className={buttonVariants({ size: "sm" })}>
                Book Now
              </Link>
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle Menu</span>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background">
          <Container>
            <div className="flex flex-col space-y-4 py-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Routes</p>
                <div className="flex flex-col space-y-3 pl-3 border-l border-border ml-1">
                  <Link
                    href="/services/narita-haneda"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tokyo Airports - Myoko Area
                  </Link>
                  <Link
                    href="/services/shiga-kogen"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tokyo Airports - Shiga Kogen
                  </Link>
                  <Link
                    href="/services/niigata-airport"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Niigata Airport - Myoko Area
                  </Link>
                  <Link
                    href="/services/local-shuttle"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mt. Myoko Local Shuttle
                  </Link>
                </div>
              </div>

              <Link
                href="/services/snow-monkey"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Snow Monkey Park
              </Link>

              <div className="h-px w-full bg-border/40 my-2" />

              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/account"
                        className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full justify-start" })}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/account/bookings"
                        className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full justify-start" })}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full justify-start" })}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" })}
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className={buttonVariants({ variant: "ghost", size: "sm", className: "w-full justify-start" })}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  )}
                </>
              )}

              <Link
                href="/book"
                className={buttonVariants({ size: "sm", className: "w-full justify-start" })}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
