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

    // Extract query parameters
    const url = new URL(req.url)
    const messageId = url.searchParams.get("messageId")
    const searchTerm = url.searchParams.get("search")
    const messageType = url.searchParams.get("type") // info, warning, urgent
    const messageStatus = url.searchParams.get("status") // sent, scheduled, draft
    const classId = url.searchParams.get("classId")
    const limit = Number.parseInt(url.searchParams.get("limit")) || 50
    const offset = Number.parseInt(url.searchParams.get("offset")) || 0

    // Fetch specific message with details
    if (messageId) {
      const report = await prisma.report.findUnique({
        where: { id: messageId },
        include: {
          class: {
            select: {
              id: true,
              name: true,
              section: true,
              year: true,
            },
          },
          generatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })

      if (!report) {
        return new Response(JSON.stringify({ error: "Message not found" }), { status: 404 })
      }

      // Get read status from notifications related to this report/message
      const notifications = await prisma.notification.findMany({
        where: {
          message: {
            contains: report.id,
          },
        },
        select: {
          read: true,
          userId: true,
        },
      })

      const readCount = notifications.filter((n) => n.read).length
      const recipientCount = await prisma.student.count({
        where: {
          classId: report.classId,
        },
      })

      const messageDetails = {
        id: report.id,
        title: report.title,
        content: report.content,
        classId: report.classId,
        class: report.class,
        generatedBy: report.generatedBy,
        createdAt: report.createdAt,
        status: "sent", // Based on reports being sent
        readCount,
        recipientCount: recipientCount || 0,
        readPercentage: recipientCount > 0 ? Math.round((readCount / recipientCount) * 100) : 0,
        notifications: notifications.slice(0, 10),
      }

      return new Response(JSON.stringify(messageDetails), { status: 200 })
    }

    // Build filter object for messages
    const whereFilter = {}
    if (classId) {
      whereFilter.classId = classId
    }
    if (searchTerm) {
      whereFilter.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
        { generatedBy: { name: { contains: searchTerm, mode: "insensitive" } } },
      ]
    }

    // Fetch all messages (reports used as messages)
    const messages = await prisma.report.findMany({
      where: whereFilter,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
            year: true,
          },
        },
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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
    const totalCount = await prisma.report.count({
      where: whereFilter,
    })

    // Enhance messages with engagement metrics
    const messagesWithStats = await Promise.all(
      messages.map(async (msg) => {
        const recipientCount = msg.classId
          ? await prisma.student.count({
              where: { classId: msg.classId },
            })
          : await prisma.student.count()

        const notifications = await prisma.notification.findMany({
          where: {
            message: {
              contains: msg.id,
            },
          },
          select: {
            read: true,
          },
        })

        const readCount = notifications.filter((n) => n.read).length

        return {
          id: msg.id,
          title: msg.title,
          content: msg.content?.substring(0, 100) + (msg.content?.length > 100 ? "..." : ""),
          class: msg.class?.name,
          author: msg.generatedBy?.name,
          recipientCount,
          readCount,
          readPercentage: recipientCount > 0 ? Math.round((readCount / recipientCount) * 100) : 0,
          status: "sent",
          type: msg.content?.toLowerCase().includes("urgent")
            ? "urgent"
            : msg.content?.toLowerCase().includes("warning")
              ? "warning"
              : "info",
          priority: msg.content?.toLowerCase().includes("urgent")
            ? "high"
            : msg.content?.toLowerCase().includes("important")
              ? "normal"
              : "normal",
          sentAt: msg.createdAt,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
        }
      }),
    )

    // Get statistics
    const allReports = await prisma.report.count()
    const todayCount = await prisma.report.count({
      where: {
        createdAt: {
          gte: new Date(new Date().toDateString()),
        },
      },
    })

    // Calculate overall engagement
    const allMessages = await prisma.report.findMany({})
    let totalReads = 0
    let totalRecipients = 0

    for (const msg of allMessages) {
      const notifs = await prisma.notification.findMany({
        where: { message: { contains: msg.id } },
      })
      totalReads += notifs.filter((n) => n.read).length
      totalRecipients += notifs.length
    }

    const allMessagesResponse = {
      admin: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      stats: {
        totalMessages: allReports,
        sentMessages: messagesWithStats.length,
        scheduledMessages: 0,
        draftMessages: 0,
        todayMessages: todayCount,
        totalReads,
        averageReadRate: totalRecipients > 0 ? Math.round((totalReads / totalRecipients) * 100) : 0,
      },
      messages: messagesWithStats,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalCount,
        totalCount,
      },
    }

    return new Response(JSON.stringify(allMessagesResponse), { status: 200 })
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
    const { title, content, classId, recipient, messageType, scheduled, scheduledDate } = body

    // Validate required fields
    if (!title || !content) {
      return new Response(JSON.stringify({ error: "Title and content are required" }), { status: 400 })
    }

    // Create message as a report
    const newMessage = await prisma.report.create({
      data: {
        title,
        content: `[${messageType || "info"}] ${content}`,
        classId: classId || null,
        generatedById: session.user.id,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // If classId provided, send notifications to students in that class
    if (classId) {
      const students = await prisma.student.findMany({
        where: { classId },
        select: { userId: true },
      })

      // Create notifications for each student
      for (const student of students) {
        if (student.userId) {
          await prisma.notification.create({
            data: {
              userId: student.userId,
              message: `${title}: ${content}`,
              type: messageType || "info",
              read: false,
            },
          })
        }
      }
    } else {
      // Send to all students
      const allStudents = await prisma.student.findMany({
        select: { userId: true },
      })

      for (const student of allStudents) {
        if (student.userId) {
          await prisma.notification.create({
            data: {
              userId: student.userId,
              message: `${title}: ${content}`,
              type: messageType || "info",
              read: false,
            },
          })
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: newMessage }), { status: 201 })
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
    const { id, title, content } = body

    if (!id) {
      return new Response(JSON.stringify({ error: "Message ID is required" }), { status: 400 })
    }

    // Verify message exists
    const existingMessage = await prisma.report.findUnique({
      where: { id },
    })
    if (!existingMessage) {
      return new Response(JSON.stringify({ error: "Message not found" }), { status: 404 })
    }

    // Update message
    const updatedMessage = await prisma.report.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return new Response(JSON.stringify({ success: true, message: updatedMessage }), { status: 200 })
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
    const messageId = url.searchParams.get("messageId")

    if (!messageId) {
      return new Response(JSON.stringify({ error: "Message ID is required" }), { status: 400 })
    }

    // Verify message exists
    const existingMessage = await prisma.report.findUnique({
      where: { id: messageId },
    })
    if (!existingMessage) {
      return new Response(JSON.stringify({ error: "Message not found" }), { status: 404 })
    }

    // Delete message and related notifications
    await prisma.notification.deleteMany({
      where: {
        message: {
          contains: messageId,
        },
      },
    })

    await prisma.report.delete({
      where: { id: messageId },
    })

    return new Response(JSON.stringify({ success: true, message: "Message deleted successfully" }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
