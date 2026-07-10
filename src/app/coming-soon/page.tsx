import { Container } from "@/components/ui/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { generateSeoMetadata } from "@/lib/seo"

export const metadata = generateSeoMetadata({
  title: 'Online Booking Coming Soon',
  description:
    'MKK Shuttle online booking is currently in final testing. Airport shuttle reservations will open soon.',
  path: '/coming-soon',
})

export default function ComingSoonPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-24 bg-white">
      <Container className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            MKK Shuttle
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Online Booking Coming Soon
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            Our new online booking system is currently in final testing. Online reservations will open soon.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">Need to get in touch?</h2>
            <p className="text-slate-500">Contact us directly for inquiries or early bookings.</p>
          </div>
          <a
            href="mailto:bookings@myokoshuttle.com"
            className={buttonVariants({ variant: "primary", size: "lg", className: "rounded-xl font-bold w-full sm:w-auto" })}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Us
          </a>
        </div>
      </Container>
    </div>
  )
}
