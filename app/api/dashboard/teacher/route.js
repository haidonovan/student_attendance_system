// app/api/dashboard/teacher/route.js
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

    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        classes: {
          include: {
            students: true,
            attendance: {
              where: {
                date: {
                  gte: new Date(new Date().toDateString()), // Today's date
                },
              },
            },
          },
        },
      },
    })

    if (!teacher) {
      return new Response(JSON.stringify({ error: "Teacher profile not found" }), { status: 404 })
    }

    const stats = {
      totalStudents: 0,
      totalClasses: teacher.classes.length,
      todayAttendance: {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        total: 0,
      },
      classesData: [],
    }

    // Process each class
    const classesData = await Promise.all(
      teacher.classes.map(async (classItem) => {
        const totalStudents = classItem.students.length
        stats.totalStudents += totalStudents

        // Calculate today's attendance
        const todayAttendance = classItem.attendance.reduce(
          (acc, att) => {
            acc[att.status.toLowerCase()] = (acc[att.status.toLowerCase()] || 0) + 1
            acc.total += 1
            return acc
          },
          { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
        )

        // Calculate attendance percentage
        const attendancePercentage =
          todayAttendance.total > 0
            ? Math.round(((todayAttendance.present + todayAttendance.late) / todayAttendance.total) * 100)
            : 0

        // Get weekly attendance data
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const weeklyAttendance = await prisma.attendance.findMany({
          where: {
            classId: classItem.id,
            date: {
              gte: sevenDaysAgo,
            },
          },
        })

        const weeklyStats = weeklyAttendance.reduce(
          (acc, att) => {
            acc[att.status.toLowerCase()] = (acc[att.status.toLowerCase()] || 0) + 1
            return acc
          },
          { present: 0, absent: 0, late: 0, excused: 0 },
        )

        return {
          id: classItem.id,
          name: classItem.name,
          section: classItem.section,
          year: classItem.year,
          totalStudents,
          todayAttendance,
          attendancePercentage,
          weeklyStats,
        }
      }),
    )

    stats.classesData = classesData

    stats.todayAttendance = classesData.reduce(
      (acc, classData) => {
        acc.present += classData.todayAttendance.present || 0
        acc.absent += classData.todayAttendance.absent || 0
        acc.late += classData.todayAttendance.late || 0
        acc.excused += classData.todayAttendance.excused || 0
        acc.total += classData.todayAttendance.total || 0
        return acc
      },
      { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
    )

    const recentReports = await prisma.report.findMany({
      where: {
        generatedById: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        class: true,
      },
    })

    const recentNotifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    const dashboardData = {
      teacher: {
        id: teacher.id,
        fullName: teacher.fullName,
        subject: teacher.subject,
        employeeId: teacher.employeeId,
        bio: teacher.bio,
      },
      stats,
      recentReports: recentReports.map((report) => ({
        id: report.id,
        title: report.title,
        className: report.class.name,
        createdAt: report.createdAt,
      })),
      recentNotifications: recentNotifications.map((notif) => ({
        id: notif.id,
        message: notif.message,
        type: notif.type,
        read: notif.read,
        createdAt: notif.createdAt,
      })),
    }

    return new Response(JSON.stringify(dashboardData), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
