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
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  BookOpen,
  GraduationCap,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Settings,
  UserPlus,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ClassDetailPage({ params }) {
  const [selectedPeriod, setSelectedPeriod] = useState("3months")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample class data
  const classData = {
    id: "bio-10-1",
    name: "Biology A",
    grade: "10",
    section: "1",
    subject: "Biology",
    teacher: {
      name: "Ms. Pakthet Pom Si oii",
      email: "pakthet.pom@school.edu",
      phone: "+1 (555) 123-4567",
      avatar: "PP",
    },
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "9:00 AM - 10:30 AM",
      room: "Lab Room 204",
    },
    stats: {
      totalStudents: 28,
      averageAttendance: 87.5,
      presentToday: 25,
      absentToday: 3,
      lastUpdated: "2 hours ago",
    },
  }

  // Sample students data
  const students = [
    {
      id: 1,
      studentId: "1001",
      name: "Alice Smith",
      gender: "F",
      email: "alice.smith@student.edu",
      phone: "+1 (555) 234-5678",
      status: "Present",
      attendanceRate: 95.2,
      lastAttendance: "Present",
      avatar: "AS",
      address: "123 Oak Street, City",
    },
    {
      id: 2,
      studentId: "1002",
      name: "Bob Johnson",
      gender: "M",
      email: "bob.johnson@student.edu",
      phone: "+1 (555) 345-6789",
      status: "Present",
      attendanceRate: 88.7,
      lastAttendance: "Present",
      avatar: "BJ",
      address: "456 Pine Avenue, City",
    },
    {
      id: 3,
      studentId: "1003",
      name: "Charlie Brown",
      gender: "M",
      email: "charlie.brown@student.edu",
      phone: "+1 (555) 456-7890",
      status: "Absent",
      attendanceRate: 76.3,
      lastAttendance: "Absent",
      avatar: "CB",
      address: "789 Elm Drive, City",
    },
    {
      id: 4,
      studentId: "1004",
      name: "Diana Prince",
      gender: "F",
      email: "diana.prince@student.edu",
      phone: "+1 (555) 567-8901",
      status: "Present",
      attendanceRate: 92.1,
      lastAttendance: "Present",
      avatar: "DP",
      address: "321 Maple Lane, City",
    },
    {
      id: 5,
      studentId: "1005",
      name: "Edward Wilson",
      gender: "M",
      email: "edward.wilson@student.edu",
      phone: "+1 (555) 678-9012",
      status: "Late",
      attendanceRate: 83.4,
      lastAttendance: "Late",
      avatar: "EW",
      address: "654 Cedar Road, City",
    },
    {
      id: 6,
      studentId: "1006",
      name: "Fiona Davis",
      gender: "F",
      email: "fiona.davis@student.edu",
      phone: "+1 (555) 789-0123",
      status: "Present",
      attendanceRate: 89.6,
      lastAttendance: "Present",
      avatar: "FD",
      address: "987 Birch Street, City",
    },
  ]

  // Sample attendance data for different periods
  const attendanceData = {
    "7days": {
      total: 196,
      present: 168,
      absent: 28,
      trend: "+5.2%",
      trendDirection: "up",
    },
    "30days": {
      total: 840,
      present: 735,
      absent: 105,
      trend: "+2.8%",
      trendDirection: "up",
    },
    "3months": {
      total: 2520,
      present: 2205,
      absent: 315,
      trend: "-1.2%",
      trendDirection: "down",
    },
  }

  const periods = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
  ]

  const currentData = attendanceData[selectedPeriod]

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Present</Badge>
      case "Absent":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Absent</Badge>
      case "Late":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Late</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">{status}</Badge>
    }
  }

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return "text-green-600 dark:text-green-400"
    if (rate >= 80) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getChartData = () => {
    const baseData = {
  "7days": [
    { date: "Jul 16", present: 25, absent: 3 },
    { date: "Jul 17", present: 27, absent: 1 },
    { date: "Jul 18", present: 24, absent: 4 },
    { date: "Jul 19", present: 26, absent: 2 },
    { date: "Jul 20", present: 28, absent: 0 },
    { date: "Jul 21", present: 23, absent: 5 },
    { date: "Jul 22", present: 25, absent: 3 },
  ],
  "30days": [
    { date: "Jun 23", present: 22, absent: 6 },
    { date: "Jun 25", present: 24, absent: 4 },
    { date: "Jun 28", present: 26, absent: 2 },
    { date: "Jul 1", present: 25, absent: 3 },
    { date: "Jul 4", present: 27, absent: 1 },
    { date: "Jul 7", present: 24, absent: 3 },
    { date: "Jul 10", present: 26, absent: 2 },
    { date: "Jul 13", present: 25, absent: 3 },
    { date: "Jul 16", present: 27, absent: 1 },
    { date: "Jul 19", present: 26, absent: 2 },
  ],
  "60days": [
    { date: "May 23", present: 20, absent: 8 },
    { date: "Jun 1", present: 21, absent: 7 },
    { date: "Jun 10", present: 23, absent: 5 },
    { date: "Jun 20", present: 25, absent: 3 },
    { date: "Jun 30", present: 26, absent: 2 },
    { date: "Jul 10", present: 27, absent: 1 },
    { date: "Jul 20", present: 28, absent: 0 },
  ],
  "3months": [
    { date: "May", present: 500, absent: 70 },
    { date: "Jun", present: 540, absent: 55 },
    { date: "Jul", present: 580, absent: 40 },
  ],
  "6months": [
    { date: "Feb", present: 450, absent: 90 },
    { date: "Mar", present: 480, absent: 85 },
    { date: "Apr", present: 510, absent: 70 },
    { date: "May", present: 540, absent: 60 },
    { date: "Jun", present: 580, absent: 40 },
    { date: "Jul", present: 600, absent: 35 },
  ],
  "1year": [
    { date: "Aug", present: 400, absent: 100 },
    { date: "Sep", present: 420, absent: 90 },
    { date: "Oct", present: 460, absent: 80 },
    { date: "Nov", present: 500, absent: 60 },
    { date: "Dec", present: 540, absent: 50 },
    { date: "Jan", present: 580, absent: 40 },
    { date: "Feb", present: 600, absent: 35 },
    { date: "Mar", present: 610, absent: 30 },
    { date: "Apr", present: 620, absent: 28 },
    { date: "May", present: 630, absent: 25 },
    { date: "Jun", present: 640, absent: 20 },
    { date: "Jul", present: 650, absent: 15 },
  ]
};

    return baseData[selectedPeriod] || baseData["7days"]
  }

  return (
<>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-gray-200 dark:border-gray-800">
          
        


          <div className="flex items-center gap-2 px-3 sm:px-4">
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
                    href="/dashboard/classes"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Classes
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 dark:text-gray-100">
                    {classData.name} - Grade {classData.grade}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-3 sm:px-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-950">
          {/* Class Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 lg:gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    {classData.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      Grade {classData.grade}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                      Section {classData.section}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {classData.subject}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Class Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Teacher</p>
                        <p className="font-medium text-gray-900 dark:text-white">{classData.teacher.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Schedule</p>
                        <p className="font-medium text-gray-900 dark:text-white">{classData.schedule.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Room</p>
                        <p className="font-medium text-gray-900 dark:text-white">{classData.schedule.room}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-row lg:flex-col gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Students</span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {classData.stats.totalStudents}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avg Attendance</span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                  {classData.stats.averageAttendance}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Present Today</span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                  {classData.stats.presentToday}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Absent Today</span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
                  {classData.stats.absentToday}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Analytics */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <TrendingUp className="w-5 h-5" />
                    Attendance Analytics
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Total attendance for the selected period
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {periods.map((period) => (
                    <Button
                      key={period.value}
                      variant={selectedPeriod === period.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period.value)}
                      className={`text-xs sm:text-sm ${
                        selectedPeriod === period.value
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentData.total}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentData.trendDirection === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm ${currentData.trendDirection === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {currentData.trend}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <p className="text-sm text-green-600 dark:text-green-400">Present</p>
                      <p className="text-xl font-bold text-green-700 dark:text-green-300">{currentData.present}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {((currentData.present / currentData.total) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <p className="text-sm text-red-600 dark:text-red-400">Absent</p>
                      <p className="text-xl font-bold text-red-700 dark:text-red-300">{currentData.absent}</p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {((currentData.absent / currentData.total) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="h-64 bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getChartData()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "none",
                            borderRadius: "8px",
                            color: "#F9FAFB",
                          }}
                          labelStyle={{ color: "#9CA3AF" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="present"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="absent"
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <GraduationCap className="w-5 h-5" />
                    Students List ({filteredStudents.length})
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Manage and view student information and attendance
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarImage src={`/avatars/${student.avatar}.jpg`} />
                        <AvatarFallback className="bg-blue-500 text-white font-medium">{student.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {student.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
                              ID: {student.studentId}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
                              {student.gender}
                            </Badge>
                            {getStatusBadge(student.status)}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{student.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="text-center sm:text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Attendance Rate</p>
                        <p className={`text-sm sm:text-base font-bold ${getAttendanceColor(student.attendanceRate)}`}>
                          {student.attendanceRate}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredStudents.length} of {students.length} students
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  )
}
