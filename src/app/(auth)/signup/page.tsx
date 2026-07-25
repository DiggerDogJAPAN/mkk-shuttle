'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TurnstileWidget } from '@/components/auth/turnstile-widget'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captchaToken) {
      toast.error('Please complete the human verification before creating your account.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          },
        },
      })

      if (error) {
        if (error.message.toLowerCase().includes('captcha') || error.message.toLowerCase().includes('verification')) {
          toast.error('Human verification failed. Please try again.')
        } else {
          toast.error(error.message)
        }
        turnstileRef.current?.reset()
        setCaptchaToken(null)
        return
      }

      // The profile is now automatically created securely by a Supabase Postgres trigger (handle_new_user)

      toast.success('Account created! Please check your email to verify your account.')
      router.push('/login')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong during signup.')
      turnstileRef.current?.reset()
      setCaptchaToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 mb-6">
          Sign up to manage your shuttle bookings
        </p>

        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >

          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-3 rounded-lg w-full"
              required
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-3 rounded-lg w-full"
              required
            />

          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg w-full"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-lg w-full"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-3 rounded-lg w-full"
            required
          />

          <TurnstileWidget
            turnstileRef={turnstileRef}
            action="signup"
            onSuccess={(token) => setCaptchaToken(token)}
            onExpire={() => {
              setCaptchaToken(null)
              toast.error('The verification expired. Please complete it again.')
            }}
            onError={() => {
              setCaptchaToken(null)
              toast.error('Human verification failed. Please try again.')
            }}
          />

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{' '}
          <a
            href="/login"
            className="underline"
          >
            Log in
          </a>
        </p>

      </div>
    </div>
  )
}
