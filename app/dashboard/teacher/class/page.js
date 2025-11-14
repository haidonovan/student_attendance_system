"use client"

import { useState, useEffect } from "react"
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
  BookOpen,
  GraduationCap,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Edit,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function TeacherClassPage() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [classDetails, setClassDetails] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/dashboard/teacher/class")
      if (!res.ok) throw new Error("Failed to fetch classes")
      const data = await res.json()
      setClasses(data.classes || [])
      if (data.classes && data.classes.length > 0) {
        setSelectedClass(data.classes[0].id)
        fetchClassDetails(data.classes[0].id)
      }
    } catch (err) {
      console.error("[v0] Error fetching classes:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchClassDetails = async (classId) => {
    try {
      const res = await fetch(`/api/dashboard/teacher/class?classId=${classId}`)
      if (!res.ok) throw new Error("Failed to fetch class details")
      const data = await res.json()
      setClassDetails(data)
      setSelectedClass(classId)
    } catch (err) {
      console.error("[v0] Error fetching class details:", err)
      setError(err.message)
    }
  }

  const handleExportJSON = () => {
    if (!classDetails) return

    const exportData = {
      class: classDetails.class,
      stats: classDetails.stats,
      students: classDetails.students,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${classDetails.class.name}-${new Date().getTime()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your classes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={fetchClasses} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredStudents =
    classDetails?.students?.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const getStatusBadge = (rate) => {
    if (rate >= 90)
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Excellent</Badge>
    if (rate >= 80)
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Good</Badge>
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Low</Badge>
  }

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return "text-green-600 dark:text-green-400"
    if (rate >= 80) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const chartData = [
    { date: "Mon", present: 28, absent: 2 },
    { date: "Tue", present: 27, absent: 3 },
    { date: "Wed", present: 29, absent: 1 },
    { date: "Thu", present: 26, absent: 4 },
    { date: "Fri", present: 28, absent: 2 },
  ]

  return (
    <SidebarProvider>
      
      <SidebarInset>
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
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 dark:text-gray-100">Classes</BreadcrumbPage>
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
          {/* Classes Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {classes.map((cls) => (
              <Button
                key={cls.id}
                onClick={() => fetchClassDetails(cls.id)}
                variant={selectedClass === cls.id ? "default" : "outline"}
                className={`whitespace-nowrap ${selectedClass === cls.id
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
              >
                {cls.name} - {cls.section}
              </Button>
            ))}
          </div>

          {classDetails && (
            <>
              {/* Class Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 lg:gap-6">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                        {classDetails.class.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {classDetails.class.section}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Year {classDetails.class.year}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-2">
                  {/* <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportJSON}
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
                      {classDetails.stats.totalStudents}
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
                      {classDetails.stats.overallAttendancePercentage}%
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
                      {classDetails.stats.todayAttendance.present}
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
                      {classDetails.stats.todayAttendance.absent}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Chart */}
              {/* <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <TrendingUp className="w-5 h-5" />
                    Weekly Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "none",
                            borderRadius: "8px",
                            color: "#F9FAFB",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="present"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: "#10B981", r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="absent"
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ fill: "#EF4444", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card> */}

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
                        Student attendance and performance
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-blue-500 text-white">
                              {student.fullName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                              {student.fullName}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {student.studentId}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="text-center sm:text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                            <p
                              className={`text-sm sm:text-base font-bold ${getAttendanceColor(student.attendancePercentage)}`}
                            >
                              {student.attendancePercentage}%
                            </p>
                          </div>
                          {getStatusBadge(student.attendancePercentage)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
