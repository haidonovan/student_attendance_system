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
    const days = url.searchParams.get("days") || "30" // Default to last 30 days
    const classId = url.searchParams.get("classId")

    // Calculate date range
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - Number.parseInt(days))

    // Get teacher profile and classes
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        classes: {
          select: { id: true, name: true, section: true },
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

    // Fetch all attendance records for the period
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        classId: classId ? classId : { in: teacherClassIds },
        date: {
          gte: startDate,
          lte: today,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            studentId: true,
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
      orderBy: [{ date: "desc" }],
    })

    // Calculate total stats
    const totalStats = {
      totalSessions: 0,
      averageAttendance: 0,
      lateArrivals: 0,
      absentStudents: 0,
    }

    const statusCounts = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    }

    const sessionDates = new Set()

    attendanceRecords.forEach((record) => {
      statusCounts[record.status]++
      const dateKey = record.date.toISOString().split("T")[0]
      sessionDates.add(dateKey)

      if (record.status === "LATE") {
        totalStats.lateArrivals++
      }
      if (record.status === "ABSENT") {
        totalStats.absentStudents++
      }
    })

    totalStats.totalSessions = sessionDates.size

    if (attendanceRecords.length > 0) {
      totalStats.averageAttendance = Math.round(
        ((statusCounts.PRESENT + statusCounts.LATE) / attendanceRecords.length) * 100,
      )
    }

    // Group records by date for history table
    const recordsByDate = {}
    attendanceRecords.forEach((record) => {
      const dateKey = record.date.toISOString().split("T")[0]
      if (!recordsByDate[dateKey]) {
        recordsByDate[dateKey] = {
          date: dateKey,
          className: record.class.name,
          classId: record.class.id,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
        }
      }
      recordsByDate[dateKey].total++
      recordsByDate[dateKey][record.status.toLowerCase()]++
    })

    // Convert to array and calculate percentages
    const attendanceHistory = Object.values(recordsByDate)
      .map((record) => ({
        ...record,
        percentage: record.total > 0 ? Math.round((record.present / record.total) * 100) : 0,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    // Create recent activity log (last 50 records grouped by type)
    const recentActivities = attendanceRecords.slice(0, 50).map((record) => {
      let type = "attendance"
      let status = "success"

      if (record.status === "ABSENT") {
        type = "alert"
        status = "warning"
      } else if (record.status === "LATE") {
        type = "alert"
        status = "warning"
      }

      return {
        id: record.id,
        type,
        message: `${record.status === "PRESENT" ? "Present" : record.status === "ABSENT" ? "Absent" : "Late arrival"} - ${record.student.fullName} in ${record.class.name}`,
        status,
        user: teacher.fullName,
        date: record.date,
      }
    })

    return new Response(
      JSON.stringify({
        teacher: {
          id: teacher.id,
          fullName: teacher.fullName,
          classes: teacher.classes,
        },
        stats: {
          totalSessions: totalStats.totalSessions,
          averageAttendance: totalStats.averageAttendance,
          lateArrivals: totalStats.lateArrivals,
          absentStudents: totalStats.absentStudents,
        },
        statusSummary: statusCounts,
        attendanceHistory,
        recentActivities,
        period: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: today.toISOString().split("T")[0],
          days: Number.parseInt(days),
        },
      }),
      { status: 200 },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
