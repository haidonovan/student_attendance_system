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
import { Upload } from "lucide-react"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Download,
  MoreVertical,
  Mail,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Loader2,
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
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTeacherId, setEditingTeacherId] = useState(null)
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalClasses: 0,
    totalStudents: 0,
  })
  const [importLoading, setImportLoading] = useState(false)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/dashboard/admin/teacher")

      if (!response.ok) {
        throw new Error("Failed to fetch teachers")
      }

      const data = await response.json()

      setTeachers(data.teachers || [])
      setStats({
        totalTeachers: data.stats.totalTeachers,
        totalClasses: data.stats.totalClasses,
        totalStudents: data.stats.totalStudents,
      })
    } catch (err) {
      console.error("[v0] Error fetching teachers:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTeacher = async (formData) => {
    try {
      const method = editingTeacherId ? "PUT" : "POST"
      const url = editingTeacherId ? "/api/dashboard/admin/teacher" : "/api/dashboard/admin/teacher"

      const payload = editingTeacherId ? { ...formData, id: editingTeacherId } : formData

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(editingTeacherId ? "Failed to update teacher" : "Failed to add teacher")
      }

      await fetchTeachers()
      setIsAddModalOpen(false)
      setEditingTeacherId(null)
    } catch (err) {
      console.error("[v0] Error:", err)
      setError(err.message)
    }
  }

  const handleEditTeacher = (teacher) => {
    setEditingTeacherId(teacher.id)
    setIsAddModalOpen(true)
  }

  const handleDeleteTeacher = async (teacherId) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return

    try {
      const response = await fetch(`/api/dashboard/admin/teacher?teacherId=${teacherId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete teacher")
      }

      await fetchTeachers()
    } catch (err) {
      console.error("[v0] Error deleting teacher:", err)
      setError(err.message)
    }
  }

  const handleExportTeachers = () => {
    try {
      const csvContent = [
        ["Employee ID", "Full Name", "Subject", "Bio", "Email", "Classes", "Students", "Attendance Rate"],
        ...filteredTeachers.map((teacher) => [
          teacher.employeeId,
          teacher.fullName,
          teacher.subject || "N/A",
          teacher.bio || "N/A",
          teacher.email || "N/A",
          teacher.classCount || 0,
          teacher.studentCount || 0,
          teacher.todayAttendanceRate + "%",
        ]),
      ]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `teachers_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("[v0] Export error:", err)
      setError("Failed to export teachers")
    }
  }

  const handleImportTeachers = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Please upload a CSV or Excel file (.csv, .xlsx, .xls)")
      return
    }

    setImportLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const rows = []

          if (file.name.endsWith(".csv")) {
            // Parse CSV
            const text = event.target?.result
            const lines = text.split("\n")
            const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim()) {
                const values = lines[i].split(",").map((v) => v.trim())
                rows.push({
                  fullName: values[headers.indexOf("fullname")] || values[0],
                  subject: values[headers.indexOf("subject")] || "",
                  bio: values[headers.indexOf("bio")] || "",
                  email: values[headers.indexOf("email")] || "",
                  phoneNumber: values[headers.indexOf("phone")] || values[headers.indexOf("phonenumber")] || "",
                  address: values[headers.indexOf("address")] || "",
                  birthDate: values[headers.indexOf("birthdate")] || values[headers.indexOf("birth")] || "",
                })
              }
            }
          } else {
            // For Excel files, we'll need xlsx library
            setError("Excel files require additional setup. Please use CSV format instead.")
            setImportLoading(false)
            return
          }

          // Filter valid rows
          const validRows = rows.filter((row) => row.fullName?.trim())

          if (validRows.length === 0) {
            setError("No valid teacher data found in file")
            setImportLoading(false)
            return
          }

          // Import teachers
          let successCount = 0
          let failureCount = 0
          const errors = []

          for (const teacherData of validRows) {
            try {
              const response = await fetch("/api/dashboard/admin/teacher", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(teacherData),
              })

              if (response.ok) {
                successCount++
              } else {
                failureCount++
                const data = await response.json()
                errors.push(`${teacherData.fullName}: ${data.error || "Failed to create"}`)
              }
            } catch (err) {
              failureCount++
              errors.push(`${teacherData.fullName}: ${err.message}`)
            }
          }

          // Show results
          let message = `Import completed: ${successCount} teachers added successfully`
          if (failureCount > 0) {
            message += `, ${failureCount} failed`
            if (errors.length > 0 && errors.length <= 3) {
              message += `\n\nErrors:\n${errors.join("\n")}`
            }
          }

          alert(message)

          // Refresh teachers list
          await fetchTeachers()
        } catch (err) {
          console.error("[v0] Import error:", err)
          setError(`Import failed: ${err.message}`)
        } finally {
          setImportLoading(false)
        }
      }

      reader.readAsText(file)
    } catch (err) {
      console.error("[v0] File read error:", err)
      setError("Failed to read file")
      setImportLoading(false)
    }
  }

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = subjectFilter === "all" || teacher.subject?.toLowerCase() === subjectFilter.toLowerCase()

    return matchesSearch && matchesSubject
  })

  const getStatusColor = (attendance) => {
    if (attendance >= 80) return "text-green-600"
    if (attendance >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6">
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
                href="/dashboard/admin"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 dark:text-slate-100">Teacher Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-4 text-red-800 dark:text-red-300">
            Error: {error}
            <Button size="sm" variant="outline" onClick={fetchTeachers} className="ml-4 bg-transparent">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 dark:from-purple-400 dark:via-violet-400 dark:to-purple-600 bg-clip-text text-transparent">
                Teacher Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Manage teachers, view performance, and track assignments
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setEditingTeacherId(null)
                  setIsAddModalOpen(true)
                }}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
              <div className="relative">
                <input
                  type="file"
                  id="import-teachers"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleImportTeachers}
                  disabled={importLoading}
                  className="hidden"
                />
                <label htmlFor="import-teachers">
                  <Button
                    asChild
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent cursor-pointer"
                    disabled={importLoading}
                  >
                    <span>
                      {importLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Import Teachers
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
              <Button
                onClick={handleExportTeachers}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Teachers</p>
                <p className="text-2xl font-bold">{stats.totalTeachers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Classes</p>
                <p className="text-2xl font-bold">{stats.totalClasses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
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
                  placeholder="Search by name, email, ID, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {[...new Set(teachers.map((t) => t.subject).filter(Boolean))].map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
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
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Subject</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Classes</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Students</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Attendance Rate</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={teacher.image || "/placeholder.svg"} alt={teacher.fullName} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white font-semibold">
                              {getInitials(teacher.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{teacher.fullName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.employeeId}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{teacher.subject || "N/A"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.bio || "No bio"}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{teacher.classCount || 0} classes</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {teacher.studentCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                teacher.todayAttendanceRate >= 80 ? "bg-green-500" : "bg-yellow-500"
                              }`}
                              style={{ width: `${teacher.todayAttendanceRate}%` }}
                            />
                          </div>
                          <span className={`font-medium ${getStatusColor(teacher.todayAttendanceRate)}`}>
                            {teacher.todayAttendanceRate}%
                          </span>
                        </div>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTeacher(teacher)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Teacher
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteTeacher(teacher.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Teacher
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400">
                      No teachers found
                    </td>
                  </tr>
                )}
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
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedTeacher.image || "/placeholder.svg"} alt={selectedTeacher.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-2xl font-bold">
                    {getInitials(selectedTeacher.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedTeacher.fullName}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {selectedTeacher.subject || "No subject"}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">{selectedTeacher.bio || "No bio available"}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="classes">Classes</TabsTrigger>
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
                              {selectedTeacher.studentCount || 0}
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
                            <p className="text-sm text-slate-600 dark:text-slate-400">Total Classes</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {selectedTeacher.classCount || 0}
                            </p>
                          </div>
                          <BookOpen className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Attendance Rate</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {selectedTeacher.todayAttendanceRate}%
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="classes" className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Assigned Classes</h4>
                    {selectedTeacher.classes && selectedTeacher.classes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTeacher.classes.map((cls, idx) => (
                          <Card key={idx}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-slate-100">{cls.name}</p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {cls.studentCount} students
                                  </p>
                                </div>
                                <BookOpen className="h-6 w-6 text-purple-500" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">No classes assigned</p>
                    )}
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
                          <div className="h-5 w-5 text-slate-400">ID:</div>
                          <span className="text-slate-700 dark:text-slate-300">{selectedTeacher.employeeId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Teacher Modal */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingTeacherId(null)
        }}
        onAdd={handleAddTeacher}
        editingTeacher={editingTeacherId ? teachers.find((t) => t.id === editingTeacherId) : null}
      />
    </div>
  )
}

function AddTeacherModal({ isOpen, onClose, onAdd, editingTeacher }) {
  const [formData, setFormData] = useState({
    fullName: "",
    subject: "",
    bio: "",
    email: "",
    password: "",
    image: null,
    imagePreview: "",
    birthDate: "",
    address: "",
    phoneNumber: "",
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editingTeacher) {
      setFormData({
        fullName: editingTeacher.fullName,
        subject: editingTeacher.subject || "",
        bio: editingTeacher.bio || "",
        email: editingTeacher.email || "",
        password: "", // Don't populate password on edit
        image: editingTeacher.image || null,
        imagePreview: editingTeacher.image || "",
        birthDate: editingTeacher.birthDate || "",
        address: editingTeacher.address || "",
        phoneNumber: editingTeacher.phoneNumber || "",
      })
    } else {
      setFormData({
        fullName: "",
        subject: "",
        bio: "",
        email: "",
        password: "",
        image: null,
        imagePreview: "",
        birthDate: "",
        address: "",
        phoneNumber: "",
      })
    }
  }, [editingTeacher, isOpen])

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imagePreview: reader.result,
      }))
    }
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!response.ok) {
        throw new Error("Image upload failed")
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }))
    } catch (err) {
      console.error("[v0] Image upload error:", err)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }))
  }

  const handleSubmit = () => {
    if (!formData.fullName) {
      alert("Full name is required")
      return
    }
    onAdd(formData)
    setFormData({
      fullName: "",
      subject: "",
      bio: "",
      email: "",
      password: "",
      image: null,
      imagePreview: "",
      birthDate: "",
      address: "",
      phoneNumber: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter teacher's full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Brief bio or description"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Profile Image</h3>
            <div className="space-y-3">
              {formData.imagePreview ? (
                <div className="relative w-32 h-32">
                  <img
                    src={formData.imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : null}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer block">
                  {uploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-slate-600 dark:text-slate-400">
                        <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Click to upload profile image
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {!editingTeacher && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {editingTeacher ? "Update Teacher" : "Add Teacher"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
