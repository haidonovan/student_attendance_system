import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"

export default function HistoryPage() {
  // Sample data for demonstration
  const stats = [
    {
      title: "Total Sessions",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Average Attendance",
      value: "87.3%",
      change: "+2.1%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Late Arrivals",
      value: "156",
      change: "-8.2%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Absent Students",
      value: "89",
      change: "+3.4%",
      trend: "up",
      icon: XCircle,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "attendance",
      message: "Morning attendance recorded for Class 10A",
      time: "2 minutes ago",
      status: "success",
      user: "Mrs. Johnson",
    },
    {
      id: 2,
      type: "alert",
      message: "High absence rate detected in Class 9B",
      time: "15 minutes ago",
      status: "warning",
      user: "System Alert",
    },
    {
      id: 3,
      type: "attendance",
      message: "Afternoon session completed for Class 11C",
      time: "1 hour ago",
      status: "success",
      user: "Mr. Smith",
    },
    {
      id: 4,
      type: "report",
      message: "Weekly attendance report generated",
      time: "2 hours ago",
      status: "info",
      user: "Admin",
    },
    {
      id: 5,
      type: "attendance",
      message: "Late arrival recorded for John Doe",
      time: "3 hours ago",
      status: "warning",
      user: "Mrs. Davis",
    },
  ]

  const attendanceHistory = [
    {
      date: "2024-01-15",
      class: "Class 10A",
      present: 28,
      absent: 2,
      late: 1,
      total: 31,
      percentage: 90.3,
    },
    {
      date: "2024-01-15",
      class: "Class 9B",
      present: 25,
      absent: 4,
      late: 2,
      total: 31,
      percentage: 80.6,
    },
    {
      date: "2024-01-15",
      class: "Class 11C",
      present: 29,
      absent: 1,
      late: 0,
      total: 30,
      percentage: 96.7,
    },
    {
      date: "2024-01-14",
      class: "Class 10A",
      present: 30,
      absent: 1,
      late: 0,
      total: 31,
      percentage: 96.8,
    },
    {
      date: "2024-01-14",
      class: "Class 9B",
      present: 27,
      absent: 3,
      late: 1,
      total: 31,
      percentage: 87.1,
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <Eye className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (percentage) => {
    if (percentage >= 95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (percentage >= 85) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (percentage >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/platform">Platform</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>History</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Page Title & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance History</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track and analyze attendance patterns over time</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="flex items-center mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest attendance updates and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Attendance History Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Attendance Records</CardTitle>
                    <CardDescription>Detailed attendance history by class and date</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="Search records..." className="pl-10 w-64" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Class</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Present</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Absent</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Late</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Rate</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceHistory.map((record, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                            {record.class}
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-green-600 font-medium">{record.present}</td>
                          <td className="py-3 px-4 text-sm text-center text-red-600 font-medium">{record.absent}</td>
                          <td className="py-3 px-4 text-sm text-center text-yellow-600 font-medium">{record.late}</td>
                          <td className="py-3 px-4 text-sm text-center font-medium">{record.percentage}%</td>
                          <td className="py-3 px-4 text-center">{getStatusBadge(record.percentage)}</td>
                          <td className="py-3 px-4 text-center">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Showing 1-5 of 247 records</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Weekly attendance patterns across all classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Chart visualization would go here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Integration with charting library like Chart.js or Recharts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
