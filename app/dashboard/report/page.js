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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import {
  FileText,
  TrendingUp,
  PieChart,
  BarChart3,
  Users,
  Calendar,
  Award,
  Clock,
  Download,
  Save,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Star,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState("")
  const [reportTitle, setReportTitle] = useState("")
  const [reportContent, setReportContent] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data
  const classes = [
    { id: "bio-10-1", name: "Biology A - Grade 10", students: 28 },
    { id: "math-9-2", name: "Mathematics - Grade 9", students: 32 },
    { id: "eng-11-1", name: "English - Grade 11", students: 25 },
    { id: "phy-12-1", name: "Physics - Grade 12", students: 22 },
  ]

  const students = [
    { id: 1, name: "Alice Smith", grade: "A+", attendance: 98.5 },
    { id: 2, name: "Bob Johnson", grade: "B+", attendance: 92.3 },
    { id: 3, name: "Charlie Brown", grade: "A-", attendance: 89.7 },
    { id: 4, name: "Diana Prince", grade: "A", attendance: 95.2 },
  ]

  // Chart data
  const attendanceData = [
    { date: "Week 1", present: 26, absent: 2, late: 1 },
    { date: "Week 2", present: 28, absent: 0, late: 2 },
    { date: "Week 3", present: 24, absent: 4, late: 1 },
    { date: "Week 4", present: 27, absent: 1, late: 0 },
    { date: "Week 5", present: 25, absent: 3, late: 2 },
  ]

  const subjectPerformanceData = [
    { subject: "Biology", average: 87.5, submissions: 95 },
    { subject: "Chemistry", average: 82.3, submissions: 88 },
    { subject: "Physics", average: 79.8, submissions: 92 },
    { subject: "Mathematics", average: 85.2, submissions: 97 },
  ]

  const pieChartData = [
    { name: "Present", value: 85, color: "#10B981" },
    { name: "Absent", value: 10, color: "#EF4444" },
    { name: "Late", value: 5, color: "#F59E0B" },
  ]

  const studentProgressData = [
    { date: "Jan 1", attendance: 100, quiz: 85, homework: 90 },
    { date: "Jan 8", attendance: 100, quiz: 92, homework: 88 },
    { date: "Jan 15", attendance: 0, quiz: 0, homework: 85 },
    { date: "Jan 22", attendance: 100, quiz: 88, homework: 92 },
    { date: "Jan 29", attendance: 100, quiz: 95, homework: 94 },
  ]

  const pastReports = [
    {
      id: 1,
      title: "January 2025 Attendance Summary",
      class: "Biology A - Grade 10",
      date: "2025-01-31",
      type: "Monthly",
      status: "completed",
    },
    {
      id: 2,
      title: "Q4 Performance Report",
      class: "Biology A - Grade 10",
      date: "2024-12-15",
      type: "Quarterly",
      status: "completed",
    },
    {
      id: 3,
      title: "Parent-Teacher Conference Report",
      class: "Mathematics - Grade 9",
      date: "2024-11-20",
      type: "Conference",
      status: "draft",
    },
    {
      id: 4,
      title: "Mid-Term Assessment Summary",
      class: "English - Grade 11",
      date: "2024-10-30",
      type: "Assessment",
      status: "completed",
    },
  ]

  const statistics = {
    averageAttendance: 92.3,
    topStudent: "Alice Smith",
    topStudentGrade: "A+",
    mostMissedDay: "Monday",
    totalClasses: 4,
    totalStudents: 107,
    improvementRate: "+5.2%",
    onTimeSubmissions: 94.5,
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Draft</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">{status}</Badge>
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      Monthly: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      Quarterly: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      Conference: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      Assessment: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    }
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  const filteredReports = pastReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.class.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 dark:text-gray-100">Teacher Reports</BreadcrumbPage>
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
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Teacher Reports</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create comprehensive reports for parent-teacher conferences and academic reviews
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Avg Attendance</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-green-600">{statistics.averageAttendance}%</div>
                <div className="text-xs text-green-600">{statistics.improvementRate}</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Top Student</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                  {statistics.topStudent}
                </div>
                <div className="text-xs text-yellow-600">{statistics.topStudentGrade}</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Most Missed</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-red-600">{statistics.mostMissedDay}</div>
                <div className="text-xs text-red-600">Day of week</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Total Students</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-blue-600">{statistics.totalStudents}</div>
                <div className="text-xs text-blue-600">{statistics.totalClasses} classes</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">On-time Submissions</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-green-600">{statistics.onTimeSubmissions}%</div>
                <div className="text-xs text-green-600">This month</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Class Average</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-purple-600">B+</div>
                <div className="text-xs text-purple-600">83.7%</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Reports Created</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-indigo-600">12</div>
                <div className="text-xs text-indigo-600">This semester</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Achievements</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-orange-600">8</div>
                <div className="text-xs text-orange-600">Student awards</div>
              </CardContent>
            </Card>
          </div>

          {/* Report Creation Form */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <FileText className="w-5 h-5" />
                Create New Report
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Generate comprehensive reports for parent-teacher conferences and academic reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-gray-700 dark:text-gray-300">
                    Select Class
                  </Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Choose a class" />
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
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                    Report Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., January 2025 Progress Report"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">
                  Report Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Enter your report content here. Include observations, recommendations, and key highlights..."
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="min-h-32 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Report
                </Button>
                <Button variant="outline" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Attendance Line Chart */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <TrendingUp className="w-5 h-5" />
                  Attendance Over Time
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Weekly attendance trends for the selected class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceData}>
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
                      <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance Bar Chart */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <BarChart3 className="w-5 h-5" />
                  Subject Performance
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Average scores and submission rates by subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="subject" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Bar dataKey="average" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Pie Chart */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <PieChart className="w-5 h-5" />
                  Monthly Attendance Breakdown
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Current month attendance distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <RechartsPieChart data={pieChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {pieChartData.map((entry, index) => (
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

            {/* Student Progress Tracker */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Target className="w-5 h-5" />
                      Student Progress Tracker
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Individual student performance over time
                    </CardDescription>
                  </div>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {students.map((student) => (
                        <SelectItem
                          key={student.id}
                          value={student.id.toString()}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studentProgressData}>
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
                      <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance" />
                      <Line type="monotone" dataKey="quiz" stroke="#3B82F6" strokeWidth={2} name="Quiz Scores" />
                      <Line type="monotone" dataKey="homework" stroke="#8B5CF6" strokeWidth={2} name="Homework" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Past Reports */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Clock className="w-5 h-5" />
                    Past Reports ({filteredReports.length})
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    View and manage previously created reports
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search reports..."
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
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          {report.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <span>{report.class}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredReports.length} of {pastReports.length} reports
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
