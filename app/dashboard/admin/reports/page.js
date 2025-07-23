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
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Calendar,
  User,
  GraduationCap,
  Clock,
  CheckCircle,
  Archive,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Star,
  Activity,
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

export default function ReportsArchivePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)

  // Sample data
  const reports = [
    {
      id: 1,
      title: "January 2025 Progress Report - Biology A",
      teacher: "Ms. Sarah Johnson",
      class: "Biology A - Grade 10",
      month: "January 2025",
      status: "approved",
      type: "Monthly",
      submittedDate: "2025-01-31",
      approvedDate: "2025-02-02",
      students: 28,
      avgGrade: "B+",
      attendance: 94.5,
      description: "Comprehensive monthly assessment covering cellular biology and genetics units.",
    },
    {
      id: 2,
      title: "Q4 Performance Analysis - Mathematics",
      teacher: "Mr. David Chen",
      class: "Mathematics - Grade 9",
      month: "December 2024",
      status: "pending",
      type: "Quarterly",
      submittedDate: "2024-12-28",
      approvedDate: null,
      students: 32,
      avgGrade: "A-",
      attendance: 91.2,
      description: "Fourth quarter analysis including algebra and geometry performance metrics.",
    },
    {
      id: 3,
      title: "Mid-Term Assessment Summary - English",
      teacher: "Ms. Emily Rodriguez",
      class: "English - Grade 11",
      month: "November 2024",
      status: "approved",
      type: "Assessment",
      submittedDate: "2024-11-15",
      approvedDate: "2024-11-18",
      students: 25,
      avgGrade: "B",
      attendance: 88.7,
      description: "Mid-term literature and composition assessment results and analysis.",
    },
    {
      id: 4,
      title: "Physics Lab Report - Grade 12",
      teacher: "Dr. Michael Thompson",
      class: "Physics - Grade 12",
      month: "October 2024",
      status: "rejected",
      type: "Lab Report",
      submittedDate: "2024-10-20",
      approvedDate: null,
      students: 22,
      avgGrade: "B-",
      attendance: 85.3,
      description: "Laboratory experiment results and student performance analysis.",
    },
    {
      id: 5,
      title: "Chemistry Practical Assessment",
      teacher: "Ms. Lisa Wang",
      class: "Chemistry - Grade 11",
      month: "September 2024",
      status: "approved",
      type: "Practical",
      submittedDate: "2024-09-25",
      approvedDate: "2024-09-27",
      students: 26,
      avgGrade: "A",
      attendance: 96.8,
      description: "Practical chemistry assessment covering organic compounds and reactions.",
    },
    {
      id: 6,
      title: "History Research Project Results",
      teacher: "Mr. James Wilson",
      class: "History - Grade 10",
      month: "August 2024",
      status: "draft",
      type: "Project",
      submittedDate: null,
      approvedDate: null,
      students: 30,
      avgGrade: "B+",
      attendance: 92.1,
      description: "Student research project results on World War II historical analysis.",
    },
    {
      id: 7,
      title: "Art Portfolio Evaluation",
      teacher: "Ms. Anna Martinez",
      class: "Art - Grade 12",
      month: "July 2024",
      status: "approved",
      type: "Portfolio",
      submittedDate: "2024-07-15",
      approvedDate: "2024-07-17",
      students: 18,
      avgGrade: "A-",
      attendance: 89.4,
      description: "Final portfolio evaluation and creative arts assessment summary.",
    },
    {
      id: 8,
      title: "Physical Education Assessment",
      teacher: "Mr. Robert Davis",
      class: "PE - Grade 9",
      month: "June 2024",
      status: "approved",
      type: "Assessment",
      submittedDate: "2024-06-30",
      approvedDate: "2024-07-02",
      students: 35,
      avgGrade: "A",
      attendance: 97.2,
      description: "Physical fitness assessment and sports performance evaluation.",
    },
  ]

  const teachers = [
    "Ms. Sarah Johnson",
    "Mr. David Chen",
    "Ms. Emily Rodriguez",
    "Dr. Michael Thompson",
    "Ms. Lisa Wang",
    "Mr. James Wilson",
    "Ms. Anna Martinez",
    "Mr. Robert Davis",
  ]

  const classes = [
    "Biology A - Grade 10",
    "Mathematics - Grade 9",
    "English - Grade 11",
    "Physics - Grade 12",
    "Chemistry - Grade 11",
    "History - Grade 10",
    "Art - Grade 12",
    "PE - Grade 9",
  ]

  const months = [
    "January 2025",
    "December 2024",
    "November 2024",
    "October 2024",
    "September 2024",
    "August 2024",
    "July 2024",
    "June 2024",
  ]

  // Chart data
  const monthlyReportsData = [
    { month: "Jun", reports: 8, approved: 7, pending: 1, rejected: 0 },
    { month: "Jul", reports: 12, approved: 10, pending: 1, rejected: 1 },
    { month: "Aug", reports: 15, approved: 12, pending: 2, rejected: 1 },
    { month: "Sep", reports: 18, approved: 15, pending: 2, rejected: 1 },
    { month: "Oct", reports: 22, approved: 18, pending: 3, rejected: 1 },
    { month: "Nov", reports: 25, approved: 21, pending: 3, rejected: 1 },
    { month: "Dec", reports: 28, approved: 24, pending: 3, rejected: 1 },
    { month: "Jan", reports: 32, approved: 27, pending: 4, rejected: 1 },
  ]

  const reportTypeData = [
    { name: "Monthly", value: 35, color: "#8B5CF6" },
    { name: "Quarterly", value: 25, color: "#10B981" },
    { name: "Assessment", value: 20, color: "#F59E0B" },
    { name: "Lab Report", value: 12, color: "#EF4444" },
    { name: "Project", value: 8, color: "#06B6D4" },
  ]

  const teacherPerformanceData = [
    { teacher: "S. Johnson", reports: 12, onTime: 11, avgGrade: 85 },
    { teacher: "D. Chen", reports: 10, onTime: 9, avgGrade: 88 },
    { teacher: "E. Rodriguez", reports: 8, onTime: 8, avgGrade: 82 },
    { teacher: "M. Thompson", reports: 9, onTime: 7, avgGrade: 79 },
    { teacher: "L. Wang", reports: 11, onTime: 10, avgGrade: 91 },
    { teacher: "J. Wilson", reports: 7, onTime: 6, avgGrade: 84 },
  ]

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.class.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesClass = !selectedClass || report.class === selectedClass
    const matchesTeacher = !selectedTeacher || report.teacher === selectedTeacher
    const matchesMonth = !selectedMonth || report.month === selectedMonth
    const matchesStatus = !selectedStatus || report.status === selectedStatus
    const matchesType = !selectedType || report.type === selectedType

    return matchesSearch && matchesClass && matchesTeacher && matchesMonth && matchesStatus && matchesType
  })

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  // Statistics
  const stats = {
    totalReports: reports.length,
    approved: reports.filter((r) => r.status === "approved").length,
    pending: reports.filter((r) => r.status === "pending").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
    draft: reports.filter((r) => r.status === "draft").length,
    avgStudentsPerReport: Math.round(reports.reduce((sum, r) => sum + r.students, 0) / reports.length),
    avgAttendance: Math.round((reports.reduce((sum, r) => sum + r.attendance, 0) / reports.length) * 10) / 10,
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        label: "Approved",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
      },
      pending: {
        label: "Pending",
        className:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      },
      draft: {
        label: "Draft",
        className:
          "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800",
      },
    }

    const config = statusConfig[status] || statusConfig.draft
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getTypeColor = (type) => {
    const colors = {
      Monthly:
        "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
      Quarterly:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
      Assessment:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
      "Lab Report": "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      Project: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800",
      Practical: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
      Portfolio:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    }
    return (
      colors[type] ||
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800"
    )
  }

  const handleApprove = (reportId) => {
    console.log("Approving report:", reportId)
  }

  const handleReject = (reportId) => {
    console.log("Rejecting report:", reportId)
  }

  const handleDelete = (reportId) => {
    console.log("Deleting report:", reportId)
  }

  const handleExportPDF = (reportId) => {
    console.log("Exporting PDF for report:", reportId)
  }

  const handleBulkExport = () => {
    console.log("Bulk exporting reports")
  }

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden lg:block">
                <BreadcrumbLink
                  href="/admin-dashboard"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Admin Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden lg:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 dark:text-slate-100">Reports Archive</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-3 sm:px-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6 bg-slate-50 dark:bg-slate-900">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Reports Archive</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Access, manage, and approve all teacher reports with comprehensive analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive Reports
            </Button>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Total Reports</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{stats.totalReports}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">All time</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Approved</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-emerald-600">{stats.approved}</div>
              <div className="text-xs text-emerald-600">
                {Math.round((stats.approved / stats.totalReports) * 100)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Pending</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-xs text-amber-600">Review needed</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Rejected</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-xs text-red-600">Needs revision</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Draft</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-600 dark:text-slate-400">{stats.draft}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">In progress</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-violet-600" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Avg Students</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-violet-600">{stats.avgStudentsPerReport}</div>
              <div className="text-xs text-violet-600">Per report</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Avg Attendance</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-emerald-600">{stats.avgAttendance}%</div>
              <div className="text-xs text-emerald-600">Across reports</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-slate-700 dark:text-slate-300">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="All classes" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      All classes
                    </SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Teacher</Label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="All teachers" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      All teachers
                    </SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem
                        key={teacher}
                        value={teacher}
                        className="hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="All months" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      All months
                    </SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month} value={month} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      All statuses
                    </SelectItem>
                    <SelectItem value="approved" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Approved
                    </SelectItem>
                    <SelectItem value="pending" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Pending
                    </SelectItem>
                    <SelectItem value="rejected" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Rejected
                    </SelectItem>
                    <SelectItem value="draft" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Draft
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      All types
                    </SelectItem>
                    <SelectItem value="Monthly" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Monthly
                    </SelectItem>
                    <SelectItem value="Quarterly" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Quarterly
                    </SelectItem>
                    <SelectItem value="Assessment" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Assessment
                    </SelectItem>
                    <SelectItem value="Lab Report" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Lab Report
                    </SelectItem>
                    <SelectItem value="Project" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      Project
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Monthly Reports Trend */}
          <Card className="lg:col-span-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <TrendingUp className="w-5 h-5" />
                Monthly Reports Trend
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Report submissions and approval status over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyReportsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        color: "#1e293b",
                      }}
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                    <Area
                      type="monotone"
                      dataKey="approved"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="rejected"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Report Types Distribution */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <PieChart className="w-5 h-5" />
                Report Types
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Distribution by report type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        color: "#1e293b",
                      }}
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                    <RechartsPieChart data={reportTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {reportTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-4">
                {reportTypeData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{entry.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{entry.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teacher Performance Chart */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <BarChart3 className="w-5 h-5" />
              Teacher Performance Overview
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Report submission rates and average grades by teacher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teacherPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="teacher" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      color: "#1e293b",
                    }}
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  <Bar dataKey="reports" fill="#8b5cf6" name="Total Reports" />
                  <Bar dataKey="onTime" fill="#10b981" name="On Time" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Archive className="w-5 h-5" />
                  Reports ({filteredReports.length})
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Manage and review all teacher reports
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                        {getStatusBadge(report.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{report.teacher}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        <span>{report.class}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{report.month}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{report.students} students</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        <span className="text-slate-600 dark:text-slate-400">Avg Grade: {report.avgGrade}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        <span className="text-slate-600 dark:text-slate-400">Attendance: {report.attendance}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Submitted: {new Date(report.submittedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(report.id)}
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {report.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(report.id)}
                          className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(report.id)}
                          className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                      className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of{" "}
                {filteredReports.length} reports
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
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
