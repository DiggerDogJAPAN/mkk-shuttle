import { generateSeoMetadata } from '@/lib/seo'

export const metadata = generateSeoMetadata({
  title: 'Log In',
  description: 'Log in to manage your MKK Shuttle bookings.',
  path: '/login',
  noIndex: true,
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
