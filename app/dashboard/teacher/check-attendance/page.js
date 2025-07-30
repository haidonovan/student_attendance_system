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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import {
  Users,
  Search,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  Timer,
  GraduationCap,
  Download,
} from "lucide-react"

export default function CheckAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedSession, setSelectedSession] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [attendance, setAttendance] = useState({})

  // Sample data
  const classes = [
    { id: "10a", name: "Class 10A", students: 31 },
    { id: "10b", name: "Class 10B", students: 29 },
    { id: "9a", name: "Class 9A", students: 33 },
    { id: "9b", name: "Class 9B", students: 28 },
  ]

  const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "english", name: "English" },
    { id: "science", name: "Science" },
    { id: "history", name: "History" },
    { id: "physics", name: "Physics" },
  ]

  const sessions = [
    { id: "morning", name: "Morning Session (8:00 AM - 12:00 PM)" },
    { id: "afternoon", name: "Afternoon Session (1:00 PM - 5:00 PM)" },
    { id: "evening", name: "Evening Session (6:00 PM - 9:00 PM)" },
  ]

  const students = [
    {
      id: 1,
      studentId: "STU001",
      name: "Minecraft",
      avatar: "AJ",
      status: "active",
      lastAttendance: "Present",
    },
    {
      id: 2,
      studentId: "STU002",
      name: "Among Us",
      avatar: "BS",
      status: "active",
      lastAttendance: "Late",
    },
    {
      id: 3,
      studentId: "STU003",
      name: "Imposter",
      avatar: "CB",
      status: "suspended",
      lastAttendance: "Absent",
    },
    {
      id: 4,
      studentId: "STU004",
      name: "Yakuza",
      avatar: "DP",
      status: "active",
      lastAttendance: "Present",
    },
    {
      id: 5,
      studentId: "STU005",
      name: "Jack Ma",
      avatar: "EW",
      status: "stopped",
      lastAttendance: "Absent",
    },
    {
      id: 6,
      studentId: "STU006",
      name: "Jonh F kennedy",
      avatar: "FD",
      status: "active",
      lastAttendance: "Permission",
    },
    {
      id: 7,
      studentId: "STU007",
      name: "Steve",
      avatar: "GM",
      status: "active",
      lastAttendance: "Present",
    },
    {
      id: 8,
      studentId: "STU008",
      name: "Sok San Shit Man",
      avatar: "HT",
      status: "medical_leave",
      lastAttendance: "Medical Leave",
    },
  ]

  const attendanceOptions = [
    {
      value: "present",
      label: "Present",
      shortLabel: "✓",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/30",
    },
    {
      value: "permission",
      label: "Permission",
      shortLabel: "P",
      icon: UserCheck,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
    },
    {
      value: "late",
      label: "Late",
      shortLabel: "L",
      icon: Timer,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
      hoverBg: "hover:bg-yellow-50 dark:hover:bg-yellow-900/30",
    },
    {
      value: "absent",
      label: "Absent",
      shortLabel: "A",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/20",
      hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/30",
    },
  ]

  const statusOptions = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
    { value: "suspended", label: "Suspended", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
    {
      value: "stopped",
      label: "Stopped Study",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    },
    {
      value: "medical_leave",
      label: "Medical Leave",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      value: "transfer",
      label: "Transfer",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    },
  ]

  const handleAttendanceChange = (studentId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: value,
    }))
  }

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find((s) => s.value === status)
    return <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>{statusConfig?.label || status}</Badge>
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getAttendanceSummary = () => {
    const total = filteredStudents.length
    const present = Object.values(attendance).filter((a) => a === "present").length
    const absent = Object.values(attendance).filter((a) => a === "absent").length
    const late = Object.values(attendance).filter((a) => a === "late").length
    const permission = Object.values(attendance).filter((a) => a === "permission").length
    const unmarked = total - Object.keys(attendance).length

    return { total, present, absent, late, permission, unmarked }
  }

  const summary = getAttendanceSummary()

  return (



    <>
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
                  href="/dashboard/platform"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Platform
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 dark:text-gray-100">Check Attendance</BreadcrumbPage>
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
        {/* Page Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Check Attendance</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Mark student attendance for class sessions
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Session Selection */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
              <GraduationCap className="w-5 h-5" />
              Session Details
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
              Select class, subject, and session to mark attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class" className="text-gray-700 dark:text-gray-300 text-sm">
                  Class
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        {cls.name} ({cls.students} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300 text-sm">
                  Subject
                </Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 text-sm">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session" className="text-gray-700 dark:text-gray-300 text-sm">
                  Session
                </Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {sessions.map((session) => (
                      <SelectItem
                        key={session.id}
                        value={session.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="hidden lg:inline">{session.name}</span>
                        <span className="lg:hidden">
                          {session.name.split(" ")[0]} {session.name.split(" ")[1]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Present</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-green-600">{summary.present}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Absent</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-red-600">{summary.absent}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Late</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">{summary.late}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Permission</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{summary.permission}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Unmarked</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-400">{summary.unmarked}</div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
                  <Users className="w-5 h-5" />
                  Student Attendance
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Mark attendance for each student in the selected session
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                      {student.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {student.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          ID: {student.studentId}
                        </span>
                        <span className="text-xs text-gray-400 hidden sm:inline">•</span>
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 sm:min-w-0">
                      Last: {student.lastAttendance}
                    </span>

                    {/* Attendance Options */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {attendanceOptions.map((option) => {
                        const Icon = option.icon
                        const isSelected = attendance[student.id] === option.value
                        return (
                          <Button
                            key={option.value}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAttendanceChange(student.id, option.value)}
                            className={`
                                h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-0
                                ${isSelected
                                ? `${option.bg} ${option.color} border-transparent ${option.hoverBg}`
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }
                              `}
                            title={option.label}
                          >
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="ml-1 hidden md:inline">{option.shortLabel}</span>
                            <span className="ml-1 hidden lg:inline">{option.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Object.keys(attendance).length} of {filteredStudents.length} students marked
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
                  size="sm"
                >
                  Save as Draft
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Attendance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
