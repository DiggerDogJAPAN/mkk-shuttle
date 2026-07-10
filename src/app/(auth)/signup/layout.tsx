import { generateSeoMetadata } from '@/lib/seo'

export const metadata = generateSeoMetadata({
  title: 'Create Account',
  description: 'Create an account to book and manage your MKK Shuttle reservations.',
  path: '/signup',
  noIndex: true,
})

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
