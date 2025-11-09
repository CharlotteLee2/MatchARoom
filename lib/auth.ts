import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    console.log('getCurrentUser - token exists:', !!token)

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as number

    console.log('getCurrentUser - userId:', userId)

    const user = await prisma.user.findUnique({
      where: { id: userId as any },
      select: {
        id: true,
        email: true,
      },
    })

    console.log('getCurrentUser - user found:', !!user)

    return user
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
}

