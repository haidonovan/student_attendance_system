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
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Search, BookOpen, GraduationCap } from "lucide-react"

export default function ClassManagementPage() {
  const [classes, setClasses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isEditClassOpen, setIsEditClassOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    year: new Date().getFullYear().toString(),
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/admin/class")
      if (!response.ok) throw new Error("Failed to fetch classes")
      const data = await response.json()
      setClasses(data.standbyClasses || [])
    } catch (err) {
      console.error("[v0] Error fetching classes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClass = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/dashboard/admin/class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to add class")
      await fetchClasses()
      setFormData({ name: "", section: "", year: new Date().getFullYear().toString() })
      setIsAddClassOpen(false)
    } catch (err) {
      console.error("[v0] Error adding class:", err)
    }
  }

  const handleEditClass = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/dashboard/admin/class", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedClass.id,
          name: formData.name,
          section: formData.section,
          year: formData.year,
        }),
      })
      if (!response.ok) throw new Error("Failed to update class")
      await fetchClasses()
      setFormData({ name: "", section: "", year: new Date().getFullYear().toString() })
      setIsEditClassOpen(false)
      setSelectedClass(null)
    } catch (err) {
      console.error("[v0] Error updating class:", err)
    }
  }

  const handleDeleteClass = async (classId) => {
    if (!confirm("Are you sure you want to delete this class?")) return
    try {
      const response = await fetch("/api/dashboard/admin/class", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: classId }),
      })
      if (!response.ok) throw new Error("Failed to delete class")
      await fetchClasses()
    } catch (err) {
      console.error("[v0] Error deleting class:", err)
    }
  }

  const openEditDialog = (classItem) => {
    setSelectedClass(classItem)
    setFormData({
      name: classItem.name,
      section: classItem.section || "",
      year: classItem.year?.toString() || new Date().getFullYear().toString(),
    })
    setIsEditClassOpen(true)
  }

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.section && cls.section.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const stats = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((sum, c) => sum + (c.students?.length || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-3">
      <div className="flex items-center gap-2 px-3 sm:px-4 m-4">
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
              <BreadcrumbPage className="text-gray-900 dark:text-gray-100">Class Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <hr></hr>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Class Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Manage standby classes and student groups</p>
          </div>

          <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>Create a new standby class</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="section">Section (Optional)</Label>
                  <Input
                    id="section"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year (Optional)</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="submit">Create Class</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Classes</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalClasses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Students</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalStudents}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-slate-600">Loading classes...</div>
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-600">No classes found</div>
        ) : (
          filteredClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    {classItem.section && <CardDescription>Section: {classItem.section}</CardDescription>}
                    {classItem.year && <CardDescription>Year: {classItem.year}</CardDescription>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {classItem.students?.length || 0} students
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {classItem.classes?.length || 0} class sessions
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(classItem)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClass(classItem.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update class information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditClass} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Class Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-section">Section (Optional)</Label>
              <Input
                id="edit-section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-year">Year (Optional)</Label>
              <Input
                id="edit-year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit">Update Class</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
