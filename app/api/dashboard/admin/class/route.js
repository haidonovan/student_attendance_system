import { prisma } from "@/lib/prisma"

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
    }

    const sessionToken = match[1]
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 })
    }

    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        section: true,
        year: true,
      },
      orderBy: { name: "asc" },
    })

    return new Response(JSON.stringify({ classes }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}





































// import { prisma } from "@/lib/prisma"

// export async function GET(req) {
//   try {
//     const cookie = req.headers.get("cookie") || ""
//     const match = cookie.match(/sessionToken=([^;]+)/)
//     if (!match) {
//       return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
//     }

//     const sessionToken = match[1]

//     // Verify session and get user
//     const session = await prisma.session.findUnique({
//       where: { sessionToken },
//       include: { user: true },
//     })

//     if (!session || new Date(session.expires) < new Date()) {
//       return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
//     }

//     if (session.user.role !== "ADMIN") {
//       return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
//     }

//     // Extract query parameters for filtering
//     const url = new URL(req.url)
//     const classId = url.searchParams.get("classId")
//     const teacherId = url.searchParams.get("teacherId")
//     const year = url.searchParams.get("year")
//     const section = url.searchParams.get("section")
//     const limit = Number.parseInt(url.searchParams.get("limit")) || 50
//     const offset = Number.parseInt(url.searchParams.get("offset")) || 0

//     // Build filter object
//     const whereFilter = {}
//     if (classId) {
//       whereFilter.id = classId
//     }
//     if (teacherId) {
//       whereFilter.teacherId = teacherId
//     }
//     if (year) {
//       whereFilter.year = Number.parseInt(year)
//     }
//     if (section) {
//       whereFilter.section = section
//     }

//     // Fetch specific class with details or all classes
//     if (classId) {
//       const classData = await prisma.class.findUnique({
//         where: { id: classId },
//         include: {
//           teacher: {
//             select: {
//               id: true,
//               fullName: true,
//               subject: true,
//               userId: true,
//             },
//           },
//           students: {
//             select: {
//               id: true,
//               fullName: true,
//               studentId: true,
//               gender: true,
//             },
//           },
//           attendance: {
//             where: {
//               date: {
//                 gte: new Date(new Date().toDateString()),
//               },
//             },
//             include: {
//               student: true,
//             },
//           },
//           reports: {
//             select: {
//               id: true,
//               title: true,
//               createdAt: true,
//             },
//             take: 5,
//             orderBy: {
//               createdAt: "desc",
//             },
//           },
//         },
//       })

//       if (!classData) {
//         return new Response(JSON.stringify({ error: "Class not found" }), { status: 404 })
//       }

//       // Calculate attendance stats for today
//       const todayAttendance = classData.attendance.reduce(
//         (acc, att) => {
//           acc[att.status.toLowerCase()] = (acc[att.status.toLowerCase()] || 0) + 1
//           acc.total += 1
//           return acc
//         },
//         { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
//       )

//       const todayRate =
//         todayAttendance.total > 0
//           ? Math.round(((todayAttendance.present + todayAttendance.late) / todayAttendance.total) * 100)
//           : 0

//       // Get attendance history (last 30 days)
//       const thirtyDaysAgo = new Date()
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
//       thirtyDaysAgo.setHours(0, 0, 0, 0)

//       const historyRecords = await prisma.attendance.findMany({
//         where: {
//           classId,
//           date: {
//             gte: thirtyDaysAgo,
//           },
//         },
//         orderBy: {
//           date: "desc",
//         },
//       })

//       const overallRate =
//         historyRecords.length > 0
//           ? Math.round(
//               (historyRecords.filter((r) => r.status === "PRESENT" || r.status === "LATE").length /
//                 historyRecords.length) *
//                 100,
//             )
//           : 0

//       const classResponse = {
//         admin: {
//           id: session.user.id,
//           name: session.user.name,
//           email: session.user.email,
//           role: session.user.role,
//         },
//         classDetails: {
//           id: classData.id,
//           name: classData.name,
//           section: classData.section,
//           year: classData.year,
//           createdAt: classData.createdAt,
//           updatedAt: classData.updatedAt,
//         },
//         teacher: classData.teacher || null,
//         studentCount: classData.students.length,
//         students: classData.students,
//         attendanceToday: {
//           ...todayAttendance,
//           rate: todayRate,
//         },
//         attendanceOverall: {
//           rate: overallRate,
//           recordsCount: historyRecords.length,
//         },
//         recentReports: classData.reports,
//       }

//       return new Response(JSON.stringify(classResponse), { status: 200 })
//     }

//     // Fetch all classes with pagination
//     const classes = await prisma.class.findMany({
//       where: whereFilter,
//       include: {
//         teacher: {
//           select: {
//             id: true,
//             fullName: true,
//             subject: true,
//           },
//         },
//         _count: {
//           select: {
//             students: true,
//             attendance: true,
//           },
//         },
//       },
//       take: limit,
//       skip: offset,
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     // Get total count for pagination
//     const totalCount = await prisma.class.count({
//       where: whereFilter,
//     })

//     // Get attendance stats for each class (today)
//     const classesWithStats = await Promise.all(
//       classes.map(async (cls) => {
//         const todayAttendance = await prisma.attendance.groupBy({
//           by: ["status"],
//           where: {
//             classId: cls.id,
//             date: {
//               gte: new Date(new Date().toDateString()),
//             },
//           },
//           _count: true,
//         })

//         const stats = {
//           present: 0,
//           absent: 0,
//           late: 0,
//           excused: 0,
//           total: 0,
//         }

//         todayAttendance.forEach((item) => {
//           stats[item.status.toLowerCase()] = item._count
//           stats.total += item._count
//         })

//         const rate = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0

//         return {
//           id: cls.id,
//           name: cls.name,
//           section: cls.section,
//           year: cls.year,
//           teacherId: cls.teacher?.id,
//           teacherName: cls.teacher?.fullName || "Unassigned",
//           studentCount: cls._count.students,
//           todayAttendanceRate: rate,
//           todayStats: stats,
//           createdAt: cls.createdAt,
//           updatedAt: cls.updatedAt,
//         }
//       }),
//     )

//     // Overall statistics
//     const allClasses = await prisma.class.count()
//     const allStudents = await prisma.student.count()

//     const allClassesResponse = {
//       admin: {
//         id: session.user.id,
//         name: session.user.name,
//         email: session.user.email,
//         role: session.user.role,
//       },
//       stats: {
//         totalClasses: allClasses,
//         totalStudents: allStudents,
//         listedClasses: classes.length,
//         totalCount,
//       },
//       classes: classesWithStats,
//       pagination: {
//         limit,
//         offset,
//         hasMore: offset + limit < totalCount,
//       },
//     }

//     return new Response(JSON.stringify(allClassesResponse), { status: 200 })
//   } catch (err) {
//     console.error(err)
//     return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
//   }
// }

// export async function POST(req) {
//   try {
//     const cookie = req.headers.get("cookie") || ""
//     const match = cookie.match(/sessionToken=([^;]+)/)
//     if (!match) {
//       return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
//     }

//     const sessionToken = match[1]

//     // Verify session and get user
//     const session = await prisma.session.findUnique({
//       where: { sessionToken },
//       include: { user: true },
//     })

//     if (!session || new Date(session.expires) < new Date()) {
//       return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
//     }

//     if (session.user.role !== "ADMIN") {
//       return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
//     }

//     const body = await req.json()
//     const { name, section, year, teacherId } = body

//     // Validate required fields
//     if (!name || !year) {
//       return new Response(JSON.stringify({ error: "Name and year are required" }), { status: 400 })
//     }

//     // Verify teacher exists if provided
//     if (teacherId) {
//       const teacher = await prisma.teacher.findUnique({
//         where: { id: teacherId },
//       })
//       if (!teacher) {
//         return new Response(JSON.stringify({ error: "Teacher not found" }), { status: 404 })
//       }
//     }

//     // Create new class
//     const newClass = await prisma.class.create({
//       data: {
//         name,
//         section: section || null,
//         year,
//         teacherId: teacherId || null,
//       },
//       include: {
//         teacher: true,
//       },
//     })

//     return new Response(JSON.stringify({ success: true, class: newClass }), { status: 201 })
//   } catch (err) {
//     console.error(err)
//     return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
//   }
// }

// export async function PUT(req) {
//   try {
//     const cookie = req.headers.get("cookie") || ""
//     const match = cookie.match(/sessionToken=([^;]+)/)
//     if (!match) {
//       return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
//     }

//     const sessionToken = match[1]

//     // Verify session and get user
//     const session = await prisma.session.findUnique({
//       where: { sessionToken },
//       include: { user: true },
//     })

//     if (!session || new Date(session.expires) < new Date()) {
//       return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
//     }

//     if (session.user.role !== "ADMIN") {
//       return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
//     }

//     const body = await req.json()
//     const { id, name, section, year, teacherId } = body

//     // Validate required fields
//     if (!id) {
//       return new Response(JSON.stringify({ error: "Class ID is required" }), { status: 400 })
//     }

//     // Verify class exists
//     const existingClass = await prisma.class.findUnique({
//       where: { id },
//     })
//     if (!existingClass) {
//       return new Response(JSON.stringify({ error: "Class not found" }), { status: 404 })
//     }

//     // Verify teacher exists if provided
//     if (teacherId) {
//       const teacher = await prisma.teacher.findUnique({
//         where: { id: teacherId },
//       })
//       if (!teacher) {
//         return new Response(JSON.stringify({ error: "Teacher not found" }), { status: 404 })
//       }
//     }

//     // Update class
//     const updatedClass = await prisma.class.update({
//       where: { id },
//       data: {
//         ...(name && { name }),
//         ...(section !== undefined && { section: section || null }),
//         ...(year && { year }),
//         ...(teacherId !== undefined && { teacherId: teacherId || null }),
//       },
//       include: {
//         teacher: true,
//       },
//     })

//     return new Response(JSON.stringify({ success: true, class: updatedClass }), { status: 200 })
//   } catch (err) {
//     console.error(err)
//     return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
//   }
// }

// export async function DELETE(req) {
//   try {
//     const cookie = req.headers.get("cookie") || ""
//     const match = cookie.match(/sessionToken=([^;]+)/)
//     if (!match) {
//       return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
//     }

//     const sessionToken = match[1]

//     // Verify session and get user
//     const session = await prisma.session.findUnique({
//       where: { sessionToken },
//       include: { user: true },
//     })

//     if (!session || new Date(session.expires) < new Date()) {
//       return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
//     }

//     if (session.user.role !== "ADMIN") {
//       return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
//     }

//     const url = new URL(req.url)
//     const classId = url.searchParams.get("classId")

//     if (!classId) {
//       return new Response(JSON.stringify({ error: "Class ID is required" }), { status: 400 })
//     }

//     // Verify class exists
//     const existingClass = await prisma.class.findUnique({
//       where: { id: classId },
//     })
//     if (!existingClass) {
//       return new Response(JSON.stringify({ error: "Class not found" }), { status: 404 })
//     }

//     // Delete class (cascading deletes handled by Prisma)
//     await prisma.class.delete({
//       where: { id: classId },
//     })

//     return new Response(JSON.stringify({ success: true, message: "Class deleted successfully" }), { status: 200 })
//   } catch (err) {
//     console.error(err)
//     return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
//   }
// }
