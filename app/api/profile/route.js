// app/api/profile/route.js
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    // Read sessionToken from cookies
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/sessionToken=([^;]+)/);
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 });
    }

    const sessionToken = match[1];

    // Find session and include user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 });
    }

    const user = session.user;

    // Fetch full profile
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        teacherProfile: {
          select: {
            id: true,
            fullName: true,
            subject: true,
            bio: true,
            employeeId: true,
            classes: { select: { id: true, name: true, section: true } }
          }
        },
        studentProfile: {
          select: {
            id: true,
            fullName: true,
            studentId: true,
            gender: true,
            class: { select: { id: true, name: true, section: true } },
            attendance: { select: { id: true, date: true, status: true } },
            standbyClass: { select: { id: true, name: true } }
          }
        },
        notifications: { select: { id: true, message: true, read: true } },
        generatedReports: { select: { id: true, title: true } },
      },
    });



    if (!profile) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ user: profile }), { status: 200 });
  } catch (err) {
    console.error("🔥 Profile API error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
