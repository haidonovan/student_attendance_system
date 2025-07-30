"use client"

// nav bar

import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { SidebarTrigger } from "@/components/ui/sidebar"


import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import {
  CalendarIcon,
  TrendingUp,
  Award,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Target,
  Flame,
  Trophy,
  Clock,
  BookOpen,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function StudentAttendanceHistory() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [hoveredDate, setHoveredDate] = useState(null)

  // Sample data
  const attendanceStats = {
    totalClasses: 132,
    presentCount: 118,
    absentCount: 8,
    lateCount: 6,
    presentPercentage: 89.4,
    absentPercentage: 6.1,
    latePercentage: 4.5,
    bestMonth: "June 2025 (98%)",
    longestStreak: 23,
    currentStreak: 5,
    mostMissedSubject: "Math on Mondays",
  }

  const weeklyTrendData = [
    { day: "Mon", attended: 18, total: 20, percentage: 90 },
    { day: "Tue", attended: 19, total: 20, percentage: 95 },
    { day: "Wed", attended: 17, total: 20, percentage: 85 },
    { day: "Thu", attended: 20, total: 20, percentage: 100 },
    { day: "Fri", attended: 16, total: 20, percentage: 80 },
  ]

  const monthlyTrendData = [
    { month: "Sep", percentage: 85 },
    { month: "Oct", percentage: 88 },
    { month: "Nov", percentage: 92 },
    { month: "Dec", percentage: 87 },
    { month: "Jan", percentage: 94 },
  ]

  const attendanceData = [
    {
      date: "2025-01-20",
      class: "Biology A",
      time: "09:00-10:00",
      status: "present",
      teacher: "Ms. Hana",
      subject: "Biology",
    },
    {
      date: "2025-01-20",
      class: "Mathematics",
      time: "10:00-11:00",
      status: "late",
      teacher: "Mr. Smith",
      subject: "Math",
    },
    {
      date: "2025-01-19",
      class: "English Literature",
      time: "11:00-12:00",
      status: "present",
      teacher: "Ms. Johnson",
      subject: "English",
    },
    {
      date: "2025-01-19",
      class: "Physics",
      time: "14:00-15:00",
      status: "absent",
      teacher: "Dr. Wilson",
      subject: "Physics",
    },
    {
      date: "2025-01-18",
      class: "Chemistry",
      time: "09:00-10:00",
      status: "present",
      teacher: "Prof. Davis",
      subject: "Chemistry",
    },
  ]

  const achievements = [
    {
      id: 1,
      title: "Perfect Week",
      description: "100% attendance this week",
      icon: "🎯",
      earned: true,
      date: "Jan 15, 2025",
    },
    {
      id: 2,
      title: "Early Bird",
      description: "No late arrivals for 10 days",
      icon: "🌅",
      earned: true,
      date: "Jan 10, 2025",
    },
    {
      id: 3,
      title: "Streak Master",
      description: "20+ day attendance streak",
      icon: "🔥",
      earned: false,
      progress: 75,
    },
    {
      id: 4,
      title: "Monthly Champion",
      description: "95%+ attendance this month",
      icon: "👑",
      earned: false,
      progress: 89,
    },
  ]

  const classes = [
    { id: "all", name: "All Classes" },
    { id: "biology", name: "Biology A" },
    { id: "math", name: "Mathematics" },
    { id: "english", name: "English Literature" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
  ]

  // Generate calendar data
  const generateCalendarData = () => {
    const calendarData = {}
    const currentDate = new Date()
    const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
    const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)

    for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split("T")[0]
      const dayAttendance = attendanceData.filter((record) => record.date === dateStr)

      if (dayAttendance.length > 0) {
        const presentCount = dayAttendance.filter((record) => record.status === "present").length
        const absentCount = dayAttendance.filter((record) => record.status === "absent").length
        const lateCount = dayAttendance.filter((record) => record.status === "late").length

        let status = "present"
        if (absentCount > 0) status = "absent"
        else if (lateCount > 0) status = "late"

        calendarData[dateStr] = {
          status,
          classes: dayAttendance,
          summary: `${presentCount} present, ${absentCount} absent, ${lateCount} late`,
        }
      }
    }

    return calendarData
  }

  const calendarData = generateCalendarData()

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "absent":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "late":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Present</Badge>
      case "absent":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Absent</Badge>
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Late</Badge>
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-500"
      case "absent":
        return "bg-red-500"
      case "late":
        return "bg-yellow-500"
      default:
        return "bg-gray-300"
    }
  }

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#10B981" }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{percentage.toFixed(1)}%</span>
        </div>
      </div>
    )
  }

  const filteredAttendanceData = attendanceData.filter((record) => {
    if (selectedClass !== "all" && !record.class.toLowerCase().includes(selectedClass)) return false
    if (selectedStatus !== "all" && record.status !== selectedStatus) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/10 dark:bg-gray-900/10 border-b border-white/20 dark:border-gray-700/50">





        {/* Nav Bar and Icon */}
        <div className="flex items-center gap-2 px-3 sm:px-4 m-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden lg:block">
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden lg:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="/dashboard/platform"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Platform
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 dark:text-gray-100">General</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>











        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student-dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Attendance History</h1>
              <p className="text-sm text-gray-300">Track your academic journey</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardContent className="p-6 text-center">
              <CircularProgress percentage={attendanceStats.presentPercentage} color="#10B981" />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white dark:text-white">Present</h3>
                <p className="text-sm text-gray-300 dark:text-gray-400">
                  {attendanceStats.presentCount} / {attendanceStats.totalClasses} classes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardContent className="p-6 text-center">
              <CircularProgress percentage={attendanceStats.absentPercentage} color="#EF4444" />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white dark:text-white">Absent</h3>
                <p className="text-sm text-gray-300 dark:text-gray-400">{attendanceStats.absentCount} classes missed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardContent className="p-6 text-center">
              <CircularProgress percentage={attendanceStats.latePercentage} color="#F59E0B" />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white dark:text-white">Late</h3>
                <p className="text-sm text-gray-300 dark:text-gray-400">{attendanceStats.lateCount} late arrivals</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      {attendanceStats.currentStreak}
                    </h3>
                    <p className="text-sm text-gray-300 dark:text-gray-400">Current Streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      {attendanceStats.longestStreak}
                    </h3>
                    <p className="text-sm text-gray-300 dark:text-gray-400">Best Streak</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white dark:text-white mb-2">Best Month</h3>
              <p className="text-sm text-gray-300 dark:text-gray-400">{attendanceStats.bestMonth}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white dark:text-white mb-2">Total Classes</h3>
              <p className="text-sm text-gray-300 dark:text-gray-400">{attendanceStats.totalClasses} attended</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white dark:text-white mb-2">Most Missed</h3>
              <p className="text-sm text-gray-300 dark:text-gray-400">{attendanceStats.mostMissedSubject}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Trend */}
          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Weekly Attendance Pattern
              </CardTitle>
              <CardDescription className="text-gray-300 dark:text-gray-400">
                Your attendance by day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value, name) => [
                        name === "percentage" ? `${value}%` : value,
                        name === "percentage" ? "Attendance Rate" : "Classes Attended",
                      ]}
                    />
                    <Bar dataKey="percentage" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Monthly Progress
              </CardTitle>
              <CardDescription className="text-gray-300 dark:text-gray-400">
                Attendance percentage over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value) => [`${value}%`, "Attendance Rate"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white dark:text-white">
              <Award className="w-5 h-5 text-yellow-400" />
              Attendance Achievements
            </CardTitle>
            <CardDescription className="text-gray-300 dark:text-gray-400">
              Your milestones and progress badges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border transition-all hover:scale-105 ${achievement.earned
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
                      : "bg-gray-500/10 border-gray-500/20"
                    }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold text-white dark:text-white mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-300 dark:text-gray-400 mb-3">{achievement.description}</p>
                    {achievement.earned ? (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        Earned {achievement.date}
                      </Badge>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400">{achievement.progress}% complete</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white dark:text-white">
              <Filter className="w-5 h-5 text-purple-400" />
              Filter Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300 dark:text-gray-400">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id} className="text-white hover:bg-gray-700">
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 dark:text-gray-400">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">
                      All Status
                    </SelectItem>
                    <SelectItem value="present" className="text-white hover:bg-gray-700">
                      Present
                    </SelectItem>
                    <SelectItem value="absent" className="text-white hover:bg-gray-700">
                      Absent
                    </SelectItem>
                    <SelectItem value="late" className="text-white hover:bg-gray-700">
                      Late
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 dark:text-gray-400">Month</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))
                    }
                    className="text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-white font-medium flex-1 text-center">
                    {selectedMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))
                    }
                    className="text-white hover:bg-white/10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white dark:text-white">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
              Monthly Calendar View
            </CardTitle>
            <CardDescription className="text-gray-300 dark:text-gray-400">
              Visual overview of your attendance pattern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-300 dark:text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i - 6)
                const dateStr = date.toISOString().split("T")[0]
                const dayData = calendarData[dateStr]
                const isCurrentMonth = date.getMonth() === selectedMonth.getMonth()

                return (
                  <div
                    key={i}
                    className={`relative p-2 h-12 rounded-lg border transition-all hover:scale-105 cursor-pointer ${isCurrentMonth
                        ? "border-white/20 bg-white/5 hover:bg-white/10"
                        : "border-gray-600/20 bg-gray-600/5 opacity-50"
                      }`}
                    onMouseEnter={() => dayData && setHoveredDate({ date: dateStr, data: dayData })}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    <div className="text-xs text-white dark:text-white">{date.getDate()}</div>
                    {dayData && (
                      <div
                        className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${getStatusColor(dayData.status)}`}
                      ></div>
                    )}
                  </div>
                )
              })}
            </div>
            {hoveredDate && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                <h4 className="font-medium text-white dark:text-white mb-2">
                  {new Date(hoveredDate.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>
                <p className="text-sm text-gray-300 dark:text-gray-400">{hoveredDate.data.summary}</p>
                <div className="mt-2 space-y-1">
                  {hoveredDate.data.classes.map((cls, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {getStatusIcon(cls.status)}
                      <span className="text-gray-300 dark:text-gray-400">
                        {cls.class} ({cls.time}) - {cls.teacher}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Attendance Table */}
        <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white dark:text-white">
              <BookOpen className="w-5 h-5 text-green-400" />
              Detailed Records ({filteredAttendanceData.length})
            </CardTitle>
            <CardDescription className="text-gray-300 dark:text-gray-400">
              Complete attendance history with filters applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 font-medium text-gray-300 dark:text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300 dark:text-gray-400">Class</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300 dark:text-gray-400">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300 dark:text-gray-400">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendanceData.map((record, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white dark:text-white">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-white dark:text-white">{record.class}</td>
                      <td className="py-3 px-4 text-gray-300 dark:text-gray-400">{record.time}</td>
                      <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                      <td className="py-3 px-4 text-gray-300 dark:text-gray-400">{record.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
