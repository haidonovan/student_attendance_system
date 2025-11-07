import { prisma } from '@/lib/prisma'

// GET /api/teachers/[id]
export async function GET(req, { params }) {
  try {
    const { id } = params
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        classes: true,
      },
    })

    if (!teacher) {
      return new Response('Teacher not found', { status: 404 })
    }

    return new Response(JSON.stringify(teacher), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error fetching teacher', { status: 500 })
  }
}

// PATCH /api/teachers/[id]
export async function PATCH(req, { params }) {
  try {
    const { id } = params
    const data = await req.json()

    const updated = await prisma.teacher.update({
      where: { id },
      data,
    })

    return new Response(JSON.stringify(updated), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to update teacher', { status: 500 })
  }
}

// DELETE /api/teachers/[id]
export async function DELETE(req, { params }) {
  try {
    const { id } = params

    await prisma.teacher.delete({
      where: { id },
    })

    return new Response('Teacher deleted', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Failed to delete teacher', { status: 500 })
  }
}
