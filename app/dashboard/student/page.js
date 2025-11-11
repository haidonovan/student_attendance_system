"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [completedTasks, setCompletedTasks] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/student")
        const data = await response.json()
        console.log(data);
        setDashboardData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load data")
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const todaysTasks = [
    {
      id: 1,
      subject: "Mathematics",
      task: "Complete Chapter 5 Exercises",
      progress: 80,
      due: "6:00 PM",
      priority: "high",
    },
    { id: 2, subject: "Biology", task: "Lab Report Submission", progress: 60, due: "11:59 PM", priority: "medium" },
    { id: 3, subject: "English", task: "Essay Draft Review", progress: 100, due: "Tomorrow", priority: "low" },
  ]

  const performanceData = [
    { subject: "Math", score: 92, trend: "+5" },
    { subject: "Biology", score: 88, trend: "+2" },
    { subject: "English", score: 95, trend: "+8" },
  ]

  const gradesTrend = [
    { month: "Sep", average: 82 },
    { month: "Oct", average: 85 },
    { month: "Nov", average: 88 },
    { month: "Dec", average: 87 },
    { month: "Jan", average: 91 },
  ]

  const upcomingEvents = [
    { id: 1, title: "Math Quiz", date: "Tomorrow", time: "10:00 AM", type: "exam" },
    { id: 2, title: "Biology Lab", date: "Jan 25", time: "2:00 PM", type: "lab" },
    { id: 3, title: "English Essay Due", date: "Jan 27", time: "11:59 PM", type: "assignment" },
  ]

  const announcements = [
    { id: 1, title: "Winter Break Schedule", content: "Classes resume on January 15th", time: "2 hours ago" },
    { id: 2, title: "New Library Hours", content: "Extended hours during exam week", time: "1 day ago" },
    { id: 3, title: "Science Fair Registration", content: "Register by February 1st", time: "3 days ago" },
  ]

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const studentData = dashboardData?.student || {}
  const attendanceData = dashboardData?.attendance || {}
  const classesData = dashboardData?.classes || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Student Portal</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-gray-200 dark:border-gray-700">
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg font-bold">
                  {getInitials(studentData.name || "Student")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {studentData.name || "Student"}!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  ID: {studentData.studentId || "N/A"} • {studentData.standbyClass || "Not Assigned"}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Attendance</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{attendanceData.percentage || 0}%</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Tasks */}
            {/* <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">📋 Today's Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border-l-4 border-blue-500"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={completedTasks.includes(task.id) || task.progress === 100}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="w-5 h-5"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{task.task}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{task.subject}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                        {task.due}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{task.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card> */}

            {/* Grade Trends and Performance */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">📈 Grade Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={gradesTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                        />
                        <Line type="monotone" dataKey="average" stroke="#10B981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">📊 Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceData.map((subject) => (
                      <div key={subject.subject} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{subject.subject}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={subject.score} className="w-20 h-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div> */}

            {/* My Courses */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">📚 My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {classesData.length > 0 ? (
                    classesData.map((course) => (
                      <div
                        key={course.id}
                        className="rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{course.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {course.teacher || "Not Assigned"}
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Section: {course.section || "N/A"} 
                          {/* • Students: {course.studentCount || 0} */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                      No courses assigned yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            {/* <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">📅 Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.date} • {event.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card> */}

            {/* Quick Actions */}
            {/* <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">⚡ Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">📤 Submit</Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                >
                  ⏱️ Timer
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                >
                  💬 Chat
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Announcements */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">🔔 Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{announcement.content}</p>
                  <p className="text-xs text-gray-500">{announcement.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
