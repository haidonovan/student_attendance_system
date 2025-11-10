// app/api/auth-check.js
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function requireAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (!sessionToken) {
    return { error: "Unauthorized", status: 401 };
  }

  const session = await prisma.session.findUnique({ where: { sessionToken } });
  if (!session || new Date(session.expires) < new Date()) {
    return { error: "Session expired", status: 401 };
  }

  return { session };
}
