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

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as number

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: {
        id: true,
        email: true,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

