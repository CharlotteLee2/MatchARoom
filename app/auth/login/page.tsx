'use client'

import { useState } from 'react'
//import { createClient } from '@/lib/supabase/client'
//import { validateEmailDomain } from '@/lib/auth/email'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        
        if (error) throw error
        
        if (data.user) {
          // Check if email confirmation is required
          alert('Check your email for confirmation link!')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        router.push('/forum')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form UI here */}
      {error && <div className="error">{error}</div>}
    </form>
  )
}