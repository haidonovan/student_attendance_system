// app/api/class/route.js
import { prisma } from '../../../lib/prisma'
import { requireAuth } from '../auth-check'

// GET all classes → Everyone logged in can view
export async function GET() {
  const auth = await requireAuth()
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status })

  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: true,
        students: { include: { user: true } }
      }
    })
    return new Response(JSON.stringify(classes), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// Helper to check if user is allowed to modify classes
function checkClassPermission(user) {
  if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
    return false
  }
  return true
}

// POST create a new class
export async function POST(req) {
  const auth = await requireAuth()
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status })

  const user = await prisma.user.findUnique({ where: { id: auth.session.userId } })
  if (!checkClassPermission(user)) {
    return new Response(JSON.stringify({ error: 'Forbidden: Only teachers or admins can create classes' }), { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, section, year, teacherId } = body
    if (!name || !year) {
      return new Response(JSON.stringify({ error: 'Name and year are required' }), { status: 400 })
    }

    const newClass = await prisma.class.create({
      data: { name, section, year, teacherId: teacherId || null },
      include: { teacher: true, students: true }
    })

    return new Response(JSON.stringify(newClass), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// PUT update class info
export async function PUT(req) {
  const auth = await requireAuth()
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status })

  const user = await prisma.user.findUnique({ where: { id: auth.session.userId } })
  if (!checkClassPermission(user)) {
    return new Response(JSON.stringify({ error: 'Forbidden: Only teachers or admins can update classes' }), { status: 403 })
  }

  try {
    const body = await req.json()
    const { id, name, section, year, teacherId } = body
    if (!id) return new Response(JSON.stringify({ error: 'Class ID is required' }), { status: 400 })

    const updatedClass = await prisma.class.update({
      where: { id },
      data: { name, section, year, teacherId },
      include: { teacher: true, students: true }
    })

    return new Response(JSON.stringify(updatedClass), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// DELETE a class
export async function DELETE(req) {
  const auth = await requireAuth()
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status })

  const user = await prisma.user.findUnique({ where: { id: auth.session.userId } })
  if (!checkClassPermission(user)) {
    return new Response(JSON.stringify({ error: 'Forbidden: Only teachers or admins can delete classes' }), { status: 403 })
  }

  try {
    const body = await req.json()
    const { id } = body
    if (!id) return new Response(JSON.stringify({ error: 'Class ID is required' }), { status: 400 })

    await prisma.class.delete({ where: { id } })
    return new Response(JSON.stringify({ message: 'Class deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// PATCH assign multiple students to a class
export async function PATCH(req) {
  const auth = await requireAuth()
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status })

  const user = await prisma.user.findUnique({ where: { id: auth.session.userId } })
  if (!checkClassPermission(user)) {
    return new Response(JSON.stringify({ error: 'Forbidden: Only teachers or admins can assign students' }), { status: 403 })
  }

  try {
    const body = await req.json()
    const { classId, studentIds } = body
    if (!classId || !Array.isArray(studentIds)) {
      return new Response(JSON.stringify({ error: 'classId and studentIds array are required' }), { status: 400 })
    }

    const updatedStudents = await prisma.student.updateMany({
      where: { id: { in: studentIds } },
      data: { classId }
    })

    return new Response(JSON.stringify({ message: `Assigned ${updatedStudents.count} students to class` }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
