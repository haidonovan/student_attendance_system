// app/api/teacher/subject/route.js
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/sessionToken=([^;]+)/);

    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 });
    }

    const sessionToken = match[1];

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: { include: { teacherProfile: true } } },
    });

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 });
    }

    const teacher = session.user.teacherProfile;

    if (!teacher) {
      return new Response(JSON.stringify({ error: "User is not a teacher" }), { status: 403 });
    }

    return new Response(
      JSON.stringify({ subject: teacher.subject }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
