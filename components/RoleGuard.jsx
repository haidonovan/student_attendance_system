"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function RoleGuard({ allowedRoles = [], children }) {
  const router = useRouter()
  const pathname = usePathname() // detects route changes
  const [loading, setLoading] = useState(true)

  async function checkRole() {
    try {
      const res = await fetch("/api/me")
      if (!res.ok) throw new Error("Not authenticated")

      const data = await res.json()
      const role = data.user.role.toUpperCase()

      if (!allowedRoles.includes(role)) {
        let redirectPath = "/dashboard/student"
        if (role === "TEACHER") redirectPath = "/dashboard/teacher"
        else if (role === "ADMIN") redirectPath = "/dashboard/admin"

        router.replace(redirectPath)
      }
    } catch (err) {
      router.replace("/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkRole()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]) // run every time the route changes

  if (loading) return <div>Loading...</div>

  return <>{children}</>
}
