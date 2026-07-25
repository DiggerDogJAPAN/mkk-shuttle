'use client'

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  onExpire: () => void
  onError: () => void
  action?: string
  turnstileRef?: React.RefObject<TurnstileInstance | null>
}

export function TurnstileWidget({
  onSuccess,
  onExpire,
  onError,
  action = 'auth',
  turnstileRef,
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (!siteKey) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm">
        <p className="font-semibold">Development Error:</p>
        <p>NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full my-4">
      <div className="w-full overflow-hidden flex justify-center">
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          options={{
            theme: 'auto',
            size: 'flexible',
            action,
          }}
          onSuccess={onSuccess}
          onExpire={onExpire}
          onError={onError}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">
        Protected by Cloudflare Turnstile
      </p>
    </div>
  )
}
