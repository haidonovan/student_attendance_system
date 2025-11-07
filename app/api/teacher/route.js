// import { prisma } from '@/lib/prisma'
import { prisma } from '../../../lib/prisma'



// GET /api/teachers
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        classes: true,
      },
    })
    return new Response(JSON.stringify(teachers), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to fetch teachers', { status: 500 })
  }
}

// POST /api/teachers
export async function POST(req) {
  try {
    const body = await req.json()
    const { userId, fullName, subject, bio } = body

    const teacher = await prisma.teacher.create({
      data: {
        userId,
        fullName,
        subject,
        bio,
      },
    })

    return new Response(JSON.stringify(teacher), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to create teacher', { status: 500 })
  }
}
