"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import {
  BookOpen,
  Calendar,
  Trophy,
  Target,
  CheckCircle,
  TrendingUp,
  Bell,
  Play,
  Upload,
  MessageCircle,
  Flame,
  Zap,
  Brain,
  ChevronRight,
  Timer,
  BarChart3,
  Medal,
  Crown,
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [completedTasks, setCompletedTasks] = useState([])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Sample student data
  const studentData = {
    name: "Alex Johnson",
    level: 3,
    xp: 320,
    nextLevelXp: 500,
    streak: 4,
    avatar: "AJ",
    quote: "Remember, consistency beats perfection! 🌟",
    gpa: 3.7,
    rank: "Top 15%",
  }

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
    { subject: "Physics", score: 85, trend: "-1" },
    { subject: "Chemistry", score: 90, trend: "+3" },
  ]

  const gradesTrend = [
    { month: "Sep", average: 82 },
    { month: "Oct", average: 85 },
    { month: "Nov", average: 88 },
    { month: "Dec", average: 87 },
    { month: "Jan", average: 91 },
  ]

  const skillsData = [
    { skill: "Problem Solving", score: 85 },
    { skill: "Critical Thinking", score: 92 },
    { skill: "Communication", score: 78 },
    { skill: "Creativity", score: 88 },
    { skill: "Collaboration", score: 82 },
    { skill: "Time Management", score: 75 },
  ]

  const achievements = [
    { id: 1, title: "Early Bird", description: "Submitted 5 assignments early", icon: "🌅", earned: true },
    { id: 2, title: "Math Wizard", description: "Top 10% in Mathematics", icon: "🧙‍♂️", earned: true },
    { id: 3, title: "Streak Master", description: "7-day active streak", icon: "🔥", earned: false },
    { id: 4, title: "Team Player", description: "Excellent group work", icon: "🤝", earned: true },
  ]

  const courses = [
    {
      id: 1,
      name: "Advanced Mathematics",
      teacher: "Dr. Smith",
      progress: 67,
      grade: "A-",
      nextLesson: "Calculus Integration",
      color: "from-blue-500 to-blue-600",
      icon: "📐",
    },
    {
      id: 2,
      name: "Biology",
      teacher: "Ms. Johnson",
      progress: 82,
      grade: "B+",
      nextLesson: "Cell Division",
      color: "from-green-500 to-green-600",
      icon: "🧬",
    },
    {
      id: 3,
      name: "English Literature",
      teacher: "Mr. Brown",
      progress: 75,
      grade: "A",
      nextLesson: "Shakespeare Analysis",
      color: "from-purple-500 to-purple-600",
      icon: "📚",
    },
    {
      id: 4,
      name: "Physics",
      teacher: "Dr. Wilson",
      progress: 58,
      grade: "B",
      nextLesson: "Quantum Mechanics",
      color: "from-orange-500 to-orange-600",
      icon: "⚛️",
    },
  ]

  const upcomingEvents = [
    { id: 1, title: "Math Quiz", date: "Tomorrow", time: "10:00 AM", type: "exam" },
    { id: 2, title: "Biology Lab", date: "Jan 25", time: "2:00 PM", type: "lab" },
    { id: 3, title: "English Essay Due", date: "Jan 27", time: "11:59 PM", type: "assignment" },
    { id: 4, title: "Physics Project", date: "Jan 30", time: "9:00 AM", type: "project" },
  ]

  const announcements = [
    { id: 1, title: "Winter Break Schedule", content: "Classes resume on January 15th", time: "2 hours ago" },
    { id: 2, title: "New Library Hours", content: "Extended hours during exam week", time: "1 day ago" },
    { id: 3, title: "Science Fair Registration", content: "Register by February 1st", time: "3 days ago" },
  ]

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case "exam":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "lab":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "assignment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "project":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/10"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
      case "low":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/10"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/10"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/10 dark:bg-gray-900/10 border-b border-white/20 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Student Portal</h1>
              <p className="text-sm text-gray-300">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </Button>
            <ThemeToggle />
            <Avatar className="w-8 h-8 border-2 border-white/20">
              <AvatarImage src="/student-avatar.jpg" />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {studentData.avatar}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/30">
                <AvatarImage src="/student-avatar.jpg" />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {studentData.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Welcome back, {studentData.name}! 👋</h2>
                <p className="text-white/80 mt-1">{studentData.quote}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-white/80">Level</span>
                </div>
                <div className="text-2xl font-bold">{studentData.level}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-orange-300" />
                  <span className="text-sm text-white/80">Streak</span>
                </div>
                <div className="text-2xl font-bold">{studentData.streak} days</div>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">XP Progress</span>
              <span className="text-sm text-white/80">
                {studentData.xp} / {studentData.nextLevelXp}
              </span>
            </div>
            <Progress value={(studentData.xp / studentData.nextLevelXp) * 100} className="h-2 bg-white/20" />
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Plan */}
            <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  Today's Focus
                </CardTitle>
                <CardDescription className="text-gray-300 dark:text-gray-400">
                  Your plan for today - stay on track! 🎯
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)} transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            completedTasks.includes(task.id) || task.progress === 100
                              ? "bg-green-500 border-green-500"
                              : "border-gray-400 hover:border-green-400"
                          }`}
                        >
                          {(completedTasks.includes(task.id) || task.progress === 100) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </button>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{task.task}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{task.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          Due {task.due}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{task.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Grade Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={gradesTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "none",
                            borderRadius: "8px",
                            color: "#F9FAFB",
                          }}
                        />
                        <Line type="monotone" dataKey="average" stroke="#10B981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Subject Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceData.map((subject) => (
                      <div key={subject.subject} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 dark:text-gray-400">{subject.subject}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={subject.score} className="w-20 h-2" />
                          <span className="text-sm font-medium text-white dark:text-white w-8">{subject.score}</span>
                          <span
                            className={`text-xs ${subject.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                          >
                            {subject.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses */}
            <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    My Courses
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-r p-4 text-white hover:scale-[1.02] transition-transform cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-90`}></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{course.icon}</span>
                          <Badge className="bg-white/20 text-white border-white/30">{course.grade}</Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{course.name}</h3>
                        <p className="text-sm text-white/80 mb-3">{course.teacher}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2 bg-white/20" />
                          <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                            <Play className="w-4 h-4 mr-2" />
                            {course.nextLesson}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white dark:text-white">{studentData.gpa}</div>
                  <div className="text-sm text-gray-300 dark:text-gray-400">GPA</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white dark:text-white">{studentData.rank}</div>
                  <div className="text-sm text-gray-300 dark:text-gray-400">Class Rank</div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      achievement.earned
                        ? "bg-yellow-500/20 border border-yellow-500/30"
                        : "bg-gray-500/10 border border-gray-500/20 opacity-60"
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white dark:text-white">{achievement.title}</h4>
                      <p className="text-sm text-gray-300 dark:text-gray-400">{achievement.description}</p>
                    </div>
                    {achievement.earned && <Medal className="w-5 h-5 text-yellow-400" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <h4 className="font-medium text-white dark:text-white">{event.title}</h4>
                      <p className="text-sm text-gray-300 dark:text-gray-400">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills Radar */}
            <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  Skills Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillsData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                      <PolarRadiusAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                      <Radar dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white dark:text-white">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Assignment
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Timer className="w-4 h-4 mr-2" />
                  Study Timer
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Classmates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Announcements */}
        <Card className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white dark:text-white">
              <Bell className="w-5 h-5 text-orange-400" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <h4 className="font-medium text-white dark:text-white mb-2">{announcement.title}</h4>
                  <p className="text-sm text-gray-300 dark:text-gray-400 mb-2">{announcement.content}</p>
                  <p className="text-xs text-gray-400">{announcement.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
