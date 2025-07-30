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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
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
  Settings,
  Users,
  Shield,
  Palette,
  Database,
  School,
  Upload,
  Download,
  Save,
  RefreshCw,
  UserCheck,
  Crown,
  GraduationCap,
  Server,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Edit,
  Plus,
  Camera,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("roles")
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)

  // School settings state
  const [schoolSettings, setSchoolSettings] = useState({
    name: "Greenwood High School",
    address: "123 Education Street, Learning City, LC 12345",
    phone: "+1 (555) 123-4567",
    email: "admin@greenwood.edu",
    website: "www.greenwood.edu",
    logo: "/school-logo.png",
    description: "Excellence in education since 1985. Committed to nurturing young minds and building future leaders.",
    established: "1985",
    principal: "Dr. Sarah Johnson",
    studentCount: 1247,
    teacherCount: 89,
  })

  // Users and roles data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@greenwood.edu",
      role: "Super Admin",
      status: "Active",
      lastLogin: "2 hours ago",
      permissions: ["All Permissions"],
      avatar: "/avatars/sarah.jpg",
      department: "Administration",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@greenwood.edu",
      role: "Admin",
      status: "Active",
      lastLogin: "1 day ago",
      permissions: ["User Management", "Reports", "Classes"],
      avatar: "/avatars/michael.jpg",
      department: "Science",
    },
    {
      id: 3,
      name: "Ms. Emily Davis",
      email: "emily.davis@greenwood.edu",
      role: "Teacher",
      status: "Active",
      lastLogin: "3 hours ago",
      permissions: ["Classes", "Attendance", "Reports"],
      avatar: "/avatars/emily.jpg",
      department: "English",
    },
    {
      id: 4,
      name: "Mr. James Wilson",
      email: "james.wilson@greenwood.edu",
      role: "Teacher",
      status: "Inactive",
      lastLogin: "1 week ago",
      permissions: ["Classes", "Attendance"],
      avatar: "/avatars/james.jpg",
      department: "Mathematics",
    },
    {
      id: 5,
      name: "Ms. Lisa Rodriguez",
      email: "lisa.rodriguez@greenwood.edu",
      role: "Staff",
      status: "Active",
      lastLogin: "5 hours ago",
      permissions: ["Attendance", "Basic Reports"],
      avatar: "/avatars/lisa.jpg",
      department: "Administration",
    },
  ])

  const roles = [
    {
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: [
        "User Management",
        "System Settings",
        "Reports & Analytics",
        "Classes & Schedules",
        "Attendance Management",
        "Messaging System",
        "Data Export/Import",
        "Backup & Restore",
      ],
      userCount: 1,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Admin",
      description: "Administrative access with most permissions",
      permissions: [
        "User Management",
        "Reports & Analytics",
        "Classes & Schedules",
        "Attendance Management",
        "Messaging System",
        "Data Export/Import",
      ],
      userCount: 1,
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "Teacher",
      description: "Teaching staff with classroom management access",
      permissions: ["Classes & Schedules", "Attendance Management", "Student Reports", "Basic Messaging"],
      userCount: 2,
      color: "from-amber-500 to-orange-500",
    },
    {
      name: "Staff",
      description: "Support staff with limited access",
      permissions: ["Attendance Management", "Basic Reports"],
      userCount: 1,
      color: "from-slate-500 to-gray-500",
    },
  ]

  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "Active").length,
    totalRoles: roles.length,
    lastBackup: "2 days ago",
    systemHealth: "Excellent",
    storageUsed: "2.3 GB",
    storageTotal: "10 GB",
  }

  const backupHistory = [
    {
      id: 1,
      date: "2024-01-20",
      time: "02:00 AM",
      type: "Automatic",
      size: "2.1 GB",
      status: "Success",
    },
    {
      id: 2,
      date: "2024-01-19",
      time: "02:00 AM",
      type: "Automatic",
      size: "2.0 GB",
      status: "Success",
    },
    {
      id: 3,
      date: "2024-01-18",
      time: "10:30 AM",
      type: "Manual",
      size: "2.0 GB",
      status: "Success",
    },
    {
      id: 4,
      date: "2024-01-17",
      time: "02:00 AM",
      type: "Automatic",
      size: "1.9 GB",
      status: "Failed",
    },
  ]

  const handleBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          setIsBackupModalOpen(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleSaveSchoolSettings = () => {
    // Save school settings logic here
    setIsSchoolModalOpen(false)
  }

  const handleUserStatusToggle = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user,
      ),
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      case "Inactive":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "Admin":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      case "Teacher":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "Staff":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
    }
  }

  const tabs = [
    { id: "roles", label: "Roles & Permissions", icon: Shield },
    { id: "theme", label: "Theme Settings", icon: Palette },
    { id: "backup", label: "Backup & Restore", icon: Database },
    { id: "school", label: "School Details", icon: School },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}




















      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">


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


        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">System Settings</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage system configuration and preferences
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/admin-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{systemStats.totalUsers}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                    <UserCheck className="w-3 h-3" />
                    {systemStats.activeUsers} active
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System Roles</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{systemStats.totalRoles}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3" />
                    Permission levels
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Storage Used</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{systemStats.storageUsed}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                    <HardDrive className="w-3 h-3" />
                    of {systemStats.storageTotal}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Backup</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{systemStats.lastBackup}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3" />
                    {systemStats.systemHealth}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-6">
          <CardContent className="p-0">
            <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-700">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                        ? "border-slate-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700/50"
                        : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/30"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            {/* Roles Overview */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-slate-600" />
                      System Roles
                    </CardTitle>
                    <CardDescription>Manage user roles and permissions</CardDescription>
                  </div>
                  <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role, index) => (
                    <Card key={index} className="border border-slate-200 dark:border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 bg-gradient-to-r ${role.color} rounded-lg flex items-center justify-center`}
                            >
                              <Crown className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">{role.name}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{role.userCount} users</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{role.description}</p>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((permission, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                              >
                                {permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                              >
                                +{role.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Users Management */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-slate-600" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage system users and their permissions</CardDescription>
                  </div>
                  <Button
                    className="bg-slate-600 hover:bg-slate-700 text-white"
                    onClick={() => setIsUserModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{user.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                            <span className="text-xs text-slate-500">Last login: {user.lastLogin}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.status === "Active"}
                          onCheckedChange={() => handleUserStatusToggle(user.id)}
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "theme" && (
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-slate-600" />
                  Theme Settings
                </CardTitle>
                <CardDescription>Customize the appearance and theme preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Dark/Light Mode</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Toggle between dark and light themes</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>

                {/* Device Preview */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Theme Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <Monitor className="w-8 h-8 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Desktop</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Optimized for large screens</p>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <Tablet className="w-8 h-8 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Tablet</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Touch-friendly interface</p>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <Smartphone className="w-8 h-8 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Mobile</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Responsive design</p>
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Color Scheme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Success</p>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Warning</p>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Error</p>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Neutral</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="space-y-6">
            {/* Backup Controls */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-slate-600" />
                  Backup & Restore
                </CardTitle>
                <CardDescription>Manage system backups and data restoration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900 dark:text-white">Backup Options</h3>
                    <div className="space-y-3">
                      <Button
                        className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => setIsBackupModalOpen(true)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Create Backup
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-300 dark:border-slate-600 bg-transparent"
                        onClick={() => setIsRestoreModalOpen(true)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Restore from Backup
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-slate-300 dark:border-slate-600 bg-transparent"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Schedule Automatic Backup
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900 dark:text-white">System Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Last Backup</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {systemStats.lastBackup}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Storage Used</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {systemStats.storageUsed}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <span className="text-sm text-slate-600 dark:text-slate-400">System Health</span>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                          {systemStats.systemHealth}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup History */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-600" />
                  Backup History
                </CardTitle>
                <CardDescription>Recent backup activities and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backupHistory.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${backup.status === "Success"
                              ? "bg-emerald-100 dark:bg-emerald-900/20"
                              : "bg-red-100 dark:bg-red-900/20"
                            }`}
                        >
                          {backup.status === "Success" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{backup.type} Backup</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {backup.date} at {backup.time} • {backup.size}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          backup.status === "Success"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }
                      >
                        {backup.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "school" && (
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <School className="w-5 h-5 text-slate-600" />
                      School Information
                    </CardTitle>
                    <CardDescription>Manage school details and branding</CardDescription>
                  </div>
                  <Button
                    className="bg-slate-600 hover:bg-slate-700 text-white"
                    onClick={() => setIsSchoolModalOpen(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* School Logo */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900 dark:text-white">School Logo</h3>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center">
                        <School className="w-16 h-16 text-slate-500 dark:text-slate-400" />
                      </div>
                      <Button variant="outline" className="border-slate-300 dark:border-slate-600 bg-transparent">
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  {/* School Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">School Name</Label>
                        <p className="text-slate-900 dark:text-white font-medium">{schoolSettings.name}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Established</Label>
                        <p className="text-slate-900 dark:text-white">{schoolSettings.established}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Principal</Label>
                        <p className="text-slate-900 dark:text-white">{schoolSettings.principal}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Website</Label>
                        <p className="text-slate-900 dark:text-white">{schoolSettings.website}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</Label>
                      <p className="text-slate-900 dark:text-white">{schoolSettings.address}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</Label>
                        <p className="text-slate-900 dark:text-white">{schoolSettings.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                        <p className="text-slate-900 dark:text-white">{schoolSettings.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</Label>
                      <p className="text-slate-600 dark:text-slate-400">{schoolSettings.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Students</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {schoolSettings.studentCount.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Teachers</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {schoolSettings.teacherCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Backup Modal */}
      <Dialog open={isBackupModalOpen} onOpenChange={setIsBackupModalOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Create System Backup</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              This will create a complete backup of your system data.
            </DialogDescription>
          </DialogHeader>
          {isBackingUp ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Creating backup...</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${backupProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{backupProgress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Backup Type</Label>
                <Select defaultValue="full">
                  <SelectTrigger className="border-slate-300 dark:border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="full">Full System Backup</SelectItem>
                    <SelectItem value="data">Data Only</SelectItem>
                    <SelectItem value="settings">Settings Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Backup Information</span>
                </div>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Estimated size: ~2.3 GB</li>
                  <li>• Estimated time: 5-10 minutes</li>
                  <li>• Includes all user data and settings</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBackupModalOpen(false)}
              disabled={isBackingUp}
              className="border-slate-300 dark:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isBackingUp ? "Creating..." : "Create Backup"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* School Settings Modal */}
      <Dialog open={isSchoolModalOpen} onOpenChange={setIsSchoolModalOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Edit School Details</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Update your school information and branding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">School Name</Label>
                <Input
                  value={schoolSettings.name}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, name: e.target.value })}
                  className="border-slate-300 dark:border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Established Year</Label>
                <Input
                  value={schoolSettings.established}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, established: e.target.value })}
                  className="border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</Label>
              <Textarea
                value={schoolSettings.address}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, address: e.target.value })}
                className="border-slate-300 dark:border-slate-600"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</Label>
                <Input
                  value={schoolSettings.phone}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, phone: e.target.value })}
                  className="border-slate-300 dark:border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                <Input
                  value={schoolSettings.email}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, email: e.target.value })}
                  className="border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Website</Label>
                <Input
                  value={schoolSettings.website}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, website: e.target.value })}
                  className="border-slate-300 dark:border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Principal</Label>
                <Input
                  value={schoolSettings.principal}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, principal: e.target.value })}
                  className="border-slate-300 dark:border-slate-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</Label>
              <Textarea
                value={schoolSettings.description}
                onChange={(e) => setSchoolSettings({ ...schoolSettings, description: e.target.value })}
                className="border-slate-300 dark:border-slate-600"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSchoolModalOpen(false)}
              className="border-slate-300 dark:border-slate-600"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSchoolSettings} className="bg-slate-600 hover:bg-slate-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
