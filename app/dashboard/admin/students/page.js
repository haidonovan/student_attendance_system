"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  MoreHorizontal,
  UserPlus,
  FileSpreadsheet,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Award,
  Target,
  Activity,
} from "lucide-react"

export default function StudentManagement() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [attendanceFilter, setAttendanceFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isViewStudentOpen, setIsViewStudentOpen] = useState(false)

  // Sample student data
  useEffect(() => {
    const sampleStudents = [
      {
        id: "STU001",
        name: "Lily Tran",
        email: "lily.tran@school.edu",
        phone: "+1 (555) 123-4567",
        class: "Math A",
        grade: "10",
        section: "A",
        attendance: 95,
        status: "Active",
        avatar: "/student1.jpg",
        enrollmentDate: "2024-09-01",
        guardian: "Mrs. Tran",
        guardianPhone: "+1 (555) 123-4568",
        address: "123 Oak Street, City, State",
        gpa: 3.8,
        subjects: ["Mathematics", "Physics", "Chemistry"],
        lastActivity: "2 hours ago",
        totalClasses: 120,
        presentDays: 114,
        absentDays: 6,
        achievements: ["Honor Roll", "Math Competition Winner"],
      },
      {
        id: "STU002",
        name: "Jiro Tanaka",
        email: "jiro.tanaka@school.edu",
        phone: "+1 (555) 234-5678",
        class: "Bio B",
        grade: "11",
        section: "B",
        attendance: 62,
        status: "Flagged",
        avatar: "/student2.jpg",
        enrollmentDate: "2024-09-01",
        guardian: "Mr. Tanaka",
        guardianPhone: "+1 (555) 234-5679",
        address: "456 Pine Avenue, City, State",
        gpa: 2.9,
        subjects: ["Biology", "Chemistry", "English"],
        lastActivity: "1 day ago",
        totalClasses: 115,
        presentDays: 71,
        absentDays: 44,
        achievements: ["Science Fair Participant"],
      },
      {
        id: "STU003",
        name: "Emma Rodriguez",
        email: "emma.rodriguez@school.edu",
        phone: "+1 (555) 345-6789",
        class: "English A",
        grade: "12",
        section: "A",
        attendance: 88,
        status: "Active",
        avatar: "/student3.jpg",
        enrollmentDate: "2024-09-01",
        guardian: "Ms. Rodriguez",
        guardianPhone: "+1 (555) 345-6790",
        address: "789 Maple Drive, City, State",
        gpa: 3.6,
        subjects: ["English Literature", "History", "Art"],
        lastActivity: "30 minutes ago",
        totalClasses: 125,
        presentDays: 110,
        absentDays: 15,
        achievements: ["Debate Team Captain", "Literary Magazine Editor"],
      },
      {
        id: "STU004",
        name: "Marcus Johnson",
        email: "marcus.johnson@school.edu",
        phone: "+1 (555) 456-7890",
        class: "Physics A",
        grade: "11",
        section: "A",
        attendance: 91,
        status: "Active",
        avatar: "/student4.jpg",
        enrollmentDate: "2024-09-01",
        guardian: "Dr. Johnson",
        guardianPhone: "+1 (555) 456-7891",
        address: "321 Elm Street, City, State",
        gpa: 3.9,
        subjects: ["Physics", "Mathematics", "Computer Science"],
        lastActivity: "1 hour ago",
        totalClasses: 118,
        presentDays: 107,
        absentDays: 11,
        achievements: ["Science Olympiad Gold", "Robotics Team Leader"],
      },
      {
        id: "STU005",
        name: "Sophia Chen",
        email: "sophia.chen@school.edu",
        phone: "+1 (555) 567-8901",
        class: "Chemistry B",
        grade: "10",
        section: "B",
        attendance: 97,
        status: "Active",
        avatar: "/student5.jpg",
        enrollmentDate: "2024-09-01",
        guardian: "Prof. Chen",
        guardianPhone: "+1 (555) 567-8902",
        address: "654 Birch Lane, City, State",
        gpa: 4.0,
        subjects: ["Chemistry", "Biology", "Mathematics"],
        lastActivity: "15 minutes ago",
        totalClasses: 122,
        presentDays: 118,
        absentDays: 4,
        achievements: ["Valedictorian Candidate", "Chemistry Award"],
      },
      {
        id: "STU006",
        name: "Alex Thompson",
        email: "alex.thompson@school.edu",
        phone: "+1 (555) 678-9012",
        class: "History A",
        grade: "9",
        section: "A",
        attendance: 45,
        status: "Inactive",
        avatar: "/student6.jpg",
        enrollmentDate: "2024-09-01",
        guardian: "Mrs. Thompson",
        guardianPhone: "+1 (555) 678-9013",
        address: "987 Cedar Court, City, State",
        gpa: 2.1,
        subjects: ["History", "English", "Social Studies"],
        lastActivity: "1 week ago",
        totalClasses: 110,
        presentDays: 50,
        absentDays: 60,
        achievements: [],
      },
      {
        id: "STU007",
        name: "Isabella Garcia",
        email: "isabella.garcia@school.edu",
        phone: "+1 (555) 789-0123",
        class: "Art A",
        grade: "12",
        section: "A",
        attendance: 93,
        status: "Active",
        avatar: "/student7.jpg",
        enrollmentDate: "2024-09-01",
        guardian: "Mr. Garcia",
        guardianPhone: "+1 (555) 789-0124",
        address: "147 Willow Way, City, State",
        gpa: 3.7,
        subjects: ["Art", "Design", "Photography"],
        lastActivity: "3 hours ago",
        totalClasses: 120,
        presentDays: 112,
        absentDays: 8,
        achievements: ["Art Exhibition Winner", "Portfolio Scholarship"],
      },
      {
        id: "STU008",
        name: "Ryan O'Connor",
        email: "ryan.oconnor@school.edu",
        phone: "+1 (555) 890-1234",
        class: "PE A",
        grade: "10",
        section: "A",
        attendance: 78,
        status: "Warning",
        avatar: "/student8.jpg",
        enrollmentDate: "2024-09-01",
        guardian: "Coach O'Connor",
        guardianPhone: "+1 (555) 890-1235",
        address: "258 Spruce Street, City, State",
        gpa: 3.2,
        subjects: ["Physical Education", "Health", "Biology"],
        lastActivity: "5 hours ago",
        totalClasses: 115,
        presentDays: 90,
        absentDays: 25,
        achievements: ["Varsity Basketball", "Track Team"],
      },
    ]
    setStudents(sampleStudents)
  }, [])

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || student.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesAttendance =
        attendanceFilter === "all" ||
        (attendanceFilter === "low" && student.attendance < 70) ||
        (attendanceFilter === "good" && student.attendance >= 70 && student.attendance < 90) ||
        (attendanceFilter === "excellent" && student.attendance >= 90)

      const matchesClass = classFilter === "all" || student.class === classFilter

      return matchesSearch && matchesStatus && matchesAttendance && matchesClass
    })

    // Sort logic
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [students, searchTerm, statusFilter, attendanceFilter, classFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  // Get unique classes for filter
  const uniqueClasses = [...new Set(students.map((student) => student.class))]

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "flagged":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return "text-green-600 dark:text-green-400"
    if (attendance >= 70) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  const getAttendanceIcon = (attendance) => {
    if (attendance >= 90) return <TrendingUp className="w-4 h-4" />
    if (attendance >= 70) return <Clock className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleViewStudent = (student) => {
    setSelectedStudent(student)
    setIsViewStudentOpen(true)
  }

  const handleAddStudent = () => {
    setIsAddStudentOpen(true)
  }

  const handleImportCSV = () => {
    setIsImportOpen(true)
  }

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Name", "Email", "Class", "Grade", "Attendance", "Status"],
      ...filteredStudents.map((student) => [
        student.id,
        student.name,
        student.email,
        student.class,
        student.grade,
        `${student.attendance}%`,
        student.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "Active").length,
    flagged: students.filter((s) => s.status === "Flagged").length,
    lowAttendance: students.filter((s) => s.attendance < 70).length,
    averageAttendance: students.reduce((acc, s) => acc + s.attendance, 0) / students.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              Student Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor all student information and attendance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={exportToCSV} variant="outline" className="bg-white dark:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleImportCSV} variant="outline" className="bg-white dark:bg-gray-800">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button
              onClick={handleAddStudent}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Flagged Students</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.flagged}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Attendance</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.lowAttendance}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Attendance</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {stats.averageAttendance.toFixed(1)}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, class, or student ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Attendance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Attendance</SelectItem>
                    <SelectItem value="excellent">Excellent (90%+)</SelectItem>
                    <SelectItem value="good">Good (70-89%)</SelectItem>
                    <SelectItem value="low">Low (&lt;70%)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {uniqueClasses.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Students ({filteredStudents.length})</span>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Filter className="w-4 h-4" />
                Showing {paginatedStudents.length} of {filteredStudents.length}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {sortBy === "name" && <div className="text-purple-500">{sortOrder === "asc" ? "↑" : "↓"}</div>}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("class")}
                    >
                      <div className="flex items-center gap-2">
                        Class
                        {sortBy === "class" && <div className="text-purple-500">{sortOrder === "asc" ? "↑" : "↓"}</div>}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("attendance")}
                    >
                      <div className="flex items-center gap-2">
                        Attendance %
                        {sortBy === "attendance" && (
                          <div className="text-purple-500">{sortOrder === "asc" ? "↑" : "↓"}</div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === "status" && (
                          <div className="text-purple-500">{sortOrder === "asc" ? "↑" : "↓"}</div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{student.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{student.class}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Grade {student.grade} - Section {student.section}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-2 font-medium ${getAttendanceColor(student.attendance)}`}
                        >
                          {getAttendanceIcon(student.attendance)}
                          {student.attendance}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                            className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-green-100 dark:hover:bg-green-900/20">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="w-4 h-4 mr-2" />
                                Call Guardian
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Flag Student
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Student
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of{" "}
                  {filteredStudents.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-gradient-to-r from-purple-500 to-violet-600" : ""}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Student Dialog */}
        <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-500" />
                Add New Student
              </DialogTitle>
              <DialogDescription>Fill in the student information below to add them to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
                <Input id="studentName" placeholder="Enter student's full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email</Label>
                <Input id="studentEmail" type="email" placeholder="student@school.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentPhone">Phone</Label>
                <Input id="studentPhone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentGrade">Grade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentClass">Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueClasses.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentSection">Section</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input id="guardianName" placeholder="Enter guardian's name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input id="guardianPhone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="studentAddress">Address</Label>
                <Textarea id="studentAddress" placeholder="Enter student's address" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700">
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import CSV Dialog */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-500" />
                Import Students from CSV
              </DialogTitle>
              <DialogDescription>
                Upload a CSV file with student data. Make sure it includes columns: Name, Email, Class, Grade, Section.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <Button variant="outline">Choose File</Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Import Students
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Student Dialog */}
        <Dialog open={isViewStudentOpen} onOpenChange={setIsViewStudentOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedStudent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                        {selectedStudent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStudent.id}</p>
                    </div>
                    <Badge className={getStatusColor(selectedStudent.status)}>{selectedStudent.status}</Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
                  {/* Student Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-500" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</Label>
                            <p className="text-gray-900 dark:text-white">{selectedStudent.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</Label>
                            <p className="text-gray-900 dark:text-white">{selectedStudent.phone}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Class</Label>
                            <p className="text-gray-900 dark:text-white">
                              {selectedStudent.class} - Grade {selectedStudent.grade}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Section</Label>
                            <p className="text-gray-900 dark:text-white">Section {selectedStudent.section}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Guardian</Label>
                            <p className="text-gray-900 dark:text-white">{selectedStudent.guardian}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Guardian Phone
                            </Label>
                            <p className="text-gray-900 dark:text-white">{selectedStudent.guardianPhone}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</Label>
                          <p className="text-gray-900 dark:text-white">{selectedStudent.address}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-green-500" />
                          Academic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">GPA</Label>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {selectedStudent.gpa}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Enrollment Date
                            </Label>
                            <p className="text-gray-900 dark:text-white">{selectedStudent.enrollmentDate}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Subjects</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedStudent.subjects.map((subject, index) => (
                              <Badge key={index} variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Achievements</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedStudent.achievements.map((achievement, index) => (
                              <Badge key={index} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                <Award className="w-3 h-3 mr-1" />
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Attendance Stats */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-cyan-500" />
                          Attendance Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${getAttendanceColor(selectedStudent.attendance)}`}>
                            {selectedStudent.attendance}%
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Attendance</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Classes</span>
                            <span className="font-medium">{selectedStudent.totalClasses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Present Days</span>
                            <span className="font-medium text-green-600">{selectedStudent.presentDays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Absent Days</span>
                            <span className="font-medium text-red-600">{selectedStudent.absentDays}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Last seen</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedStudent.lastActivity}</p>
                      </CardContent>
                    </Card>

                    <div className="flex flex-col gap-2">
                      <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Student
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Guardian
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
