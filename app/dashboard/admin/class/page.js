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
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  GraduationCap,
  Building,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle,
} from "lucide-react"

export default function ClassSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedView, setSelectedView] = useState("week")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isEditClassOpen, setIsEditClassOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [draggedClass, setDraggedClass] = useState(null)

  // Sample data
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Mathematics A",
      subject: "Mathematics",
      grade: "10",
      section: "A",
      teacher: "Ms. Sarah Johnson",
      teacherId: 1,
      students: 28,
      room: "Room 101",
      schedule: [
        { day: "Monday", time: "08:00-09:30", duration: 90 },
        { day: "Wednesday", time: "10:00-11:30", duration: 90 },
        { day: "Friday", time: "14:00-15:30", duration: 90 },
      ],
      color: "from-purple-500 to-pink-500",
      status: "active",
    },
    {
      id: 2,
      name: "Biology B",
      subject: "Biology",
      grade: "11",
      section: "B",
      teacher: "Dr. Michael Chen",
      teacherId: 2,
      students: 24,
      room: "Lab 201",
      schedule: [
        { day: "Tuesday", time: "09:00-10:30", duration: 90 },
        { day: "Thursday", time: "11:00-12:30", duration: 90 },
      ],
      color: "from-green-500 to-emerald-500",
      status: "active",
    },
    {
      id: 3,
      name: "English Literature",
      subject: "English",
      grade: "12",
      section: "A",
      teacher: "Ms. Emily Davis",
      teacherId: 3,
      students: 22,
      room: "Room 305",
      schedule: [
        { day: "Monday", time: "11:00-12:30", duration: 90 },
        { day: "Wednesday", time: "13:00-14:30", duration: 90 },
        { day: "Friday", time: "09:00-10:30", duration: 90 },
      ],
      color: "from-orange-500 to-red-500",
      status: "active",
    },
    {
      id: 4,
      name: "Physics Advanced",
      subject: "Physics",
      grade: "12",
      section: "A",
      teacher: "Dr. Robert Wilson",
      teacherId: 4,
      students: 18,
      room: "Lab 102",
      schedule: [
        { day: "Tuesday", time: "14:00-15:30", duration: 90 },
        { day: "Thursday", time: "08:00-09:30", duration: 90 },
      ],
      color: "from-cyan-500 to-teal-500",
      status: "active",
    },
    {
      id: 5,
      name: "Chemistry Lab",
      subject: "Chemistry",
      grade: "11",
      section: "A",
      teacher: "Dr. Lisa Anderson",
      teacherId: 5,
      students: 20,
      room: "Lab 301",
      schedule: [
        { day: "Wednesday", time: "15:00-16:30", duration: 90 },
        { day: "Friday", time: "11:00-12:30", duration: 90 },
      ],
      color: "from-yellow-500 to-orange-500",
      status: "active",
    },
  ])

  const [teachers] = useState([
    { id: 1, name: "Ms. Sarah Johnson", subject: "Mathematics" },
    { id: 2, name: "Dr. Michael Chen", subject: "Biology" },
    { id: 3, name: "Ms. Emily Davis", subject: "English" },
    { id: 4, name: "Dr. Robert Wilson", subject: "Physics" },
    { id: 5, name: "Dr. Lisa Anderson", subject: "Chemistry" },
    { id: 6, name: "Mr. James Brown", subject: "History" },
  ])

  const [rooms] = useState([
    "Room 101",
    "Room 102",
    "Room 201",
    "Room 202",
    "Room 301",
    "Room 305",
    "Lab 101",
    "Lab 102",
    "Lab 201",
    "Lab 301",
    "Auditorium",
    "Library",
  ])

  const timeSlots = [
    "08:00-09:30",
    "09:30-11:00",
    "11:00-12:30",
    "12:30-14:00",
    "14:00-15:30",
    "15:30-17:00",
    "17:00-18:30",
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  // Statistics
  const stats = {
    totalClasses: classes.length,
    activeClasses: classes.filter((c) => c.status === "active").length,
    totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
    roomsInUse: [...new Set(classes.map((c) => c.room))].length,
    avgClassSize: Math.round(classes.reduce((sum, c) => sum + c.students, 0) / classes.length),
  }

  // Filter classes
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === "all" || cls.subject.toLowerCase() === selectedFilter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  // Get schedule for current week
  const getWeekSchedule = () => {
    const schedule = {}
    days.forEach((day) => {
      schedule[day] = {}
      timeSlots.forEach((slot) => {
        schedule[day][slot] = []
      })
    })

    classes.forEach((cls) => {
      cls.schedule.forEach((sch) => {
        if (schedule[sch.day] && schedule[sch.day][sch.time]) {
          schedule[sch.day][sch.time].push({
            ...cls,
            scheduleInfo: sch,
          })
        }
      })
    })

    return schedule
  }

  const weekSchedule = getWeekSchedule()

  // Room usage statistics
  const getRoomUsage = () => {
    const usage = {}
    rooms.forEach((room) => {
      usage[room] = 0
    })

    classes.forEach((cls) => {
      usage[cls.room] = (usage[cls.room] || 0) + cls.schedule.length
    })

    return Object.entries(usage)
      .map(([room, count]) => ({ room, count }))
      .sort((a, b) => b.count - a.count)
  }

  const roomUsage = getRoomUsage()

  // Handle drag and drop
  const handleDragStart = (e, classItem, scheduleInfo) => {
    setDraggedClass({ ...classItem, scheduleInfo })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, day, timeSlot) => {
    e.preventDefault()
    if (draggedClass) {
      // Update class schedule
      const updatedClasses = classes.map((cls) => {
        if (cls.id === draggedClass.id) {
          const newSchedule = cls.schedule.filter(
            (sch) => sch.day !== draggedClass.scheduleInfo.day || sch.time !== draggedClass.scheduleInfo.time,
          )
          newSchedule.push({
            day,
            time: timeSlot,
            duration: draggedClass.scheduleInfo.duration,
          })
          return { ...cls, schedule: newSchedule }
        }
        return cls
      })
      setClasses(updatedClasses)
      setDraggedClass(null)
    }
  }

  const handleAddClass = (newClass) => {
    const id = Math.max(...classes.map((c) => c.id)) + 1
    setClasses([...classes, { ...newClass, id, status: "active" }])
    setIsAddClassOpen(false)
  }

  const handleEditClass = (updatedClass) => {
    setClasses(classes.map((c) => (c.id === updatedClass.id ? updatedClass : c)))
    setIsEditClassOpen(false)
    setSelectedClass(null)
  }

  const handleDeleteClass = (classId) => {
    setClasses(classes.filter((c) => c.id !== classId))
  }

  return (

    // md:p:3
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-3">
      {/* Header */}



      
{/* Nav Bar and Icon */}
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
                <BreadcrumbPage className="text-gray-900 dark:text-gray-100">General</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <hr></hr>

        {/* nav bar horizontal nav */}









      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Class & Schedule Control
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage classes, assign teachers, and control schedules
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>Create a new class and set up its schedule</DialogDescription>
                </DialogHeader>
                <AddClassForm onSubmit={handleAddClass} teachers={teachers} rooms={rooms} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeClasses}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Students</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-cyan-200 dark:border-cyan-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Rooms Used</p>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.roomsInUse}</p>
              </div>
              <Building className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Size</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.avgClassSize}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Schedule View</TabsTrigger>
          <TabsTrigger value="classes">Class Management</TabsTrigger>
          <TabsTrigger value="rooms">Room Usage</TabsTrigger>
        </TabsList>

        {/* Schedule View */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Schedule
                  </CardTitle>
                  <CardDescription>Drag and drop classes to reschedule</CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium px-3">This Week</span>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Time slots header */}
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    <div className="p-2 text-sm font-medium text-slate-600 dark:text-slate-400">Time</div>
                    {days.map((day) => (
                      <div
                        key={day}
                        className="p-2 text-sm font-medium text-center bg-slate-100 dark:bg-slate-800 rounded-lg"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Schedule grid */}
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="grid grid-cols-6 gap-2 mb-2">
                      <div className="p-3 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {timeSlot}
                      </div>
                      {days.map((day) => (
                        <div
                          key={`${day}-${timeSlot}`}
                          className="min-h-[80px] p-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, day, timeSlot)}
                        >
                          {weekSchedule[day][timeSlot].map((classItem) => (
                            <div
                              key={`${classItem.id}-${day}-${timeSlot}`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, classItem, classItem.scheduleInfo)}
                              className={`p-2 rounded-lg bg-gradient-to-r ${classItem.color} text-white text-xs cursor-move hover:shadow-lg transition-shadow`}
                            >
                              <div className="font-medium">{classItem.name}</div>
                              <div className="opacity-90">{classItem.room}</div>
                              <div className="opacity-75">{classItem.students} students</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Class Management */}
        <TabsContent value="classes" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search classes, teachers, or subjects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription>
                        Grade {classItem.grade} - Section {classItem.section}
                      </CardDescription>
                    </div>
                    <Badge className={`bg-gradient-to-r ${classItem.color} text-white`}>{classItem.subject}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {classItem.teacher}
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4 mr-2" />
                      {classItem.students} students
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {classItem.room}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Schedule:</p>
                    {classItem.schedule.map((sch, idx) => (
                      <div key={idx} className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                        <CalendarDays className="w-3 h-3 mr-2" />
                        {sch.day} - {sch.time}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClass(classItem)
                        setIsEditClassOpen(true)
                      }}
                    >
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
            ))}
          </div>
        </TabsContent>

        {/* Room Usage */}
        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Classroom Usage Statistics
              </CardTitle>
              <CardDescription>View how frequently each room is being used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomUsage.map(({ room, count }) => (
                  <Card key={room} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-slate-100">{room}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{count} sessions per week</p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                              count >= 5
                                ? "bg-gradient-to-r from-red-500 to-pink-500"
                                : count >= 3
                                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                  : "bg-gradient-to-r from-green-500 to-emerald-500"
                            }`}
                          >
                            {count}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              count >= 5
                                ? "bg-gradient-to-r from-red-500 to-pink-500"
                                : count >= 3
                                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                  : "bg-gradient-to-r from-green-500 to-emerald-500"
                            }`}
                            style={{ width: `${Math.min((count / 7) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {Math.round((count / 7) * 100)}% utilization
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Class Dialog */}
      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update class information and schedule</DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <EditClassForm classData={selectedClass} onSubmit={handleEditClass} teachers={teachers} rooms={rooms} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Add Class Form Component
function AddClassForm({ onSubmit, teachers, rooms }) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    grade: "",
    section: "",
    teacherId: "",
    students: "",
    room: "",
    schedule: [],
    color: "from-purple-500 to-pink-500",
  })

  const colors = [
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-teal-500",
    "from-yellow-500 to-orange-500",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const teacher = teachers.find((t) => t.id === Number.parseInt(formData.teacherId))
    onSubmit({
      ...formData,
      teacher: teacher?.name || "",
      students: Number.parseInt(formData.students) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="section">Section</Label>
          <Input
            id="section"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="students">Students</Label>
          <Input
            id="students"
            type="number"
            value={formData.students}
            onChange={(e) => setFormData({ ...formData, students: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="teacher">Teacher</Label>
          <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                  {teacher.name} - {teacher.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="room">Room</Label>
          <Select value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Color Theme</Label>
        <div className="flex gap-2 mt-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} border-2 ${
                formData.color === color ? "border-slate-900 dark:border-slate-100" : "border-transparent"
              }`}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">Create Class</Button>
      </div>
    </form>
  )
}

// Edit Class Form Component
function EditClassForm({ classData, onSubmit, teachers, rooms }) {
  const [formData, setFormData] = useState(classData)

  const handleSubmit = (e) => {
    e.preventDefault()
    const teacher = teachers.find((t) => t.id === Number.parseInt(formData.teacherId))
    onSubmit({
      ...formData,
      teacher: teacher?.name || formData.teacher,
      students: Number.parseInt(formData.students) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="section">Section</Label>
          <Input
            id="section"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="students">Students</Label>
          <Input
            id="students"
            type="number"
            value={formData.students}
            onChange={(e) => setFormData({ ...formData, students: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="room">Room</Label>
          <Select value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">Update Class</Button>
      </div>
    </form>
  )
}
