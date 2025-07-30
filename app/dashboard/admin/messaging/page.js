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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  MessageSquare,
  Send,
  Users,
  User,
  GraduationCap,
  Bell,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  MoreHorizontal,
  Activity,
  TrendingUp,
  BookOpen,
  Shield,
  Megaphone,
} from "lucide-react"

export default function MessagingSystem() {
  const [activeTab, setActiveTab] = useState("compose")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedAlertType, setSelectedAlertType] = useState("info")
  const [messageTitle, setMessageTitle] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)

  // Sample data
  const classes = [
    { id: "math-a", name: "Mathematics A", students: 28 },
    { id: "bio-b", name: "Biology B", students: 25 },
    { id: "eng-c", name: "English C", students: 30 },
    { id: "phy-d", name: "Physics D", students: 22 },
    { id: "chem-e", name: "Chemistry E", students: 26 },
  ]

  const students = [
    { id: "1001", name: "Alice Smith", class: "Mathematics A", email: "alice@school.edu" },
    { id: "1002", name: "Bob Johnson", class: "Biology B", email: "bob@school.edu" },
    { id: "1003", name: "Carol Davis", class: "English C", email: "carol@school.edu" },
    { id: "1004", name: "David Wilson", class: "Physics D", email: "david@school.edu" },
    { id: "1005", name: "Emma Brown", class: "Chemistry E", email: "emma@school.edu" },
  ]

  const messages = [
    {
      id: 1,
      title: "Midterm Exam Schedule Released",
      content:
        "The midterm examination schedule has been finalized and is now available on the student portal. Please review your exam dates and prepare accordingly.",
      type: "info",
      recipient: "All Students",
      recipientCount: 1247,
      status: "sent",
      sentAt: "2024-01-15T09:00:00Z",
      readCount: 892,
      author: "Academic Office",
      priority: "normal",
      channels: ["email", "app", "sms"],
    },
    {
      id: 2,
      title: "Emergency: Campus Closure Due to Weather",
      content:
        "Due to severe weather conditions, the campus will be closed today. All classes are cancelled. Stay safe and check your email for updates.",
      type: "urgent",
      recipient: "All Students",
      recipientCount: 1247,
      status: "sent",
      sentAt: "2024-01-14T06:30:00Z",
      readCount: 1205,
      author: "Administration",
      priority: "high",
      channels: ["email", "app", "sms", "push"],
    },
    {
      id: 3,
      title: "Library Hours Extended",
      content:
        "Starting next week, the library will be open until 10 PM on weekdays to support your study needs during exam season.",
      type: "info",
      recipient: "All Students",
      recipientCount: 1247,
      status: "sent",
      sentAt: "2024-01-13T14:20:00Z",
      readCount: 756,
      author: "Library Services",
      priority: "normal",
      channels: ["email", "app"],
    },
    {
      id: 4,
      title: "Lab Safety Reminder",
      content:
        "Please remember to wear appropriate safety equipment during all laboratory sessions. Safety goggles and lab coats are mandatory.",
      type: "warning",
      recipient: "Biology B",
      recipientCount: 25,
      status: "sent",
      sentAt: "2024-01-12T11:15:00Z",
      readCount: 23,
      author: "Prof. Johnson",
      priority: "normal",
      channels: ["email", "app"],
    },
    {
      id: 5,
      title: "Assignment Deadline Extension",
      content:
        "The deadline for the research paper has been extended to Friday, January 19th. Please submit your work through the online portal.",
      type: "info",
      recipient: "English C",
      recipientCount: 30,
      status: "sent",
      sentAt: "2024-01-11T16:45:00Z",
      readCount: 28,
      author: "Dr. Smith",
      priority: "normal",
      channels: ["email", "app"],
    },
    {
      id: 6,
      title: "Parent-Teacher Conference Scheduled",
      content:
        "Your parent-teacher conference has been scheduled for January 20th at 2:00 PM. Please confirm your attendance.",
      type: "info",
      recipient: "Individual",
      recipientCount: 1,
      status: "scheduled",
      scheduledFor: "2024-01-18T10:00:00Z",
      author: "Ms. Davis",
      priority: "normal",
      channels: ["email", "app"],
    },
    {
      id: 7,
      title: "System Maintenance Notice",
      content:
        "The student portal will be under maintenance this Saturday from 2 AM to 6 AM. Please plan your activities accordingly.",
      type: "warning",
      recipient: "All Students",
      recipientCount: 1247,
      status: "scheduled",
      scheduledFor: "2024-01-17T08:00:00Z",
      author: "IT Department",
      priority: "normal",
      channels: ["email", "app"],
    },
    {
      id: 8,
      title: "Scholarship Application Deadline",
      content:
        "Reminder: The deadline for scholarship applications is approaching. Submit your applications by January 25th.",
      type: "warning",
      recipient: "All Students",
      recipientCount: 1247,
      status: "draft",
      author: "Financial Aid",
      priority: "normal",
      channels: ["email", "app"],
    },
  ]

  const stats = {
    totalMessages: messages.length,
    sentMessages: messages.filter((m) => m.status === "sent").length,
    scheduledMessages: messages.filter((m) => m.status === "scheduled").length,
    draftMessages: messages.filter((m) => m.status === "draft").length,
    totalReads: messages.reduce((sum, m) => sum + (m.readCount || 0), 0),
    averageReadRate: Math.round(
      (messages.reduce((sum, m) => sum + (m.readCount || 0), 0) /
        messages.reduce((sum, m) => sum + (m.recipientCount || 0), 0)) *
        100,
    ),
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "info":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      case "scheduled":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "draft":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "urgent":
        return <Bell className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.author.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleSendMessage = () => {
    // Handle message sending logic here
    console.log("Sending message:", {
      title: messageTitle,
      content: messageContent,
      recipient: selectedRecipient,
      class: selectedClass,
      type: selectedAlertType,
      scheduled: isScheduled,
      scheduledDate,
      scheduledTime,
    })

    // Reset form
    setMessageTitle("")
    setMessageContent("")
    setSelectedRecipient("all")
    setSelectedClass("all")
    setSelectedAlertType("info")
    setIsScheduled(false)
    setScheduledDate("")
    setScheduledTime("")
    setIsComposeOpen(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getReadPercentage = (message) => {
    if (!message.readCount || !message.recipientCount) return 0
    return Math.round((message.readCount / message.recipientCount) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 md:p-4">
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













      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Messaging & Alerts</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Communicate with students and manage announcements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Compose Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-slate-900 dark:text-white">Compose New Message</DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400">
                      Send announcements and alerts to students
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Recipients */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Send to</Label>
                        <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                          <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                            <SelectValue placeholder="Select recipients" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                            <SelectItem value="all" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                All Students
                              </div>
                            </SelectItem>
                            <SelectItem value="class" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                Specific Class
                              </div>
                            </SelectItem>
                            <SelectItem value="individual" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Individual Student
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedRecipient === "class" && (
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-slate-300">Select Class</Label>
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                              <SelectValue placeholder="Choose class" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                              {classes.map((cls) => (
                                <SelectItem
                                  key={cls.id}
                                  value={cls.id}
                                  className="hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                  {cls.name} ({cls.students} students)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Alert Type */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Alert Type</Label>
                      <Select value={selectedAlertType} onValueChange={setSelectedAlertType}>
                        <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                          <SelectValue placeholder="Select alert type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                          <SelectItem value="info" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4 text-slate-600" />
                              Information
                            </div>
                          </SelectItem>
                          <SelectItem value="warning" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              Warning
                            </div>
                          </SelectItem>
                          <SelectItem value="urgent" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-red-600" />
                              Urgent
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message Title */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Message Title</Label>
                      <Input
                        value={messageTitle}
                        onChange={(e) => setMessageTitle(e.target.value)}
                        placeholder="Enter message title..."
                        className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                      />
                    </div>

                    {/* Message Content */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Message Content</Label>
                      <Textarea
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Enter your message content..."
                        rows={4}
                        className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                      />
                    </div>

                    {/* Scheduling */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="schedule" checked={isScheduled} onCheckedChange={setIsScheduled} />
                        <Label htmlFor="schedule" className="text-slate-700 dark:text-slate-300">
                          Schedule for later
                        </Label>
                      </div>

                      {isScheduled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700 dark:text-slate-300">Date</Label>
                            <Input
                              type="date"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 dark:text-slate-300">Time</Label>
                            <Input
                              type="time"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsComposeOpen(false)}
                      className="border-slate-200 dark:border-slate-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
                    >
                      {isScheduled ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Schedule Message
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Messages</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalMessages}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Sent</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.sentMessages}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Scheduled</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.scheduledMessages}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Drafts</p>
                  <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">{stats.draftMessages}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                  <Edit className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Reads</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.totalReads.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Read Rate</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.averageReadRate}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <TabsTrigger
              value="compose"
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-700"
            >
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Megaphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  Quick Compose
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Send messages and announcements to students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                    onClick={() => {
                      setSelectedRecipient("all")
                      setSelectedAlertType("info")
                      setIsComposeOpen(true)
                    }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">All Students</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                    onClick={() => {
                      setSelectedRecipient("class")
                      setSelectedAlertType("info")
                      setIsComposeOpen(true)
                    }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Specific Class</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                    onClick={() => {
                      setSelectedRecipient("all")
                      setSelectedAlertType("urgent")
                      setIsComposeOpen(true)
                    }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Urgent Alert</span>
                  </Button>
                </div>

                {/* Message Templates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Weather Alert</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Campus closure due to weather conditions
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Exam Schedule</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Midterm examination schedule release
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Assignment Reminder</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Upcoming assignment deadline notification
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Safety Notice</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Important safety guidelines and procedures
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>
                  <Button variant="outline" className="border-slate-200 dark:border-slate-600 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                          {getTypeIcon(message.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{message.title}</h3>
                            <Badge className={getTypeColor(message.type)}>{message.type}</Badge>
                            <Badge className={getStatusColor(message.status)}>{message.status}</Badge>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            {message.content}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {message.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {message.recipient} ({message.recipientCount})
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {message.status === "sent"
                                ? formatDate(message.sentAt)
                                : message.status === "scheduled"
                                  ? `Scheduled for ${formatDate(message.scheduledFor)}`
                                  : "Draft"}
                            </span>
                            {message.readCount && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {getReadPercentage(message)}% read ({message.readCount}/{message.recipientCount})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Message Types Distribution */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Message Types</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Distribution of message types sent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Information</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {messages.filter((m) => m.type === "info").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Warning</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {messages.filter((m) => m.type === "warning").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Urgent</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {messages.filter((m) => m.type === "urgent").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Engagement Metrics</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Message read rates and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Average Read Rate</span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {stats.averageReadRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Total Messages Sent</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{stats.sentMessages}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Total Reads</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {stats.totalReads.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Pending Messages</span>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {stats.scheduledMessages + stats.draftMessages}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Recent Activity</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Latest messaging activity and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages
                    .filter((m) => m.status === "sent")
                    .slice(0, 5)
                    .map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                          {getTypeIcon(message.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{message.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Sent to {message.recipient} • {getReadPercentage(message)}% read rate
                          </p>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">{formatDate(message.sentAt)}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
