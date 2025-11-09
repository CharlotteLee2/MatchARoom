'use client'

import { useState } from 'react'
import Image from 'next/image'
import { validateEmailDomain } from '@/app/auth/email'
import { useRouter } from 'next/navigation'
import { signup, login } from './actions'

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate email domain
    if (isSignUp) {
      const validation = validateEmailDomain(email)
      if (!validation.valid) {
        setError(validation.error || 'Invalid email')
        setLoading(false)
        return
      }
    }

    try {
      const result = isSignUp ? await signup(email, password) : await login(email, password)

      if (result.error) {
        throw new Error(result.error)
      }

      if (isSignUp) {
        setShowSuccess(true)
        setEmail('')
        setPassword('')
      }
      // Login redirect is handled server-side in the action
    } catch (err: any) {
      // Ignore redirect errors from Next.js (they're expected for server-side redirects)
      if (
        err?.digest?.startsWith('NEXT_REDIRECT') || 
        err?.message?.includes('NEXT_REDIRECT') ||
        err?.digest === 'NEXT_REDIRECT;replace;/'
      ) {
        // This is a redirect, not an actual error - let it happen
        return
      }
      // Only show error if it's not a redirect
      if (err?.message && !err.message.includes('NEXT_REDIRECT')) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Show success screen if account was created
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/images/backgroundLogIn.png')] bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-10 bg-white dark:bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mt-45 text-center flex justify-center">
              <Image
                src="/images/matcharoom_logo_v3.png"
                alt="MatchARoom Logo"
                width={120}
                height={30}
                className="object-contain -mt-50"
              />
            </div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-[#548746] dark:text-[#548746]">
              Account Created Successfully!
            </h2>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              You have successfully created your account. Please sign in to continue.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false)
                setIsSignUp(false)
                setEmail('')
                setPassword('')
              }}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#548746] hover:bg-[#3b6330] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#548746]"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/backgroundLogIn.png')] bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-10 bg-white dark:bg-white rounded-lg shadow-lg p-8">
        <div>
          <div className="mt-40 text-center flex justify-center">
            <Image
              src="/images/matcharoom_logo_v3.png"
              alt="MatchARoom Logo"
              width={120}
              height={30}
              className="object-contain -mt-50"
            />
          </div>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isSignUp
              ? (
                  <>
                    Join <span className="font-bold text-[#548746]">MatchARoom</span> - UB students only,<br />
                    To get started, please create an account
                  </>
                )
              : (
                  <>
                    Welcome back to <span className="font-bold text-[#548746]">MatchARoom</span> - UB students only<br />
                    To get started, please sign in
                  </>
                )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                border-gray-300 dark:border-gray-200 placeholder-white-500 dark:placeholder-gray-400 text-black 
                dark:text-gray-500 rounded-t-md focus:outline-none focus:ring-[#548746] focus:border-[#548746] focus:z-10 
                sm:text-sm bg-gray-50 dark:bg-white-700"
                placeholder="Email address (@buffalo.edu)"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 
                dark:border-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-gray-500 dark:text-gray-500 rounded-b-md 
                focus:outline-none focus:ring-[#548746] focus:border-[#548746] focus:z-10 sm:text-sm bg-white dark:bg-gray-50"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm 
              font-medium rounded-md text-gray-100 bg-[#548746] hover:bg-[#3b6330] focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading
                ? isSignUp
                  ? 'Creating account...'
                  : 'Signing in...'
                : isSignUp
                ? 'Sign up'
                : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-sm text-[#548746] dark:text-[#548746] hover:text-[#3b6330] cursor-pointer"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}