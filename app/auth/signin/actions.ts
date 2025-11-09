'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function signup(email: string, password: string) {
  try {
    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    console.log('Attempting to create user with email:', email)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return { error: 'User with this email already exists' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Password hashed successfully')

    // Create user in database
    console.log('Creating user in database...')
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })
    console.log('User created successfully:', { id: user.id, email: user.email })

    // Don't set cookie on signup - user needs to sign in manually
    // This allows them to see the success screen first

    return { success: true, user: { id: user.id, email: user.email } }
  } catch (error: any) {
    console.error('Signup error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })
    // Return more specific error message
    if (error?.code === 'P2002') {
      return { error: 'User with this email already exists' }
    }
    // Return detailed error for debugging
    const errorMessage = error?.message || 'Unknown error'
    console.error('Full error object:', JSON.stringify(error, null, 2))
    return { error: `Failed to create account: ${errorMessage}` }
  }
}

export async function login(email: string, password: string) {
  try {
    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: 'Invalid email or password' }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return { error: 'Invalid email or password' }
    }

    // Create JWT token
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secret)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    // Revalidate the home page to ensure the cookie is recognized
    revalidatePath('/')
    
    // Redirect server-side to ensure cookie is available
    redirect('/')
  } catch (error: any) {
    // Re-throw redirect errors - they're not actual errors
    if (error?.digest?.startsWith('NEXT_REDIRECT') || error?.message?.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Login error:', error)
    return { error: 'Failed to login' }
  }
}

