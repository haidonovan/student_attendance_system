import { prisma } from "@/lib/prisma"

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    let sessionToken = null

    const cookies = cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const c = cookies[i].trim()
      if (c.startsWith("sessionToken=")) {
        const parts = c.split("=")
        sessionToken = parts[1]
        break
      }
    }

    if (!sessionToken) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    const userId = session.user.id

    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        class: true,
        standbyClass: true,
        attendance: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
      },
    })

    if (!student) {
      return new Response(JSON.stringify({ error: "Student profile not found" }), { status: 404 })
    }

    const totalAttendance = student.attendance.length
    const presentCount = student.attendance.filter((a) => a.status === "PRESENT").length
    const absentCount = student.attendance.filter((a) => a.status === "ABSENT").length
    const lateCount = student.attendance.filter((a) => a.status === "LATE").length
    const excusedCount = student.attendance.filter((a) => a.status === "EXCUSED").length

    const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0

    const classes = await prisma.class.findMany({
      where: {
        students: {
          some: { id: student.id },
        },
      },
      include: {
        teacher: {
          select: { id: true, fullName: true, subject: true },
        },
      },
    })

    const standbyClassName = student.standbyClass ? student.standbyClass.name : "Not Assigned"
    const currentClassName = student.class ? student.class.name : null

    const classesData = []
    for (let i = 0; i < classes.length; i++) {
      const cls = classes[i]
      const teacherName = cls.teacher ? cls.teacher.fullName : "Not Assigned"
      const subjectName = cls.teacher ? cls.teacher.subject : null
      const studentCountValue = cls.students ? cls.students.length : 0

      classesData.push({
        id: cls.id,
        name: cls.name,
        section: cls.section,
        year: cls.year,
        teacher: teacherName,
        subject: subjectName,
        studentCount: studentCountValue,
      })
    }

    const dashboardData = {
      student: {
        id: student.id,
        userId: student.userId,
        name: student.fullName,
        studentId: student.studentId,
        gender: student.gender,
        email: student.user.email,
        avatar: student.user.image || null,
        standbyClass: standbyClassName,
        currentClass: currentClassName,
      },
      attendance: {
        total: totalAttendance,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount,
        percentage: attendancePercentage,
      },
      classes: classesData,
      metadata: {
        fetchedAt: new Date().toISOString(),
        role: student.user.role,
      },
    }

    return new Response(JSON.stringify(dashboardData), { status: 200 })
  } catch (err) {
    console.error("[v0] Error in student-dashboard API:", err)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
