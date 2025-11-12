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
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get("classId")
    const limit = Number.parseInt(searchParams.get("limit")) || 50
    const offset = Number.parseInt(searchParams.get("offset")) || 0

    // Fetch teacher
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    })

    if (!teacher) {
      return new Response(JSON.stringify({ error: "Teacher profile not found" }), { status: 404 })
    }

    // Build where clause for reports
    const whereClause = {}
    if (classId) {
      // Verify that this class belongs to the teacher
      const classExists = await prisma.class.findUnique({
        where: { id: classId, teacherId: teacher.id },
      })

      if (!classExists) {
        return new Response(JSON.stringify({ error: "Class not found or unauthorized" }), { status: 404 })
      }

      whereClause.classId = classId
    } else {
      // Get all classes for this teacher
      const teacherClasses = await prisma.class.findMany({
        where: { teacherId: teacher.id },
        select: { id: true },
      })

      const classIds = teacherClasses.map((cls) => cls.id)
      if (classIds.length > 0) {
        whereClause.classId = { in: classIds }
      }
    }

    // Fetch reports for teacher's classes
    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        class: {
          select: { id: true, name: true, section: true, year: true },
        },
        generatedBy: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    // Get total count for pagination
    const totalCount = await prisma.report.count({
      where: whereClause,
    })

    // Calculate statistics
    const reportsStats = {
      total: totalCount,
      completed: reports.length,
      average: reports.length,
      types: {
        monthly: reports.filter((r) => r.title.toLowerCase().includes("month")).length,
        quarterly: reports.filter((r) => r.title.toLowerCase().includes("quarter")).length,
        assessment: reports.filter((r) => r.title.toLowerCase().includes("assess")).length,
        conference: reports.filter((r) => r.title.toLowerCase().includes("conference")).length,
      },
    }

    // Format reports for response
    const formattedReports = reports.map((report) => ({
      id: report.id,
      title: report.title,
      content: report.content,
      classId: report.classId,
      class: report.class,
      generatedById: report.generatedById,
      generatedBy: report.generatedBy,
      createdAt: report.createdAt,
      type: determineReportType(report.title),
      status: "completed",
    }))

    return new Response(
      JSON.stringify({
        reports: formattedReports,
        stats: reportsStats,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
      }),
      { status: 200 },
    )
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

    // Check if user is a teacher
    if (session.user.role !== "TEACHER") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not a teacher" }), { status: 403 })
    }

    const userId = session.user.id

    // Parse request body
    const body = await req.json()
    const { classId, title, content } = body

    if (!classId || !title) {
      return new Response(JSON.stringify({ error: "Missing required fields: classId, title" }), { status: 400 })
    }

    // Fetch teacher
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    })

    if (!teacher) {
      return new Response(JSON.stringify({ error: "Teacher profile not found" }), { status: 404 })
    }

    // Verify that the class belongs to the teacher
    const classExists = await prisma.class.findUnique({
      where: { id: classId, teacherId: teacher.id },
    })

    if (!classExists) {
      return new Response(JSON.stringify({ error: "Class not found or unauthorized" }), { status: 404 })
    }

    // Create report
    const newReport = await prisma.report.create({
      data: {
        classId,
        generatedById: userId,
        title,
        content: content || "",
      },
      include: {
        class: {
          select: { id: true, name: true, section: true, year: true },
        },
        generatedBy: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    return new Response(
      JSON.stringify({
        message: "Report created successfully",
        report: {
          id: newReport.id,
          title: newReport.title,
          content: newReport.content,
          classId: newReport.classId,
          class: newReport.class,
          generatedById: newReport.generatedById,
          generatedBy: newReport.generatedBy,
          createdAt: newReport.createdAt,
          type: determineReportType(newReport.title),
          status: "completed",
        },
      }),
      { status: 201 },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}

// Helper function to determine report type based on title
function determineReportType(title) {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes("month")) return "Monthly"
  if (lowerTitle.includes("quarter")) return "Quarterly"
  if (lowerTitle.includes("assess")) return "Assessment"
  if (lowerTitle.includes("conference")) return "Conference"
  return "General"
}
