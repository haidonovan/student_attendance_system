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

    // Get query parameter for specific class (optional)
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get("classId")

    // Fetch teacher and their classes
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    })

    if (!teacher) {
      return new Response(JSON.stringify({ error: "Teacher profile not found" }), { status: 404 })
    }

    // If specific classId provided, fetch only that class
    if (classId) {
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          students: {
            include: {
              user: {
                select: { email: true, image: true },
              },
            },
          },
          attendance: {
            orderBy: { date: "desc" },
            take: 100, // Get recent attendance records
          },
        },
      })

      if (!classData || classData.teacherId !== teacher.id) {
        return new Response(JSON.stringify({ error: "Class not found or unauthorized" }), { status: 404 })
      }

      // Calculate statistics
      const totalStudents = classData.students.length
      const todayAttendance = classData.attendance
        .filter((att) => att.date.toDateString() === new Date().toDateString())
        .reduce(
          (acc, att) => {
            acc[att.status.toLowerCase()] = (acc[att.status.toLowerCase()] || 0) + 1
            acc.total += 1
            return acc
          },
          { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
        )

      // Calculate attendance percentage for each student
      const studentAttendanceData = classData.students.map((student) => {
        const studentRecords = classData.attendance.filter((att) => att.studentId === student.id)
        const presentCount = studentRecords.filter((att) => att.status === "PRESENT").length
        const totalRecords = studentRecords.length
        const attendancePercentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0

        return {
          id: student.id,
          studentId: student.studentId,
          fullName: student.fullName,
          gender: student.gender,
          email: student.user?.email,
          avatar: student.user?.image,
          attendancePercentage,
          totalRecords,
        }
      })

      // Calculate overall class attendance percentage
      const allClassAttendance = classData.attendance
      const presentCount = allClassAttendance.filter((att) => att.status === "PRESENT").length
      const totalCount = allClassAttendance.length
      const overallAttendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

      return new Response(
        JSON.stringify({
          class: {
            id: classData.id,
            name: classData.name,
            section: classData.section,
            year: classData.year,
            teacherId: classData.teacherId,
          },
          stats: {
            totalStudents,
            todayAttendance,
            overallAttendancePercentage,
          },
          students: studentAttendanceData,
        }),
        { status: 200 },
      )
    }

    // If no classId, fetch all classes for the teacher
    const allClasses = await prisma.class.findMany({
      where: { teacherId: teacher.id },
      include: {
        students: true,
        attendance: {
          where: {
            date: {
              gte: new Date(new Date().toDateString()),
            },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    const classesData = allClasses.map((classItem) => {
      const totalStudents = classItem.students.length
      const todayAttendance = classItem.attendance.reduce(
        (acc, att) => {
          acc[att.status.toLowerCase()] = (acc[att.status.toLowerCase()] || 0) + 1
          acc.total += 1
          return acc
        },
        { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
      )

      const attendancePercentage =
        todayAttendance.total > 0
          ? Math.round(((todayAttendance.present + todayAttendance.late) / todayAttendance.total) * 100)
          : 0

      return {
        id: classItem.id,
        name: classItem.name,
        section: classItem.section,
        year: classItem.year,
        totalStudents,
        todayAttendance,
        attendancePercentage,
      }
    })

    return new Response(
      JSON.stringify({
        teacher: {
          id: teacher.id,
          fullName: teacher.fullName,
          subject: teacher.subject,
        },
        classes: classesData,
        totalClasses: classesData.length,
      }),
      { status: 200 },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
