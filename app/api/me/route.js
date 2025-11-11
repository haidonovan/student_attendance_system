// app/api/me/route.js
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
      include: { user: true },
    });

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 });
    }

    // Send back user info
    const user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      image: session.user.image || null,
    };

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
