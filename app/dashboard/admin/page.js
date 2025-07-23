"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar,
  Search,
  Bell,
  Settings,
  Download,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  Activity,
  Zap,
  Shield,
  Target,
  Award,
  BarChart3,
  PieChart,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  Flame,
  Star,
  Crown,
  Trophy,
} from "lucide-react"

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [notifications, setNotifications] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Animated counter hook
  const useAnimatedCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      let startTime
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }, [end, duration])

    return count
  }

  // Sample data
  const dashboardStats = {
    totalStudents: 1247,
    totalTeachers: 89,
    activeClasses: 156,
    averageAttendance: 87.3,
    lowAttendanceStudents: 23,
    pendingReports: 12,
    todayClasses: 45,
  }

  const attendanceData = [
    { name: "Present", value: 87.3, color: "#10B981" },
    { name: "Absent", value: 8.2, color: "#EF4444" },
    { name: "Late", value: 4.5, color: "#F59E0B" },
  ]

  const weeklyActivityData = [
    { day: "Mon", students: 1180, teachers: 85, classes: 42 },
    { day: "Tue", students: 1205, teachers: 87, classes: 45 },
    { day: "Wed", students: 1156, teachers: 82, classes: 38 },
    { day: "Thu", students: 1223, teachers: 89, classes: 47 },
    { day: "Fri", students: 1198, teachers: 86, classes: 44 },
    { day: "Sat", students: 892, teachers: 45, classes: 28 },
    { day: "Sun", students: 234, teachers: 12, classes: 8 },
  ]

  const performanceData = [
    { month: "Sep", attendance: 85, performance: 82 },
    { month: "Oct", attendance: 88, performance: 85 },
    { month: "Nov", attendance: 87, performance: 88 },
    { month: "Dec", attendance: 89, performance: 87 },
    { month: "Jan", attendance: 87, performance: 91 },
  ]

  const todaySchedule = [
    {
      id: 1,
      time: "08:00 - 09:00",
      class: "Mathematics Grade 10",
      teacher: "Dr. Sarah Wilson",
      room: "Room 201",
      students: 28,
      status: "ongoing",
    },
    {
      id: 2,
      time: "09:00 - 10:00",
      class: "Biology Grade 11",
      teacher: "Prof. Michael Chen",
      room: "Lab 105",
      students: 25,
      status: "upcoming",
    },
    {
      id: 3,
      time: "10:00 - 11:00",
      class: "English Literature",
      teacher: "Ms. Emily Davis",
      room: "Room 304",
      students: 30,
      status: "upcoming",
    },
    {
      id: 4,
      time: "11:00 - 12:00",
      class: "Physics Grade 12",
      teacher: "Dr. James Rodriguez",
      room: "Lab 203",
      students: 22,
      status: "upcoming",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "attendance",
      message: "Morning attendance completed for Grade 10A",
      user: "Ms. Johnson",
      time: "5 minutes ago",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      id: 2,
      type: "alert",
      message: "Low attendance alert for John Smith (Grade 9B)",
      user: "System",
      time: "12 minutes ago",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      id: 3,
      type: "report",
      message: "Weekly report submitted by Dr. Wilson",
      user: "Dr. Wilson",
      time: "25 minutes ago",
      icon: FileText,
      color: "text-purple-500",
    },
    {
      id: 4,
      type: "user",
      message: "New teacher account created: Prof. Anderson",
      user: "Admin",
      time: "1 hour ago",
      icon: Users,
      color: "text-cyan-500",
    },
    {
      id: 5,
      type: "system",
      message: "Database backup completed successfully",
      user: "System",
      time: "2 hours ago",
      icon: Shield,
      color: "text-green-500",
    },
  ]

  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "Server Performance",
      message: "High CPU usage detected on main server",
      time: "10 minutes ago",
    },
    {
      id: 2,
      type: "warning",
      title: "Low Attendance Alert",
      message: "23 students below 60% attendance threshold",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "info",
      title: "System Update",
      message: "Scheduled maintenance tonight at 2:00 AM",
      time: "3 hours ago",
    },
  ]

  const quickActions = [
    { icon: Plus, label: "Add Student", color: "from-green-500 to-emerald-600" },
    { icon: Users, label: "Manage Teachers", color: "from-purple-500 to-violet-600" },
    { icon: BookOpen, label: "Create Class", color: "from-orange-500 to-red-600" },
    { icon: FileText, label: "Generate Report", color: "from-cyan-500 to-teal-600" },
    { icon: Settings, label: "System Settings", color: "from-gray-500 to-slate-600" },
    { icon: Download, label: "Export Data", color: "from-pink-500 to-rose-600" },
  ]

  // Animated counters
  const animatedStudents = useAnimatedCounter(dashboardStats.totalStudents)
  const animatedTeachers = useAnimatedCounter(dashboardStats.totalTeachers)
  const animatedClasses = useAnimatedCounter(dashboardStats.activeClasses)
  const animatedAttendance = useAnimatedCounter(dashboardStats.averageAttendance)
  const animatedLowAttendance = useAnimatedCounter(dashboardStats.lowAttendanceStudents)
  const animatedPendingReports = useAnimatedCounter(dashboardStats.pendingReports)
  const animatedTodayClasses = useAnimatedCounter(dashboardStats.todayClasses)

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "upcoming":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case "critical":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/10"
      case "warning":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-900/10"
      case "info":
        return "border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/10"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/10"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search students, teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              <ThemeToggle />

              {/* Admin Profile */}
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/admin-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Super Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {/* Total Students */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {animatedStudents.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +5.2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Teachers */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Teachers</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{animatedTeachers}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +2 new this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Classes */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Classes</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{animatedClasses}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
                    <BookOpen className="w-3 h-3" />
                    {animatedTodayClasses} today
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Attendance */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Attendance</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{animatedAttendance.toFixed(1)}%</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-1 mt-1">
                    <Target className="w-3 h-3" />
                    Above target
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Attendance Students */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Attendance</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{animatedLowAttendance}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    Below 60%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Reports */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reports</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{animatedPendingReports}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    Need review
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">98.5%</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <Activity className="w-3 h-3" />
                    All systems operational
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Pie Chart */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Attendance Distribution
              </CardTitle>
              <CardDescription>Current month attendance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <RechartsPieChart data={attendanceData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {attendanceData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.name}: {entry.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity Bar Chart */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Weekly Activity
              </CardTitle>
              <CardDescription>Student attendance by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="students" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Trend */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Performance Trend
              </CardTitle>
              <CardDescription>Monthly attendance vs performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="performance"
                      stackId="2"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-500" />
                    Today's Schedule Summary
                  </CardTitle>
                  <CardDescription>{todaySchedule.length} classes scheduled for today</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{schedule.time}</p>
                        <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{schedule.class}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{schedule.teacher}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {schedule.room} • {schedule.students} students
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities & Alerts */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <Icon className={`w-4 h-4 mt-1 ${activity.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-500">{activity.user}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                  View All Activities
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  System Alerts
                </CardTitle>
                <CardDescription>Important notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:scale-105 transition-all duration-200 bg-transparent"
                  >
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Monthly Growth</p>
                  <p className="text-3xl font-bold">+12.5%</p>
                  <p className="text-sm text-purple-200 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    Student enrollment
                  </p>
                </div>
                <Star className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Success Rate</p>
                  <p className="text-3xl font-bold">94.2%</p>
                  <p className="text-sm text-green-200 flex items-center gap-1 mt-1">
                    <Award className="w-3 h-3" />
                    Course completion
                  </p>
                </div>
                <Trophy className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Active Sessions</p>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-sm text-orange-200 flex items-center gap-1 mt-1">
                    <Flame className="w-3 h-3" />
                    Live right now
                  </p>
                </div>
                <Activity className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100">Response Time</p>
                  <p className="text-3xl font-bold">0.8s</p>
                  <p className="text-sm text-cyan-200 flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3" />
                    System average
                  </p>
                </div>
                <RefreshCw className="w-12 h-12 text-cyan-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
