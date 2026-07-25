'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TurnstileWidget } from '@/components/auth/turnstile-widget'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captchaToken) {
      alert('Please complete the human verification before logging in.')
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken }
      })

      if (error) {
        if (error.message.toLowerCase().includes('captcha') || error.message.toLowerCase().includes('verification')) {
          alert('Human verification failed. Please try again.')
        } else {
          alert(error.message)
        }
        turnstileRef.current?.reset()
        setCaptchaToken(null)
        return
      }

      router.push('/')
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
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
          Welcome Back
        </h1>

        <p className="text-gray-500 mb-6">
          Log in to manage your shuttle bookings
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

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

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-gray-500 underline hover:text-black"
            >
              Forgot your password?
            </a>
          </div>

          <TurnstileWidget
            turnstileRef={turnstileRef}
            action="login"
            onSuccess={(token) => setCaptchaToken(token)}
            onExpire={() => {
              setCaptchaToken(null)
              alert('The verification expired. Please complete it again.')
            }}
            onError={() => {
              setCaptchaToken(null)
              alert('Human verification failed. Please try again.')
            }}
          />

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="underline"
          >
            Create Account
          </a>
        </p>

      </div>
    </div>
  )
}
