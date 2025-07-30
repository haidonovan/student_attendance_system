"use client"



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
import {
  Search,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Users,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeacherManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [reportFilter, setReportFilter] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [assignTeacher, setAssignTeacher] = useState(null)

  // Sample teacher data
  const [teachers, setTeachers] = useState([
    {
      id: "T001",
      name: "Ms. Sarah Johnson",
      email: "sarah.johnson@school.edu",
      phone: "+1 (555) 123-4567",
      department: "Mathematics",
      subjects: ["Algebra", "Calculus", "Statistics"],
      classes: ["Math A", "Math B", "Advanced Math"],
      experience: "8 years",
      qualification: "M.Sc Mathematics",
      status: "Active",
      reportStatus: "submitted",
      lastReportDate: "2024-01-15",
      totalStudents: 89,
      averageGrade: "A-",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    },
    {
      id: "T002",
      name: "Mr. David Chen",
      email: "david.chen@school.edu",
      phone: "+1 (555) 234-5678",
      department: "Science",
      subjects: ["Biology", "Chemistry"],
      classes: ["Bio A", "Bio B", "Chemistry"],
      experience: "12 years",
      qualification: "Ph.D Biology",
      status: "Active",
      reportStatus: "waiting",
      lastReportDate: "2024-01-10",
      totalStudents: 76,
      averageGrade: "B+",
      avatar: "/placeholder.svg?height=40&width=40&text=DC",
    },
    {
      id: "T003",
      name: "Ms. Emily Rodriguez",
      email: "emily.rodriguez@school.edu",
      phone: "+1 (555) 345-6789",
      department: "English",
      subjects: ["Literature", "Creative Writing"],
      classes: ["English A", "Literature"],
      experience: "6 years",
      qualification: "M.A English Literature",
      status: "Active",
      reportStatus: "overdue",
      lastReportDate: "2024-01-05",
      totalStudents: 65,
      averageGrade: "A",
      avatar: "/placeholder.svg?height=40&width=40&text=ER",
    },
    {
      id: "T004",
      name: "Mr. James Wilson",
      email: "james.wilson@school.edu",
      phone: "+1 (555) 456-7890",
      department: "History",
      subjects: ["World History", "Geography"],
      classes: ["History A", "Geography"],
      experience: "15 years",
      qualification: "M.A History",
      status: "Active",
      reportStatus: "submitted",
      lastReportDate: "2024-01-14",
      totalStudents: 72,
      averageGrade: "B+",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
    },
    {
      id: "T005",
      name: "Ms. Lisa Park",
      email: "lisa.park@school.edu",
      phone: "+1 (555) 567-8901",
      department: "Art",
      subjects: ["Fine Arts", "Digital Design"],
      classes: ["Art A", "Design"],
      experience: "4 years",
      qualification: "B.F.A Visual Arts",
      status: "On Leave",
      reportStatus: "waiting",
      lastReportDate: "2024-01-08",
      totalStudents: 45,
      averageGrade: "A-",
      avatar: "/placeholder.svg?height=40&width=40&text=LP",
    },
    {
      id: "T006",
      name: "Mr. Ahmed Hassan",
      email: "ahmed.hassan@school.edu",
      phone: "+1 (555) 678-9012",
      department: "Physical Education",
      subjects: ["PE", "Health Education"],
      classes: ["PE A", "PE B", "Health"],
      experience: "10 years",
      qualification: "B.Sc Sports Science",
      status: "Active",
      reportStatus: "submitted",
      lastReportDate: "2024-01-16",
      totalStudents: 120,
      averageGrade: "B",
      avatar: "/placeholder.svg?height=40&width=40&text=AH",
    },
  ])

  // Available classes for assignment
  const availableClasses = [
    "Math A",
    "Math B",
    "Advanced Math",
    "Bio A",
    "Bio B",
    "Chemistry",
    "Physics",
    "English A",
    "English B",
    "Literature",
    "History A",
    "Geography",
    "Art A",
    "Design",
    "PE A",
    "PE B",
    "Health",
  ]

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || teacher.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesDepartment =
      departmentFilter === "all" || teacher.department.toLowerCase() === departmentFilter.toLowerCase()
    const matchesReport = reportFilter === "all" || teacher.reportStatus === reportFilter

    return matchesSearch && matchesStatus && matchesDepartment && matchesReport
  })

  // Calculate statistics
  const stats = {
    total: teachers.length,
    active: teachers.filter((t) => t.status === "Active").length,
    onLeave: teachers.filter((t) => t.status === "On Leave").length,
    submitted: teachers.filter((t) => t.reportStatus === "submitted").length,
    waiting: teachers.filter((t) => t.reportStatus === "waiting").length,
    overdue: teachers.filter((t) => t.reportStatus === "overdue").length,
  }

  const getReportStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "waiting":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getReportStatusBadge = (status) => {
    const variants = {
      submitted: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      waiting: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    }

    const labels = {
      submitted: "✅ Submitted",
      waiting: "⏳ Waiting",
      overdue: "❌ Overdue",
    }

    return <Badge className={variants[status]}>{labels[status]}</Badge>
  }

  const handleAssignClass = (teacherId, newClasses) => {
    setTeachers((prev) =>
      prev.map((teacher) => (teacher.id === teacherId ? { ...teacher, classes: newClasses } : teacher)),
    )
    setIsAssignModalOpen(false)
    setAssignTeacher(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6">
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

      {/* nav bar horizontal nav */}




      {/* ================================== */}
      <div className="mb-8">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 dark:from-purple-400 dark:via-violet-400 dark:to-purple-600 bg-clip-text text-transparent">
                Teacher Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Manage teachers, assignments, and track report submissions
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Teachers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">On Leave</p>
                <p className="text-2xl font-bold">{stats.onLeave}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Reports Submitted</p>
                <p className="text-2xl font-bold">{stats.submitted}</p>
              </div>
              <FileText className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Waiting</p>
                <p className="text-2xl font-bold">{stats.waiting}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on leave">On Leave</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="physical education">Physical Education</SelectItem>
                </SelectContent>
              </Select>

              <Select value={reportFilter} onValueChange={setReportFilter}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Reports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Teacher</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Department</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Classes</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Students</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Report Status</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher, index) => (
                  <tr
                    key={teacher.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white font-semibold">
                            {teacher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{teacher.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.id}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{teacher.department}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.experience}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.classes.slice(0, 2).map((cls, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cls}
                          </Badge>
                        ))}
                        {teacher.classes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.classes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-slate-100">{teacher.totalStudents}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getReportStatusIcon(teacher.reportStatus)}
                        {getReportStatusBadge(teacher.reportStatus)}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last: {teacher.lastReportDate}</p>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          teacher.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTeacher(teacher)}
                          className="hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAssignTeacher(teacher)
                            setIsAssignModalOpen(true)
                          }}
                          className="hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20"
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Teacher
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              Call Teacher
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Teacher
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Teacher Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedTeacher.avatar || "/placeholder.svg"} alt={selectedTeacher.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-2xl font-bold">
                    {selectedTeacher.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedTeacher.name}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400">{selectedTeacher.department}</p>
                  <p className="text-slate-500 dark:text-slate-400">{selectedTeacher.qualification}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge
                      className={
                        selectedTeacher.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                      }
                    >
                      {selectedTeacher.status}
                    </Badge>
                    {getReportStatusBadge(selectedTeacher.reportStatus)}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Total Students</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {selectedTeacher.totalStudents}
                            </p>
                          </div>
                          <Users className="h-8 w-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Average Grade</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {selectedTeacher.averageGrade}
                            </p>
                          </div>
                          <Award className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Experience</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {selectedTeacher.experience}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.subjects.map((subject, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="classes" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Assigned Classes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTeacher.classes.map((cls, idx) => (
                        <Card key={idx}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{cls}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {Math.floor(Math.random() * 30) + 15} students
                                </p>
                              </div>
                              <BookOpen className="h-6 w-6 text-purple-500" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Report History</h4>
                    <div className="space-y-3">
                      {[
                        { date: "2024-01-15", status: "submitted", type: "Monthly Report" },
                        { date: "2024-01-10", status: "submitted", type: "Grade Report" },
                        { date: "2024-01-05", status: "submitted", type: "Attendance Report" },
                        { date: "2023-12-20", status: "submitted", type: "Monthly Report" },
                      ].map((report, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {getReportStatusIcon(report.status)}
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">{report.type}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{report.date}</p>
                            </div>
                          </div>
                          {getReportStatusBadge(report.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">{selectedTeacher.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">{selectedTeacher.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Teacher
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Teacher Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Add New Teacher
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter teacher's full name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="teacher@school.edu" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="physical-education">Physical Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Input id="qualification" placeholder="e.g., M.Sc Mathematics" />
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input id="experience" placeholder="e.g., 5 years" />
              </div>
            </div>
            <div>
              <Label htmlFor="subjects">Subjects (comma-separated)</Label>
              <Input id="subjects" placeholder="e.g., Algebra, Calculus, Statistics" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                Add Teacher
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Classes Modal */}
      {assignTeacher && (
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Assign Classes to {assignTeacher.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Classes</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {assignTeacher.classes.map((cls, idx) => (
                    <Badge
                      key={idx}
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                    >
                      {cls}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Available Classes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {availableClasses.map((cls, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`class-${idx}`}
                        defaultChecked={assignTeacher.classes.includes(cls)}
                        className="rounded border-slate-300"
                      />
                      <label htmlFor={`class-${idx}`} className="text-sm text-slate-700 dark:text-slate-300">
                        {cls}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => handleAssignClass(assignTeacher.id, assignTeacher.classes)}
                >
                  Update Assignment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
