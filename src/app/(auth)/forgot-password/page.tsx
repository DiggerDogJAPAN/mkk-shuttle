'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { TurnstileWidget } from '@/components/auth/turnstile-widget'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captchaToken) {
      alert('Please complete the human verification before submitting.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
        captchaToken
      }
    )

    setLoading(false)

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

    alert('Password reset email sent. Please check your inbox.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
        <p className="text-gray-500 mb-6">Enter your email to receive a reset link.</p>
        
        <form onSubmit={handleResetRequest} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg w-full"
            required
          />

          <TurnstileWidget
            turnstileRef={turnstileRef}
            action="forgot_password"
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Remembered your password?{' '}
          <a
            href="/login"
            className="underline"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}
