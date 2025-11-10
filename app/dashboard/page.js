
// app/dashboard/page.js
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (!sessionToken) return redirect("/login");

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || new Date(session.expires) < new Date()) {
    return redirect("/login");
  }

  const role = session.user.role.toLowerCase();

  return redirect(`/dashboard/${role}`);
}
