import { prisma } from "@/lib/prisma"

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    // Check if user is a teacher
    if (session.user.role !== "TEACHER") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not a teacher" }), { status: 403 })
    }

    const userId = session.user.id

    // Get query parameters for filtering
    const url = new URL(req.url)
    const classId = url.searchParams.get("classId")
    const dateFrom = url.searchParams.get("dateFrom")
    const dateTo = url.searchParams.get("dateTo")
    const studentId = url.searchParams.get("studentId")

    // Build dynamic where clause
    const whereClause = {}

    if (classId) {
      whereClause.classId = classId
    }

    if (dateFrom || dateTo) {
      whereClause.date = {}
      if (dateFrom) {
        whereClause.date.gte = new Date(dateFrom)
      }
      if (dateTo) {
        whereClause.date.lte = new Date(dateTo)
      }
    }

    if (studentId) {
      whereClause.studentId = studentId
    }

    // Get teacher's classes
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        classes: {
          select: { id: true, name: true },
        },
      },
    })

    if (!teacher) {
      return new Response(JSON.stringify({ error: "Teacher profile not found" }), { status: 404 })
    }

    const teacherClassIds = teacher.classes.map((c) => c.id)

    // If classId is provided, verify it belongs to this teacher
    if (classId && !teacherClassIds.includes(classId)) {
      return new Response(JSON.stringify({ error: "Unauthorized - Class not found" }), { status: 403 })
    }

    // Fetch attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        classId: classId
          ? classId
          : {
              in: teacherClassIds,
            },
        ...whereClause,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            studentId: true,
            gender: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { student: { fullName: "asc" } }],
      take: 500, // Limit records
    })

    // Group records by date and status
    const groupedByDate = {}
    attendanceRecords.forEach((record) => {
      const dateKey = record.date.toISOString().split("T")[0]
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          records: [],
        }
      }
      groupedByDate[dateKey].records.push({
        id: record.id,
        studentId: record.student.id,
        studentName: record.student.fullName,
        studentCode: record.student.studentId,
        className: record.class.name,
        status: record.status,
      })
      groupedByDate[dateKey][record.status.toLowerCase()] += 1
      groupedByDate[dateKey].total += 1
    })

    // Calculate summary statistics
    const summary = {
      totalRecords: attendanceRecords.length,
      byStatus: {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
      },
      attendancePercentage: 0,
    }

    attendanceRecords.forEach((record) => {
      summary.byStatus[record.status.toLowerCase()] += 1
    })

    if (summary.totalRecords > 0) {
      summary.attendancePercentage = Math.round(
        ((summary.byStatus.present + summary.byStatus.late) / summary.totalRecords) * 100,
      )
    }

    return new Response(
      JSON.stringify({
        teacher: {
          id: teacher.id,
          fullName: teacher.fullName,
          classes: teacher.classes,
        },
        summary,
        dateGroups: Object.values(groupedByDate),
        records: attendanceRecords,
      }),
      { status: 200 },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
