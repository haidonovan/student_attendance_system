import { prisma } from '../../../lib/prisma'

// GET all attendance records, optionally filter by studentId or classId
export async function GET(req) {
  try {
    const url = new URL(req.url)
    const studentId = url.searchParams.get('studentId')
    const classId = url.searchParams.get('classId')

    const where = {}
    if (studentId) where.studentId = studentId
    if (classId) where.classId = classId

    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        student: { include: { user: true, class: true } },
        class: true
      },
      orderBy: { date: 'desc' }
    })

    return new Response(JSON.stringify(attendanceRecords), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// POST mark attendance (upsert multiple students at once)
export async function POST(req) {
  try {
    const body = await req.json()
    const { classId, records, date } = body

    if (!classId || !records || !Array.isArray(records)) {
      return new Response(JSON.stringify({ error: 'classId, date, and records array are required' }), { status: 400 })
    }

    const recordDate = date ? new Date(date) : new Date()
    const results = []

    for (const rec of records) {
      const { studentId, status } = rec
      if (!studentId || !status) continue

      const attendance = await prisma.attendance.upsert({
        where: {
          studentId_date: { studentId, date: recordDate }
        },
        update: { status },
        create: {
          studentId,
          classId,
          date: recordDate,
          status
        },
        include: {
          student: { include: { user: true, class: true } },
          class: true
        }
      })

      results.push(attendance)
    }

    return new Response(JSON.stringify(results), { status: 201 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// PUT/PATCH update attendance by id
export async function PUT(req) {
  try {
    const body = await req.json()
    const { id, status, date } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Attendance ID is required' }), { status: 400 })
    }

    const updated = await prisma.attendance.update({
      where: { id },
      data: {
        status,
        date: date ? new Date(date) : undefined
      },
      include: {
        student: { include: { user: true, class: true } },
        class: true
      }
    })

    return new Response(JSON.stringify(updated), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// DELETE attendance by id
export async function DELETE(req) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Attendance ID is required' }), { status: 400 })
    }

    await prisma.attendance.delete({
      where: { id }
    })

    return new Response(JSON.stringify({ message: 'Attendance deleted successfully' }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
