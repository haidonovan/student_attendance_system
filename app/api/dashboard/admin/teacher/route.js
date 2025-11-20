import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

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
    const teacherId = url.searchParams.get("teacherId")
    const searchTerm = url.searchParams.get("search")
    const subject = url.searchParams.get("subject")
    const limit = Number.parseInt(url.searchParams.get("limit")) || 50
    const offset = Number.parseInt(url.searchParams.get("offset")) || 0

    // Build filter object
    const whereFilter = {}
    if (teacherId) {
      whereFilter.id = teacherId
    }
    if (searchTerm) {
      whereFilter.OR = [
        { fullName: { contains: searchTerm, mode: "insensitive" } },
        { user: { email: { contains: searchTerm, mode: "insensitive" } } },
        { employeeId: { contains: searchTerm, mode: "insensitive" } },
        { subject: { contains: searchTerm, mode: "insensitive" } },
      ]
    }
    if (subject) {
      whereFilter.subject = subject
    }

    // Fetch specific teacher with details
    if (teacherId) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              address: true,
              birthDate: true,
              phoneNumber: true,
            },
          },
          classes: {
            include: {
              _count: {
                select: {
                  students: true,
                },
              },
            },
          },
        },
      })

      if (!teacher) {
        return new Response(JSON.stringify({ error: "Teacher not found" }), { status: 404 })
      }

      // Get all unique standbyClasses from teacher's classes
      const standbyClassIds = teacher.classes.map(c => c.standbyClassId).filter(Boolean)
      let totalStudents = 0
      if (standbyClassIds.length > 0) {
        totalStudents = await prisma.student.count({
          where: {
            standbyClassId: { in: standbyClassIds },
          },
        })
      }

      const classesWithAttendance = await Promise.all(
        teacher.classes.map(async (cls) => {
          const todayStats = await prisma.attendance.groupBy({
            by: ["status"],
            where: {
              classId: cls.id,
              date: {
                gte: new Date(new Date().toDateString()),
              },
            },
            _count: true,
          })

          const stats = {
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
          }

          todayStats.forEach((item) => {
            stats[item.status.toLowerCase()] = item._count
          })

          const total = Object.values(stats).reduce((a, b) => a + b, 0)
          const rate = total > 0 ? Math.round(((stats.present + stats.late) / total) * 100) : 0

          return {
            id: cls.id,
            name: cls.name,
            section: cls.section,
            year: cls.year,
            standbyClassId: cls.standbyClassId,
            studentCount: cls._count.students,
            todayAttendanceRate: rate,
          }
        }),
      )

      // Get recent reports
      const recentReports = await prisma.report.findMany({
        where: {
          generatedById: teacher.userId,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          class: {
            select: {
              name: true,
              section: true,
            },
          },
        },
      })

      const teacherResponse = {
        admin: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        },
        teacherDetails: {
          id: teacher.id,
          fullName: teacher.fullName,
          subject: teacher.subject,
          bio: teacher.bio,
          employeeId: teacher.employeeId,
          userId: teacher.userId,
          createdAt: teacher.createdAt,
          updatedAt: teacher.updatedAt,
        },
        userInfo: teacher.user,
        stats: {
          totalClasses: teacher.classes.length,
          totalStudents,
          totalReports: recentReports.length,
        },
        classes: classesWithAttendance,
        recentReports,
      }

      return new Response(JSON.stringify(teacherResponse), { status: 200 })
    }

    // Fetch all teachers with pagination
    const teachers = await prisma.teacher.findMany({
      where: whereFilter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            address: true,
            birthDate: true,
            phoneNumber: true,
          },
        },
        classes: {
          select: {
            id: true,
            standbyClassId: true,
            _count: {
              select: {
                students: true,
              },
            },
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
    const totalCount = await prisma.teacher.count({
      where: whereFilter,
    })

    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        // Get standbyClass IDs from teacher's classes
        const standbyClassIds = teacher.classes.map(c => c.standbyClassId).filter(Boolean)
        let studentCount = 0
        if (standbyClassIds.length > 0) {
          studentCount = await prisma.student.count({
            where: {
              standbyClassId: { in: standbyClassIds },
            },
          })
        }

        const todayAttendance = await prisma.attendance.groupBy({
          by: ["status"],
          where: {
            classId: { in: teacher.classes.map(c => c.id) },
            date: {
              gte: new Date(new Date().toDateString()),
            },
          },
          _count: true,
        })

        const stats = {
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0,
        }

        todayAttendance.forEach((item) => {
          stats[item.status.toLowerCase()] = item._count
          stats.total += item._count
        })

        const rate = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0

        return {
          id: teacher.id,
          fullName: teacher.fullName,
          subject: teacher.subject,
          bio: teacher.bio,
          employeeId: teacher.employeeId,
          email: teacher.user?.email,
          image: teacher.user?.image,
          classCount: teacher.classes.length,
          studentCount,
          todayAttendanceRate: rate,
          todayStats: stats,
          createdAt: teacher.createdAt,
          updatedAt: teacher.updatedAt,
        }
      }),
    )

    // Overall statistics
    const allTeachers = await prisma.teacher.count()
    const allClasses = await prisma.class.count()
    const allStudents = await prisma.student.count()

    const allTeachersResponse = {
      admin: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      stats: {
        totalTeachers: allTeachers,
        totalClasses: allClasses,
        totalStudents: allStudents,
        listedTeachers: teachers.length,
        totalCount,
      },
      teachers: teachersWithStats,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    }

    return new Response(JSON.stringify(allTeachersResponse), { status: 200 })
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
    const { fullName, subject, bio, email, password, image, birthDate, address, phoneNumber } = body

    // Validate required fields
    if (!fullName) {
      return new Response(JSON.stringify({ error: "Full name is required" }), { status: 400 })
    }

    const lastTeacher = await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
      take: 1,
    })

    let nextNumber = 1
    if (lastTeacher.length > 0 && lastTeacher[0].employeeId) {
      const match = lastTeacher[0].employeeId.match(/TCH(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }

    if (nextNumber > 9999) {
      return new Response(JSON.stringify({ error: "Teacher ID limit reached (TCH9999)" }), { status: 400 })
    }

    const newEmployeeId = `TCH${String(nextNumber).padStart(4, "0")}`

    let userData = {}

    if (email) {
      // Check if user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        userData = { connect: { id: existingUser.id } }
      } else {
        // Create new user with teacher role
        userData = {
          create: {
            email,
            name: fullName,
            role: "TEACHER",
            password: password ? await bcrypt.hash(password, 10) : "$2b$10$jdmgb5jvRTnZqDjcUF4PQO27IemkXjy.HRA50IZkj5cG7Q49vZiNu",
            image: image || null,
            birthDate: birthDate ? new Date(birthDate) : null,
            address: address || null,
            phoneNumber: phoneNumber || null,
          },
        }
      }
    } else {
      // Create user without email
      userData = {
        create: {
          name: fullName,
          role: "TEACHER",
          password: password || null,
          image: image || null,
          birthDate: birthDate ? new Date(birthDate) : null,
          address: address || null,
          phoneNumber: phoneNumber || null,
        },
      }
    }

    // Create new teacher with user
    const newTeacher = await prisma.teacher.create({
      data: {
        fullName,
        subject: subject || null,
        bio: bio || null,
        employeeId: newEmployeeId,
        user: userData,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            address: true,
            birthDate: true,
            phoneNumber: true,
          },
        },
      },
    })

    return new Response(JSON.stringify({ success: true, teacher: newTeacher }), { status: 201 })
  } catch (err) {
    console.error("[v0] Teacher creation error:", err)
    return new Response(JSON.stringify({ error: "Internal error", details: err.message }), { status: 500 })
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
    const { id, fullName, subject, bio, employeeId, email, password, image, birthDate, address, phoneNumber } = body

    // Validate required fields
    if (!id) {
      return new Response(JSON.stringify({ error: "Teacher ID is required" }), { status: 400 })
    }

    // Verify teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    })
    if (!existingTeacher) {
      return new Response(JSON.stringify({ error: "Teacher not found" }), { status: 404 })
    }

    // Update teacher
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(subject !== undefined && { subject: subject || null }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(employeeId !== undefined && { employeeId: employeeId || null }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            address: true,
            birthDate: true,
            phoneNumber: true,
          },
        },
      },
    })

    // Update user fields if provided
    if (email || password || image || birthDate || address || phoneNumber) {
      await prisma.user.update({
        where: { id: updatedTeacher.userId },
        data: {
          ...(email && { email }),
          ...(password && { password }),
          ...(image && { image }),
          ...(birthDate && { birthDate: new Date(birthDate) }),
          ...(address && { address }),
          ...(phoneNumber && { phoneNumber }),
        },
      })
    }

    return new Response(JSON.stringify({ success: true, teacher: updatedTeacher }), { status: 200 })
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
    const teacherId = url.searchParams.get("teacherId")

    if (!teacherId) {
      return new Response(JSON.stringify({ error: "Teacher ID is required" }), { status: 400 })
    }

    // Verify teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })
    if (!existingTeacher) {
      return new Response(JSON.stringify({ error: "Teacher not found" }), { status: 404 })
    }

    const userId = existingTeacher.userId

    // Delete teacher
    await prisma.teacher.delete({
      where: { id: teacherId },
    })

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    })

    return new Response(JSON.stringify({ success: true, message: "Teacher deleted successfully" }), { status: 200 })
  } catch (err) {
    console.error("[v0] Delete teacher error:", err)
    return new Response(JSON.stringify({ error: "Failed to delete teacher", details: err.message }), { status: 500 })
  }
}
