// ✅ Features

// GET → Fetch all classes with teachers and students.

// POST → Create a new class (assign a teacher if you have one).

// PUT → Update class info including the assigned teacher.

// DELETE → Delete a class by ID.

// PATCH → Assign multiple students to a class at once.


import { prisma } from '../../../lib/prisma'

// GET all classes with teacher and students
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: true,
        students: {
          include: { user: true } // include user info for each student
        }
      }
    })
    return new Response(JSON.stringify(classes), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// POST create a new class
export async function POST(req) {
  try {
    const body = await req.json()
    const { name, section, year, teacherId } = body

    if (!name || !year) {
      return new Response(JSON.stringify({ error: 'Name and year are required' }), { status: 400 })
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        section,
        year,
        teacherId: teacherId || null
      },
      include: {
        teacher: true,
        students: true
      }
    })

    return new Response(JSON.stringify(newClass), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// PUT update class info (name, section, teacher)
export async function PUT(req) {
  try {
    const body = await req.json()
    const { id, name, section, year, teacherId } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Class ID is required' }), { status: 400 })
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        section,
        year,
        teacherId
      },
      include: {
        teacher: true,
        students: true
      }
    })

    return new Response(JSON.stringify(updatedClass), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// DELETE a class by ID
export async function DELETE(req) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Class ID is required' }), { status: 400 })
    }

    await prisma.class.delete({
      where: { id }
    })

    return new Response(JSON.stringify({ message: 'Class deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// POST assign multiple students to a class
export async function PATCH(req) {
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


