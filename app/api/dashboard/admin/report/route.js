import { prisma } from "@/lib/prisma"

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), {
        status: 401,
      })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
      })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const reportType = searchParams.get("type") // "attendance" or "bestStudents"
    const standbyClassId = searchParams.get("standbyClassId")

    if (reportType === "attendance") {
      const query = {
        include: {
          attendance: {
            include: {
              class: true,
            },
          },
          standbyClass: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
        },
        orderBy: { fullName: "asc" },
      }

      if (standbyClassId) {
        query.where = { standbyClassId }
      }

      const students = await prisma.student.findMany(query)

      const attendanceReport = students.map((student) => {
        const totalClasses = student.attendance.length || 1
        const presentDays = student.attendance.filter((a) => a.status === "PRESENT").length
        const attendancePercentage = totalClasses > 0 ? Math.round((presentDays / totalClasses) * 100) : 0

        return {
          studentId: student.studentId,
          fullName: student.fullName,
          standbyClass: student.standbyClass?.name || "N/A",
          totalClasses,
          presentDays,
          absentDays: student.attendance.filter((a) => a.status === "ABSENT").length,
          lateDays: student.attendance.filter((a) => a.status === "LATE").length,
          attendancePercentage,
        }
      })

      return new Response(JSON.stringify({ success: true, data: attendanceReport }), { status: 200 })
    }

    if (reportType === "bestStudents") {
      const query = {
        include: {
          attendance: true,
          standbyClass: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
        },
      }

      if (standbyClassId) {
        query.where = { standbyClassId }
      }

      const students = await prisma.student.findMany(query)

      const bestStudents = students
        .map((student) => {
          const totalClasses = student.attendance.length || 1
          const presentDays = student.attendance.filter((a) => a.status === "PRESENT").length
          const attendancePercentage = totalClasses > 0 ? Math.round((presentDays / totalClasses) * 100) : 0

          return {
            studentId: student.studentId,
            fullName: student.fullName,
            standbyClass: student.standbyClass?.name || "N/A",
            attendancePercentage,
            totalClasses,
            presentDays,
          }
        })
        .filter((s) => s.attendancePercentage >= 80) // Only 80% and above
        .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
        .slice(0, 20) // Top 20

      return new Response(JSON.stringify({ success: true, data: bestStudents }), { status: 200 })
    }

    return new Response(JSON.stringify({ error: "Invalid report type" }), { status: 400 })
  } catch (err) {
    console.error("[v0] GET report error:", err)
    return new Response(JSON.stringify({ error: "Failed to fetch report" }), {
      status: 500,
    })
  }
}
