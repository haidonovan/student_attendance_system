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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  CalendarDays,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Eye,
  Clock,
  UserCheck,
  UserX,
  CalendarIcon,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react"
import { format } from "date-fns"

export default function AttendanceOversight() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterClass, setFilterClass] = useState("all")
  const [filterTeacher, setFilterTeacher] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for attendance
  const attendanceData = [
    { date: "2024-01-15", present: 85, absent: 15, total: 100 },
    { date: "2024-01-16", present: 92, absent: 8, total: 100 },
    { date: "2024-01-17", present: 78, absent: 22, total: 100 },
    { date: "2024-01-18", present: 88, absent: 12, total: 100 },
    { date: "2024-01-19", present: 95, absent: 5, total: 100 },
    { date: "2024-01-22", present: 82, absent: 18, total: 100 },
    { date: "2024-01-23", present: 90, absent: 10, total: 100 },
  ]

  const classAttendanceData = [
    { class: "Math A", present: 28, absent: 2, rate: 93.3 },
    { class: "Bio B", present: 22, absent: 8, rate: 73.3 },
    { class: "English C", present: 25, absent: 5, rate: 83.3 },
    { class: "Physics D", present: 18, absent: 12, rate: 60.0 },
    { class: "Chemistry E", present: 27, absent: 3, rate: 90.0 },
  ]

  const heatmapData = [
    { day: "Mon", hour: "8:00", value: 95, class: "Math A" },
    { day: "Mon", hour: "9:00", value: 88, class: "Bio B" },
    { day: "Mon", hour: "10:00", value: 92, class: "English C" },
    { day: "Mon", hour: "11:00", value: 85, class: "Physics D" },
    { day: "Tue", hour: "8:00", value: 90, class: "Chemistry E" },
    { day: "Tue", hour: "9:00", value: 75, class: "Math A" },
    { day: "Tue", hour: "10:00", value: 88, class: "Bio B" },
    { day: "Tue", hour: "11:00", value: 92, class: "English C" },
    { day: "Wed", hour: "8:00", value: 85, class: "Physics D" },
    { day: "Wed", hour: "9:00", value: 95, class: "Chemistry E" },
    { day: "Wed", hour: "10:00", value: 82, class: "Math A" },
    { day: "Wed", hour: "11:00", value: 78, class: "Bio B" },
    { day: "Thu", hour: "8:00", value: 88, class: "English C" },
    { day: "Thu", hour: "9:00", value: 92, class: "Physics D" },
    { day: "Thu", hour: "10:00", value: 85, class: "Chemistry E" },
    { day: "Thu", hour: "11:00", value: 90, class: "Math A" },
    { day: "Fri", hour: "8:00", value: 80, class: "Bio B" },
    { day: "Fri", hour: "9:00", value: 88, class: "English C" },
    { day: "Fri", hour: "10:00", value: 92, class: "Physics D" },
    { day: "Fri", hour: "11:00", value: 85, class: "Chemistry E" },
  ]

  const anomalies = [
    {
      id: 1,
      type: "High Absences",
      description: "15 absences from Physics D in 3 days",
      severity: "high",
      date: "2024-01-17",
      class: "Physics D",
      count: 15,
    },
    {
      id: 2,
      type: "Sudden Drop",
      description: "Bio B attendance dropped 20% this week",
      severity: "medium",
      date: "2024-01-16",
      class: "Bio B",
      count: 8,
    },
    {
      id: 3,
      type: "Pattern Alert",
      description: "Consistent Monday absences in Math A",
      severity: "low",
      date: "2024-01-15",
      class: "Math A",
      count: 5,
    },
  ]

  const trendData = [
    { month: "Sep", attendance: 88 },
    { month: "Oct", attendance: 85 },
    { month: "Nov", attendance: 90 },
    { month: "Dec", attendance: 82 },
    { month: "Jan", attendance: 87 },
  ]

  const pieData = [
    { name: "Present", value: 87, color: "#10b981" },
    { name: "Absent", value: 13, color: "#f59e0b" },
  ]

  const getHeatmapColor = (value) => {
    if (value >= 90) return "bg-gradient-to-br from-green-400 to-emerald-500"
    if (value >= 80) return "bg-gradient-to-br from-yellow-400 to-orange-500"
    if (value >= 70) return "bg-gradient-to-br from-orange-400 to-red-500"
    return "bg-gradient-to-br from-red-500 to-pink-600"
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-600"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500"
      case "low":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Present,Absent,Total,Rate\n" +
      attendanceData
        .map(
          (row) =>
            `${row.date},${row.present},${row.absent},${row.total},${((row.present / row.total) * 100).toFixed(1)}%`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "attendance_summary.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6 lg:p-8">
      {/* Header */}

      
{/* Nav Bar and Icon */}
        <div className="flex items-center gap-2 px-3 sm:px-4 m-3 mt-0">
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
        <hr></hr>

        {/* nav bar horizontal nav */}

      
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Attendance Oversight
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Monitor global attendance patterns and detect anomalies
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={exportData}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">87.3%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">+2.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Present</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">1,089</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">+45</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Absent</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">158</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600 dark:text-red-400">-12</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Anomalies</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">2 High</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search classes, teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Class</label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="math-a">Math A</SelectItem>
                  <SelectItem value="bio-b">Bio B</SelectItem>
                  <SelectItem value="english-c">English C</SelectItem>
                  <SelectItem value="physics-d">Physics D</SelectItem>
                  <SelectItem value="chemistry-e">Chemistry E</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Teacher</label>
              <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  <SelectItem value="ms-johnson">Ms. Johnson</SelectItem>
                  <SelectItem value="mr-smith">Mr. Smith</SelectItem>
                  <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                  <SelectItem value="ms-davis">Ms. Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="heatmap"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <Activity className="w-4 h-4 mr-2" />
            Heatmap
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger
            value="anomalies"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Anomalies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Attendance Chart */}
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Daily Attendance</CardTitle>
                <CardDescription>Last 7 days attendance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="present" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" fill="url(#orangeGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attendance Distribution */}
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Attendance Distribution</CardTitle>
                <CardDescription>Overall attendance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Present (87%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Absent (13%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class Attendance Table */}
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Class-wise Attendance</CardTitle>
              <CardDescription>Attendance rates by class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Class</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Present</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Absent</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classAttendanceData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{item.class}</td>
                        <td className="py-3 px-4 text-green-600 dark:text-green-400">{item.present}</td>
                        <td className="py-3 px-4 text-red-600 dark:text-red-400">{item.absent}</td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{item.rate}%</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`${
                              item.rate >= 90
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : item.rate >= 80
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {item.rate >= 90 ? "Excellent" : item.rate >= 80 ? "Good" : "Needs Attention"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Attendance Heatmap</CardTitle>
              <CardDescription>Visual representation of attendance patterns by day and time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Attendance Rate:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">90%+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">80-89%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">70-79%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-pink-600 rounded"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">&lt;70%</span>
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-6 gap-2">
                      {/* Header */}
                      <div></div>
                      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-slate-700 dark:text-slate-300 py-2"
                        >
                          {day}
                        </div>
                      ))}

                      {/* Time slots */}
                      {["8:00", "9:00", "10:00", "11:00"].map((hour) => (
                        <div key={hour} className="contents">
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 py-3 pr-4 text-right">
                            {hour}
                          </div>
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                            const data = heatmapData.find((d) => d.day === day && d.hour === hour)
                            return (
                              <div
                                key={`${day}-${hour}`}
                                className={`h-16 rounded-lg ${getHeatmapColor(data?.value || 0)} flex items-center justify-center text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                                title={`${day} ${hour}: ${data?.value || 0}% - ${data?.class || "No Class"}`}
                              >
                                <div className="text-center">
                                  <div className="font-bold">{data?.value || 0}%</div>
                                  <div className="text-xs opacity-90 group-hover:opacity-100">
                                    {data?.class || "No Class"}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Monthly Trend</CardTitle>
                <CardDescription>Attendance trend over the last 5 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="url(#purpleGradient)"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: "#7c3aed" }}
                    />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Pattern */}
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Weekly Pattern</CardTitle>
                <CardDescription>Average attendance by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={[
                      { day: "Mon", attendance: 85 },
                      { day: "Tue", attendance: 88 },
                      { day: "Wed", attendance: 92 },
                      { day: "Thu", attendance: 89 },
                      { day: "Fri", attendance: 82 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="#10b981"
                      fill="url(#areaGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Trend Insights */}
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Trend Insights</CardTitle>
              <CardDescription>Key patterns and observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">Improving Trend</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Wednesday shows the highest attendance rate at 92%
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Weekly Pattern</span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Friday attendance drops to 82%, indicating end-of-week fatigue
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800 dark:text-purple-200">Monthly Growth</span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    November showed peak attendance at 90%, indicating seasonal improvement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Detected Anomalies</CardTitle>
              <CardDescription>Unusual attendance patterns requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${getSeverityColor(anomaly.severity)} text-white border-0`}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium text-slate-900 dark:text-white">{anomaly.type}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 mb-2">{anomaly.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {anomaly.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {anomaly.class}
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {anomaly.count} affected
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-300 dark:border-slate-600 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Investigate
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                        >
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">High Severity</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">1</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Medium Severity</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">1</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Low Severity</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">1</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
