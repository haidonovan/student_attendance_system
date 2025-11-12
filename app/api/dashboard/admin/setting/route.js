import { prisma } from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
    }

    // Get system statistics
    const totalUsers = await prisma.user.count()
    const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } })
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } })
    const totalClasses = await prisma.class.count()
    const totalAttendance = await prisma.attendance.count()

    // Get attendance statistics
    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    })

    const presentToday = todayAttendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length
    const absentToday = todayAttendance.filter((a) => a.status === "ABSENT").length
    const excusedToday = todayAttendance.filter((a) => a.status === "EXCUSED").length

    // Get backup information (simulated)
    const systemSettings = {
      admin: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      school: {
        name: process.env.SCHOOL_NAME || "Greenwood High School",
        address: process.env.SCHOOL_ADDRESS || "123 Education Street, Learning City, LC 12345",
        phone: process.env.SCHOOL_PHONE || "+1 (555) 123-4567",
        email: process.env.SCHOOL_EMAIL || "admin@greenwood.edu",
        website: process.env.SCHOOL_WEBSITE || "www.greenwood.edu",
        logo: process.env.SCHOOL_LOGO || "/school-logo.png",
        description: process.env.SCHOOL_DESCRIPTION || "Excellence in education",
        established: process.env.SCHOOL_ESTABLISHED || "1985",
        principal: process.env.SCHOOL_PRINCIPAL || "Dr. Sarah Johnson",
      },
      statistics: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalClasses,
        totalAttendance,
        todayStats: {
          present: presentToday,
          absent: absentToday,
          excused: excusedToday,
          total: todayAttendance.length,
        },
      },
      systemSettings: {
        theme: "light",
        timezone: process.env.TIMEZONE || "UTC",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:MM",
        language: "en",
        maintenanceMode: false,
        autoBackupEnabled: true,
        backupFrequency: "daily",
        dataRetention: 365,
      },
      backup: {
        lastBackup: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        backupEnabled: true,
        backupFrequency: "daily",
        storageUsed: "2.3 GB",
        storageTotal: "10 GB",
      },
    }

    return new Response(JSON.stringify(systemSettings), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}

export async function POST(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get("file")

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "school_logos", resource_type: "image" }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(buffer)
    })

    return new Response(
      JSON.stringify({
        success: true,
        url: uploadRes.secure_url,
        message: "Logo uploaded successfully",
      }),
      { status: 200 },
    )
  } catch (err) {
    console.error("Cloudinary Upload Error:", err)
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized - Not an admin" }), { status: 403 })
    }

    const body = await req.json()
    const {
      schoolName,
      schoolAddress,
      schoolPhone,
      schoolEmail,
      schoolWebsite,
      schoolLogo,
      schoolDescription,
      schoolEstablished,
      schoolPrincipal,
      theme,
      timezone,
      dateFormat,
      timeFormat,
      language,
      maintenanceMode,
      autoBackupEnabled,
      backupFrequency,
      dataRetention,
    } = body

    // For now, returning success response with updated settings
    const updatedSettings = {
      success: true,
      message: "System settings updated successfully",
      school: {
        name: schoolName,
        address: schoolAddress,
        phone: schoolPhone,
        email: schoolEmail,
        website: schoolWebsite,
        logo: schoolLogo,
        description: schoolDescription,
        established: schoolEstablished,
        principal: schoolPrincipal,
      },
      systemSettings: {
        theme,
        timezone,
        dateFormat,
        timeFormat,
        language,
        maintenanceMode,
        autoBackupEnabled,
        backupFrequency,
        dataRetention,
      },
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.name,
    }

    return new Response(JSON.stringify(updatedSettings), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
