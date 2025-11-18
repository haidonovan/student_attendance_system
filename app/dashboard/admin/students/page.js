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
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Search, Plus, Download, AlertTriangle, Trash2, Target, Loader, Cloud, X } from 'lucide-react'

export default function StudentManagement() {
  const [students, setStudents] = useState([])
  const [standbyClasses, setStandbyClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [sortBy, setSortBy] = useState("fullName")
  const [sortOrder, setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [nextStudentId, setNextStudentId] = useState("STU001")
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    standbyClassId: "",
    email: "",
    password: "",
    image: "",
    birthDate: "",
    address: "",
    phoneNumber: "",
  })

  useEffect(() => {
    fetchStudents()
    fetchStandbyClasses()
  }, [])

  useEffect(() => {
    if (students.length > 0) {
      const maxNumber = Math.max(
        ...students
          .map((s) => {
            const match = s.studentId?.match(/STU(\d+)/)
            return match ? parseInt(match[1]) : 0
          })
          .filter((n) => n > 0)
      )
      const nextNum = Math.min(maxNumber + 1, 999)
      setNextStudentId(`STU${String(nextNum).padStart(3, "0")}`)
    }
  }, [students])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/admin/student")
      if (!response.ok) throw new Error("Failed to fetch students")
      const data = await response.json()
      setStudents(data.students || [])
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching students:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStandbyClasses = async () => {
    try {
      const response = await fetch("/api/dashboard/admin/standby-class")
      if (!response.ok) throw new Error("Failed to fetch standby classes")
      const data = await response.json()
      setStandbyClasses(data.standbyClasses || [])
    } catch (err) {
      console.error("[v0] Error fetching standby classes:", err)
      setError(err.message)
    }
  }

  const handleImageUpload = async (file) => {
    if (!file) return
    try {
      setUploadingImage(true)
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (!response.ok) throw new Error("Upload failed")
      const data = await response.json()
      setFormData((prev) => ({ ...prev, image: data.url }))
      setImagePreview(data.url)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const filteredStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.standbyClass?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClass =
        classFilter === "all" || classFilter === student.standbyClassId

      return matchesSearch && matchesClass
    })

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
  }, [students, searchTerm, classFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const getStatusColor = (percentage) => {
    if (percentage >= 90)
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    if (percentage >= 70)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  }

  const handleAddStudent = async () => {
    if (!formData.fullName) {
      setError("Full name is required")
      return
    }

    if (!formData.standbyClassId) {
      setError("Please select a standby class")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/dashboard/admin/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, studentId: nextStudentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to add student (${response.status})`)
      }

      await fetchStudents()
      setIsAddStudentOpen(false)
      setFormData({
        fullName: "",
        gender: "",
        standbyClassId: "",
        email: "",
        password: "",
        image: "",
        birthDate: "",
        address: "",
        phoneNumber: "",
      })
      setImagePreview(null)
    } catch (err) {
      console.error("[v0] Error adding student:", err)
      setError(err.message || "Failed to add student")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    try {
      const response = await fetch(
        `/api/dashboard/admin/student?studentId=${studentId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) throw new Error("Failed to delete student")
      await fetchStudents()
    } catch (err) {
      console.error("[v0] Error deleting student:", err)
      setError(err.message)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Name", "Email", "Class", "Attendance", "Phone"],
      ...filteredStudents.map((student) => [
        student.studentId,
        student.fullName,
        student.email,
        student.standbyClass?.name || "N/A",
        `${student.attendancePercentage}%`,
        student.phoneNumber || "N/A",
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
    lowAttendance: students.filter((s) => s.attendancePercentage < 70).length,
    averageAttendance:
      students.length > 0
        ? (
            students.reduce(
              (acc, s) => acc + (s.attendancePercentage || 0),
              0
            ) / students.length
          ).toFixed(1)
        : 0,
  }

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden lg:block">
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden lg:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 dark:text-gray-100">
                  Student Management
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                ✕
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              Student Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor all student information
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="bg-white dark:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setIsAddStudentOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Low Attendance
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.lowAttendance}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Attendance
                  </p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {stats.averageAttendance}%
                  </p>
                </div>
                <Target className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {standbyClasses.map((standbyClass) => (
                    <SelectItem key={standbyClass.id} value={standbyClass.id}>
                      {standbyClass.name}{" "}
                      {standbyClass.section ? `(${standbyClass.section})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={student.image || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                              {student.fullName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.fullName}</p>
                            <p className="text-xs text-gray-500">
                              {student.studentId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{student.email}</TableCell>
                      <TableCell>
                        {student.standbyClass?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(
                            student.attendancePercentage || 0
                          )}
                        >
                          {student.attendancePercentage || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.phoneNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Student Dialog */}
        <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Fill in the student information including all user account
                details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {/* Basic Information */}
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Student ID (Auto-generated)</Label>
                <Input
                  value={nextStudentId}
                  disabled
                  className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Account Information */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="student@school.edu"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Label>Birth Date</Label>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Other Information */}
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Standby Class *</Label>
                <Select
                  value={formData.standbyClassId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, standbyClassId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select standby class" />
                  </SelectTrigger>
                  <SelectContent>
                    {standbyClasses.map((standbyClass) => (
                      <SelectItem key={standbyClass.id} value={standbyClass.id}>
                        {standbyClass.name}{" "}
                        {standbyClass.section
                          ? `(${standbyClass.section})`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Address and Image */}
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter address"
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Profile Image</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 transition hover:border-purple-500 dark:hover:border-purple-400">
                  <div className="flex flex-col items-center gap-3">
                    <Cloud className="w-8 h-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Upload Profile Image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(file)
                          setImagePreview(URL.createObjectURL(file))
                        }
                      }}
                      disabled={uploadingImage}
                      className="cursor-pointer"
                    />
                    {uploadingImage && (
                      <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                        <Loader className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
                {imagePreview && (
                  <div className="flex items-center gap-3 mt-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={imagePreview || "/placeholder.svg"}
                      />
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Image Preview
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null)
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }}
                        className="text-red-600 hover:text-red-700 mt-1"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddStudentOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddStudent}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-violet-600"
              >
                {loading ? "Adding..." : "Add Student"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
