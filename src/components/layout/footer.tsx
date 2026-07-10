import Link from "next/link"
import { Container } from "@/components/ui/container"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <Container>
        <div className="flex flex-col gap-8 py-12 md:flex-row md:py-16">
          <div className="flex-1 space-y-4">
            <Link href="/" className="font-bold text-xl text-primary">
              Myoko Shuttle
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Reliable, comfortable, and direct transfers to Myoko and surrounding ski resorts.
            </p>
          </div>
          
          <div className="grid flex-1 grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Services</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/services/narita-haneda" className="hover:text-foreground">Narita & Haneda</Link></li>
                <li><Link href="/services/shiga-kogen" className="hover:text-foreground">Shiga Kogen</Link></li>
                <li><Link href="/services/niigata-airport" className="hover:text-foreground">Niigata Airport</Link></li>
                <li><Link href="/services/local-shuttle" className="hover:text-foreground">Local Shuttle</Link></li>
                <li><Link href="/services/snow-monkey" className="hover:text-foreground">Snow Monkey</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/commerce-disclosure" className="hover:text-foreground">Commerce Disclosure</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-border py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Myoko Shuttle. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
