//ProtectedRoute.jsx

"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/session") // <-- your new route
        const data = await res.json()

        if (!data.authenticated) {
          router.push("/login")
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error("Failed to check session:", err)
        router.push("/login")
      }
    }
    checkSession()
  }, [router])

  if (loading) return <div>Loading...</div>

  return children
}
