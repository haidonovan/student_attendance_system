import { prisma } from "@/lib/prisma"

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    let sessionToken = null

    const cookieParts = cookie.split(";")
    for (let i = 0; i < cookieParts.length; i++) {
      const part = cookieParts[i].trim()
      if (part.startsWith("sessionToken=")) {
        sessionToken = part.substring("sessionToken=".length)
        break
      }
    }

    if (!sessionToken) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
    }

    // Find session and user
    const session = await prisma.session.findUnique({
      where: { sessionToken: sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    const user = session.user

    // Check if user is a student
    if (user.role !== "STUDENT") {
      return new Response(JSON.stringify({ error: "Not a student" }), { status: 403 })
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
      include: {
        standbyClass: true,
        class: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
    })

    if (!student) {
      return new Response(JSON.stringify({ error: "Student profile not found" }), { status: 404 })
    }

    // Get all attendance records for this student
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId: student.id },
      include: {
        class: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    })

    // Calculate statistics
    const totalRecords = attendanceRecords.length
    let presentCount = 0
    let absentCount = 0
    let lateCount = 0
    let excusedCount = 0

    for (let i = 0; i < attendanceRecords.length; i++) {
      const record = attendanceRecords[i]
      if (record.status === "PRESENT") {
        presentCount += 1
      } else if (record.status === "ABSENT") {
        absentCount += 1
      } else if (record.status === "LATE") {
        lateCount += 1
      } else if (record.status === "EXCUSED") {
        excusedCount += 1
      }
    }

    const presentPercentage = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0
    const absentPercentage = totalRecords > 0 ? ((absentCount / totalRecords) * 100).toFixed(1) : 0
    const latePercentage = totalRecords > 0 ? ((lateCount / totalRecords) * 100).toFixed(1) : 0
    const excusedPercentage = totalRecords > 0 ? ((excusedCount / totalRecords) * 100).toFixed(1) : 0

    // Format attendance records for frontend
    const formattedRecords = []
    for (let i = 0; i < attendanceRecords.length; i++) {
      const record = attendanceRecords[i]
      const className = record.class ? record.class.name : "Unknown Class"
      const teacherName =
        record.class && record.class.teacher && record.class.teacher.user
          ? record.class.teacher.user.name
          : "Unknown Teacher"

      formattedRecords.push({
        id: record.id,
        date: record.date.toISOString().split("T")[0],
        class: className,
        teacher: teacherName,
        status: record.status,
      })
    }

    // Return formatted response
    const responseData = {
      student: {
        id: student.id,
        fullName: student.fullName,
        studentId: student.studentId,
        standbyClass: student.standbyClass ? student.standbyClass.name : "No standby class",
        email: user.email,
      },
      statistics: {
        totalRecords: totalRecords,
        presentCount: presentCount,
        absentCount: absentCount,
        lateCount: lateCount,
        excusedCount: excusedCount,
        presentPercentage: Number.parseFloat(presentPercentage),
        absentPercentage: Number.parseFloat(absentPercentage),
        latePercentage: Number.parseFloat(latePercentage),
        excusedPercentage: Number.parseFloat(excusedPercentage),
      },
      attendanceRecords: formattedRecords,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    }

    return new Response(JSON.stringify(responseData), { status: 200 })
  } catch (err) {
    console.error("[v0] Attendance API Error:", err)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
