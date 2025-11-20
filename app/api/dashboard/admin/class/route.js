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

    const standbyClasses = await prisma.standbyClass.findMany({
      include: {
        classes: {
          include: {
            teacher: true,
            students: true,
          },
        },
        students: true,
      },
      orderBy: { name: "asc" },
    })

    return new Response(JSON.stringify({ standbyClasses }), { status: 200 })
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

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    const { name, section, year } = await req.json()

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 })
    }

    const standbyClass = await prisma.standbyClass.create({
      data: {
        name,
        section: section || null,
        year: year ? Number.parseInt(year) : null,
      },
      include: {
        classes: {
          include: {
            teacher: true,
            students: true,
          },
        },
        students: true,
      },
    })

    return new Response(JSON.stringify({ standbyClass }), { status: 201 })
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

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    const { id, name, section, year } = await req.json()

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 })
    }

    const standbyClass = await prisma.standbyClass.update({
      where: { id },
      data: {
        name,
        section: section || null,
        year: year ? Number.parseInt(year) : null,
      },
      include: {
        classes: {
          include: {
            teacher: true,
            students: true,
          },
        },
        students: true,
      },
    })

    return new Response(JSON.stringify({ standbyClass }), { status: 200 })
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

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    const { id } = await req.json()

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 })
    }

    await prisma.standbyClass.delete({
      where: { id },
    })

    return new Response(JSON.stringify({ message: "Class deleted" }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
