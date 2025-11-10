// app/dashboard/teacher/layout.js
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function TeacherLayout({ children }) {
  // 1️⃣ Get the session token from cookies
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("sessionToken")?.value

  if (!sessionToken) {
    return redirect("/login") // Not logged in
  }

  // 2️⃣ Fetch the session and user
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })

  if (!session || new Date(session.expires) < new Date()) {
    return redirect("/login") // Session expired
  }

  // 3️⃣ Check if the role is TEACHER
  const role = session.user.role.toUpperCase()
  if (role !== "TEACHER") {
    // Redirect to their default dashboard
    if (role === "ADMIN") return redirect("/dashboard/admin")
    if (role === "STUDENT") return redirect("/dashboard/student")
    return redirect("/login")
  }

  // ✅ Render the children (TeacherDashboardPage) only if role is TEACHER
  return (
    <div className="teacher-layout">
      {/* You can put sidebar, header, breadcrumbs here if needed */}
      {children}
    </div>
  )
}
