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

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
    }

    // Extract query parameters for filtering
    const url = new URL(req.url)
    const studentId = url.searchParams.get("studentId")
    const searchTerm = url.searchParams.get("search")
    const classId = url.searchParams.get("classId")
    const status = url.searchParams.get("status")
    const limit = Number.parseInt(url.searchParams.get("limit")) || 50
    const offset = Number.parseInt(url.searchParams.get("offset")) || 0

    // Build filter object
    const whereFilter = {}
    if (classId) {
      whereFilter.classId = classId
    }
    if (searchTerm) {
      whereFilter.OR = [
        { fullName: { contains: searchTerm, mode: "insensitive" } },
        { user: { email: { contains: searchTerm, mode: "insensitive" } } },
        { studentId: { contains: searchTerm, mode: "insensitive" } },
      ]
    }

    // Fetch specific student with details
    if (studentId) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              phoneNumber: true,
              address: true,
            },
          },
          class: {
            include: {
              teacher: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
      })

      if (!student) {
        return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 })
      }

      // Calculate student attendance statistics
      const attendanceRecords = await prisma.attendance.findMany({
        where: {
          studentId: student.id,
        },
        orderBy: {
          date: "desc",
        },
        take: 200,
      })

      const attendanceStats = {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        total: attendanceRecords.length,
      }

      attendanceRecords.forEach((record) => {
        attendanceStats[record.status.toLowerCase()]++
      })

      const attendancePercentage =
        attendanceStats.total > 0
          ? Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100)
          : 0

      // Get today's attendance if any
      const todayDate = new Date(new Date().toDateString())
      const todayAttendance = await prisma.attendance.findUnique({
        where: {
          studentId_date: {
            studentId: student.id,
            date: todayDate,
          },
        },
      })

      // Get recent attendance records
      const recentAttendance = attendanceRecords.slice(0, 10)

      const studentResponse = {
        admin: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        },
        studentDetails: {
          id: student.id,
          fullName: student.fullName,
          studentId: student.studentId,
          gender: student.gender,
          userId: student.userId,
          classId: student.classId,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        },
        userInfo: student.user,
        classInfo: student.class,
        stats: {
          attendancePercentage,
          totalClasses: attendanceStats.total,
          presentDays: attendanceStats.present,
          absentDays: attendanceStats.absent,
          lateDays: attendanceStats.late,
          excusedDays: attendanceStats.excused,
        },
        todayAttendance: todayAttendance || null,
        recentAttendance,
      }

      return new Response(JSON.stringify(studentResponse), { status: 200 })
    }

    // Fetch all students with pagination
    const students = await prisma.student.findMany({
      where: whereFilter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            section: true,
            year: true,
          },
        },
        _count: {
          select: {
            attendance: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get total count for pagination
    const totalCount = await prisma.student.count({
      where: whereFilter,
    })

    // Enhance students with attendance statistics
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const attendanceRecords = await prisma.attendance.findMany({
          where: {
            studentId: student.id,
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          select: {
            status: true,
          },
        })

        const stats = {
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: attendanceRecords.length,
        }

        attendanceRecords.forEach((record) => {
          stats[record.status.toLowerCase()]++
        })

        const rate = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0

        // Determine status based on attendance
        let attendanceStatus = "Active"
        if (rate < 70) {
          attendanceStatus = "Flagged"
        } else if (rate < 85) {
          attendanceStatus = "Warning"
        }

        return {
          id: student.id,
          fullName: student.fullName,
          studentId: student.studentId,
          gender: student.gender,
          email: student.user?.email,
          image: student.user?.image,
          class: student.class?.name,
          section: student.class?.section,
          year: student.class?.year,
          attendancePercentage: rate,
          attendanceStatus,
          totalAttendanceRecords: student._count.attendance,
          monthlyStats: stats,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        }
      }),
    )

    // Overall statistics
    const allStudents = await prisma.student.count()
    const allClasses = await prisma.class.count()
    const allTeachers = await prisma.teacher.count()

    // Get low attendance students
    const lowAttendanceStudents = studentsWithStats.filter((s) => s.attendancePercentage < 70).length

    const allStudentsResponse = {
      admin: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      stats: {
        totalStudents: allStudents,
        totalClasses: allClasses,
        totalTeachers: allTeachers,
        listedStudents: students.length,
        lowAttendanceCount: lowAttendanceStudents,
        totalCount,
      },
      students: studentsWithStats,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    }

    return new Response(JSON.stringify(allStudentsResponse), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}

export async function POST(req) {
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

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
    }

    const body = await req.json()
    const { fullName, studentId, gender, classId, userId } = body

    // Validate required fields
    if (!fullName || !studentId) {
      return new Response(JSON.stringify({ error: "Full name and student ID are required" }), { status: 400 })
    }

    // Check if student ID already exists
    const existingStudent = await prisma.student.findUnique({
      where: { studentId },
    })
    if (existingStudent) {
      return new Response(JSON.stringify({ error: "Student ID already exists" }), { status: 400 })
    }

    // Create new student
    const newStudent = await prisma.student.create({
      data: {
        fullName,
        studentId,
        gender: gender || "Not specified",
        classId: classId || null,
        userId: userId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
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
    })

    return new Response(JSON.stringify({ success: true, student: newStudent }), { status: 201 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}

export async function PUT(req) {
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

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
    }

    const body = await req.json()
    const { id, fullName, gender, classId } = body

    // Validate required fields
    if (!id) {
      return new Response(JSON.stringify({ error: "Student ID is required" }), { status: 400 })
    }

    // Verify student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    })
    if (!existingStudent) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 })
    }

    // Update student
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(gender && { gender }),
        ...(classId !== undefined && { classId: classId || null }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
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
    })

    return new Response(JSON.stringify({ success: true, student: updatedStudent }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}

export async function DELETE(req) {
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

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
    }

    const url = new URL(req.url)
    const studentId = url.searchParams.get("studentId")

    if (!studentId) {
      return new Response(JSON.stringify({ error: "Student ID is required" }), { status: 400 })
    }

    // Verify student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    })
    if (!existingStudent) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 })
    }

    // Delete student (cascading deletes handled by Prisma)
    await prisma.student.delete({
      where: { id: studentId },
    })

    return new Response(JSON.stringify({ success: true, message: "Student deleted successfully" }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
