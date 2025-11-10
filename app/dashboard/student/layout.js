// app/dashboard/student/layout.js
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function StudentLayout({ children }) {
  // 1️⃣ Get session token
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("sessionToken")?.value

  if (!sessionToken) return redirect("/login") // Not logged in

  // 2️⃣ Fetch session and user
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })

  if (!session || new Date(session.expires) < new Date()) return redirect("/login") // Expired

  // 3️⃣ Check role
  const role = session.user.role.toUpperCase()
  if (role !== "STUDENT") {
    if (role === "ADMIN") return redirect("/dashboard/admin")
    if (role === "TEACHER") return redirect("/dashboard/teacher")
    return redirect("/login")
  }

  // ✅ Render children only if role is STUDENT
  return (
    <div className="student-layout">
      {/* Optional: add sidebar/header here */}
      {children}
    </div>
  )
}
