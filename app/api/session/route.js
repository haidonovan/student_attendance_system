

// app/api/session/route.js
import { requireAuth } from "../auth-check"; // adjust path
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) {
    return new Response(JSON.stringify({ authenticated: false, error: auth.error }), { status: auth.status });
  }

  return new Response(JSON.stringify({ authenticated: true, user: auth.user }), { status: 200 });
}
