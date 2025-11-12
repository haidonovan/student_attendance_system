import { prisma } from "@/lib/prisma"

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

    // Extract query parameters for filtering
    const url = new URL(req.url)
    const classId = url.searchParams.get("classId")
    const dateFrom = url.searchParams.get("dateFrom")
    const dateTo = url.searchParams.get("dateTo")
    const teacherId = url.searchParams.get("teacherId")

    // Build date range (default to last 7 days)
    let fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 7)
    fromDate = new Date(fromDate.toDateString())

    let toDate = new Date(new Date().toDateString())
    toDate.setDate(toDate.getDate() + 1)

    if (dateFrom) {
      fromDate = new Date(dateFrom)
    }
    if (dateTo) {
      toDate = new Date(dateTo)
      toDate.setDate(toDate.getDate() + 1)
    }

    // Build attendance query filter
    const attendanceFilter = {
      date: {
        gte: fromDate,
        lt: toDate,
      },
    }

    // Add class filter if provided
    if (classId) {
      attendanceFilter.classId = classId
    }

    // Fetch all attendance records in date range
    const attendanceRecords = await prisma.attendance.findMany({
      where: attendanceFilter,
      include: {
        student: true,
        class: {
          include: {
            teacher: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    // Filter by teacher if specified
    let filteredRecords = attendanceRecords
    if (teacherId) {
      filteredRecords = attendanceRecords.filter((record) => record.class.teacherId === teacherId)
    }

    // Calculate daily attendance summary (last 7 days)
    const dailyData = []
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.toDateString())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

      const dayRecords = filteredRecords.filter((r) => {
        const rDate = new Date(r.date.toDateString())
        return rDate >= dayStart && rDate < dayEnd
      })

      const dayStats = dayRecords.reduce(
        (acc, att) => {
          acc[att.status.toLowerCase()] = (acc[att.status.toLowerCase()] || 0) + 1
          acc.total += 1
          return acc
        },
        { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
      )

      const rate = dayStats.total > 0 ? Math.round(((dayStats.present + dayStats.late) / dayStats.total) * 100) : 0

      dailyData.push({
        date: dayStart.toISOString().split("T")[0],
        present: dayStats.present,
        absent: dayStats.absent,
        total: dayStats.total,
        rate,
        day: days[date.getDay()],
      })
    }

    // Calculate class-wise attendance
    const classAttendanceMap = new Map()
    filteredRecords.forEach((record) => {
      const classKey = record.classId
      if (!classAttendanceMap.has(classKey)) {
        classAttendanceMap.set(classKey, {
          classId: record.classId,
          className: record.class.name,
          teacherId: record.class.teacherId,
          teacherName: record.class.teacher?.fullName || "Unassigned",
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0,
        })
      }

      const classData = classAttendanceMap.get(classKey)
      classData[record.status.toLowerCase()]++
      classData.total++
    })

    const classAttendanceData = Array.from(classAttendanceMap.values()).map((cls) => ({
      ...cls,
      rate: cls.total > 0 ? Math.round(((cls.present + cls.late) / cls.total) * 100) : 0,
    }))

    // Generate heatmap data (time slots x days)
    const heatmapData = []
    const timeSlots = ["8:00", "9:00", "10:00", "11:00"]

    for (const day of days) {
      for (const hour of timeSlots) {
        const dayRecords = filteredRecords.filter((r) => {
          const rDate = new Date(r.date)
          return rDate.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3) === day
        })

        const dayStats = dayRecords.reduce(
          (acc, att) => {
            acc[att.status.toLowerCase()] = (acc[att.status.toLowerCase()] || 0) + 1
            acc.total += 1
            return acc
          },
          { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
        )

        const value = dayStats.total > 0 ? Math.round(((dayStats.present + dayStats.late) / dayStats.total) * 100) : 0

        heatmapData.push({
          day,
          hour,
          value,
          class: classAttendanceData[Math.floor(Math.random() * classAttendanceData.length)]?.className || "General",
        })
      }
    }

    // Detect anomalies
    const anomalies = []

    // Check for high absences in specific classes
    classAttendanceData.forEach((cls) => {
      if (cls.absent > 5 && cls.total > 0) {
        const absenceRate = (cls.absent / cls.total) * 100
        if (absenceRate > 25) {
          anomalies.push({
            id: anomalies.length + 1,
            type: "High Absences",
            description: `${cls.absent} absences in ${cls.className}`,
            severity: absenceRate > 40 ? "high" : "medium",
            date: new Date().toISOString().split("T")[0],
            class: cls.className,
            count: cls.absent,
          })
        }
      }
    })

    // Check for attendance drops
    if (dailyData.length > 1) {
      for (let i = 1; i < dailyData.length; i++) {
        const prevRate = dailyData[i - 1].rate
        const currRate = dailyData[i].rate
        const drop = prevRate - currRate

        if (drop > 15) {
          anomalies.push({
            id: anomalies.length + 1,
            type: "Sudden Drop",
            description: `Attendance dropped ${drop}% on ${dailyData[i].date}`,
            severity: drop > 25 ? "high" : "medium",
            date: dailyData[i].date,
            class: "System-wide",
            count: drop,
          })
        }
      }
    }

    // Overall statistics
    const totalStats = filteredRecords.reduce(
      (acc, att) => {
        acc[att.status.toLowerCase()] = (acc[att.status.toLowerCase()] || 0) + 1
        acc.total += 1
        return acc
      },
      { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
    )

    const overallRate =
      totalStats.total > 0 ? Math.round(((totalStats.present + totalStats.late) / totalStats.total) * 100) : 0

    // Recent activities from attendance records
    const recentActivities = filteredRecords.slice(0, 20).map((att) => ({
      id: att.id,
      type: "attendance",
      message: `${att.student.fullName} marked ${att.status.toLowerCase()} in ${att.class.name}`,
      user: att.student.fullName,
      time: new Date(att.createdAt).toLocaleTimeString(),
      status: att.status.toLowerCase(),
      class: att.class.name,
    }))

    const attendanceData = {
      admin: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      period: {
        from: fromDate.toISOString().split("T")[0],
        to: new Date(toDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        days: Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)),
      },
      stats: {
        overallRate,
        totalPresent: totalStats.present,
        totalAbsent: totalStats.absent,
        totalLate: totalStats.late,
        totalExcused: totalStats.excused,
        totalRecords: totalStats.total,
        anomaliesCount: anomalies.length,
        classesTracked: classAttendanceData.length,
      },
      dailyAttendance: dailyData,
      classAttendance: classAttendanceData,
      heatmapData,
      anomalies,
      recentActivities,
      distributionData: [
        {
          name: "Present",
          value: totalStats.total > 0 ? Math.round((totalStats.present / totalStats.total) * 100) : 0,
          color: "#10b981",
        },
        {
          name: "Absent",
          value: totalStats.total > 0 ? Math.round((totalStats.absent / totalStats.total) * 100) : 0,
          color: "#ef4444",
        },
        {
          name: "Late",
          value: totalStats.total > 0 ? Math.round((totalStats.late / totalStats.total) * 100) : 0,
          color: "#f59e0b",
        },
        {
          name: "Excused",
          value: totalStats.total > 0 ? Math.round((totalStats.excused / totalStats.total) * 100) : 0,
          color: "#3b82f6",
        },
      ],
    }

    return new Response(JSON.stringify(attendanceData), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}
