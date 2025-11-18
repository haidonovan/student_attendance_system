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

    // Fetch all standby classes
    const standbyClasses = await prisma.standbyClass.findMany({
      orderBy: { name: "asc" },
    })

    return new Response(JSON.stringify({ standbyClasses }), { status: 200 })
  } catch (err) {
    console.error("[v0] GET standby classes error:", err)
    return new Response(JSON.stringify({ error: "Failed to fetch standby classes" }), { status: 500 })
  }
}
