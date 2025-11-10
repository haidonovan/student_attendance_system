"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import {
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  UserCheck,
  FileText,
  Bell,
  Download,
  BarChart3,
  Clock,
  AlertTriangle,
  Award,
  Target,
  Activity,
} from "lucide-react"
import RoleGuard from "@/components/RoleGuard"

export default function TeacherDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days")

  // Sample data for dashboard
  const dashboardStats = {
    totalStudents: 156,
    totalClasses: 6,
    attendanceToday: {
      present: 142,
      absent: 8,
      late: 4,
      permission: 2,
      total: 156,
    },
    weeklyChanges: {
      students: +3,
      attendance: +2.5,
      performance: -1.2,
    },
  }

  // 7-day attendance data
  const attendanceData = [
    { day: "Mon", date: "Jan 15", present: 148, absent: 5, late: 2, permission: 1 },
    { day: "Tue", date: "Jan 16", present: 152, absent: 2, late: 1, permission: 1 },
    { day: "Wed", date: "Jan 17", present: 145, absent: 7, late: 3, permission: 1 },
    { day: "Thu", date: "Jan 18", present: 150, absent: 4, late: 1, permission: 1 },
    { day: "Fri", date: "Jan 19", present: 142, absent: 8, late: 4, permission: 2 },
    { day: "Sat", date: "Jan 20", present: 138, absent: 12, late: 4, permission: 2 },
    { day: "Sun", date: "Jan 21", present: 144, absent: 6, late: 4, permission: 2 },
  ]

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: "attendance",
      message: "Class 10A attendance completed",
      time: "5 minutes ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "alert",
      message: "3 students marked absent in Class 9B",
      time: "15 minutes ago",
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      id: 3,
      type: "report",
      message: "Weekly report generated successfully",
      time: "1 hour ago",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: 4,
      type: "achievement",
      message: "Class 11C achieved 98% attendance",
      time: "2 hours ago",
      icon: Award,
      color: "text-purple-600",
    },
  ]

  // Class performance data
  const classPerformance = [
    { class: "Class 10A", students: 31, attendance: 94.2, trend: "up" },
    { class: "Class 10B", students: 29, attendance: 91.8, trend: "up" },
    { class: "Class 9A", students: 33, attendance: 87.5, trend: "down" },
    { class: "Class 9B", students: 28, attendance: 89.3, trend: "up" },
    { class: "Class 11A", students: 25, attendance: 96.1, trend: "up" },
    { class: "Class 11B", students: 10, attendance: 92.7, trend: "down" },
  ]

  // Quick actions
  const quickActions = [
    {
      title: "Take Attendance",
      description: "Mark attendance for current session",
      icon: UserCheck,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/dashboard/check-attendance",
    },
    {
      title: "Create Report",
      description: "Generate attendance reports",
      icon: FileText,
      color: "bg-green-500 hover:bg-green-600",
      href: "/dashboard/reports",
    },
    {
      title: "View Analytics",
      description: "Detailed attendance analytics",
      icon: BarChart3,
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/dashboard/analytics",
    },
    {
      title: "Manage Classes",
      description: "Add or edit class information",
      icon: GraduationCap,
      color: "bg-orange-500 hover:bg-orange-600",
      href: "/dashboard/classes",
    },
  ]

  const getAttendancePercentage = () => {
    const { present, total } = dashboardStats.attendanceToday
    return Math.round((present / total) * 100)
  }

  const getMaxAttendance = () => {
    return Math.max(...attendanceData.map((day) => day.present + day.absent + day.late + day.permission))
  }

  return (

    <>
    <RoleGuard>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 dark:text-gray-100">Teacher Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gray-50 dark:bg-gray-950">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Good morning, Leonardo Da Vinci! 👋</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Here's what's happening with your classes today</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <Badge className="ml-2 bg-red-500 text-white">3</Badge>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalStudents}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{dashboardStats.weeklyChanges.students}</span>
                <span className="text-sm text-gray-500 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Classes */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Classes</CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalClasses}</div>
              <p className="text-sm text-gray-500 mt-1">Across all grades</p>
            </CardContent>
          </Card>

          {/* Today's Attendance */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Today's Attendance
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardStats.attendanceToday.present}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">{getAttendancePercentage()}% present rate</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Excellent
                </Badge>
              </div>
              <Progress value={getAttendancePercentage()} className="mt-2" />
            </CardContent>
          </Card>

          {/* Performance Trend */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Weekly Performance
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">91.2%</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{dashboardStats.weeklyChanges.attendance}%</span>
                <span className="text-sm text-gray-500 ml-1">improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Common tasks and shortcuts for daily activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-3 ${action.color} text-white border-0 hover:shadow-lg transition-all`}
                >
                  <action.icon className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-90 mt-1">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 7-Day Attendance Chart */}
          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <BarChart3 className="w-5 h-5" />
                    7-Day Attendance Overview
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Daily attendance breakdown showing Present (P), Absent (A), Late (AL), Permission
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Present (P)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Absent (A)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Late (AL)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Permission</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="space-y-3">
                  {attendanceData.map((day, index) => {
                    const total = day.present + day.absent + day.late + day.permission
                    const maxValue = getMaxAttendance()
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-900 dark:text-white w-12">{day.day}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">{day.date}</span>
                          <span className="text-gray-600 dark:text-gray-400 w-16 text-right">{total} total</span>
                        </div>
                        <div className="flex h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <div
                            className="bg-green-500 transition-all duration-300"
                            style={{ width: `${(day.present / maxValue) * 100}%` }}
                            title={`Present: ${day.present}`}
                          ></div>
                          <div
                            className="bg-red-500 transition-all duration-300"
                            style={{ width: `${(day.absent / maxValue) * 100}%` }}
                            title={`Absent: ${day.absent}`}
                          ></div>
                          <div
                            className="bg-yellow-500 transition-all duration-300"
                            style={{ width: `${(day.late / maxValue) * 100}%` }}
                            title={`Late: ${day.late}`}
                          ></div>
                          <div
                            className="bg-blue-500 transition-all duration-300"
                            style={{ width: `${(day.permission / maxValue) * 100}%` }}
                            title={`Permission: ${day.permission}`}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>P: {day.present}</span>
                          <span>A: {day.absent}</span>
                          <span>AL: {day.late}</span>
                          <span>Perm: {day.permission}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Clock className="w-5 h-5" />
                Recent Activities
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Latest updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <activity.icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Class Performance Overview */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Award className="w-5 h-5" />
              Class Performance Overview
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Attendance rates and trends for each class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classPerformance.map((classData, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{classData.class}</h3>
                    {classData.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Students:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{classData.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Attendance:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{classData.attendance}%</span>
                    </div>
                    <Progress value={classData.attendance} className="mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </RoleGuard>
    </>
  )
}
