"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  Edit,
  Save,
  Camera,
  Shield,
  School,
  Award,
} from "lucide-react"

export function ProfilePopup({ isOpen, onClose, userProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile || {})

  // Sample user data based on your schema
  const defaultProfile = {
    id: "user_123",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@greenwood.edu",
    image: "/avatars/sarah.jpg",
    role: "ADMIN",
    emailVerified: "2024-01-15T10:30:00Z",
    createdAt: "2023-08-15T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",

    // Teacher profile (if role is TEACHER or ADMIN)
    teacherProfile: {
      id: "teacher_123",
      fullName: "Dr. Sarah Johnson",
      subject: "Mathematics & Administration",
      bio: "Experienced educator with over 15 years in mathematics education and school administration. Passionate about innovative teaching methods and student success.",
      classes: [
        { id: "class_1", name: "Advanced Mathematics", section: "A", year: 2024, studentCount: 28 },
        { id: "class_2", name: "Statistics", section: "B", year: 2024, studentCount: 24 },
      ],
    },

    // Additional profile data
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Education Street, Learning City, LC 12345",
    birthDate: "1985-03-15",
    joinDate: "2023-08-15",
    department: "Mathematics Department",
    employeeId: "EMP001",

    // Statistics
    stats: {
      totalClasses: 2,
      totalStudents: 52,
      averageAttendance: 87.5,
      reportsGenerated: 24,
      yearsExperience: 15,
    },

    // Recent activity
    recentActivity: [
      { action: "Generated monthly report", date: "2024-01-20", type: "report" },
      { action: "Updated class schedule", date: "2024-01-19", type: "schedule" },
      { action: "Reviewed attendance records", date: "2024-01-18", type: "attendance" },
    ],

    // Achievements
    achievements: [
      { title: "Excellence in Teaching", year: "2023", type: "award" },
      { title: "Perfect Attendance Record", year: "2023", type: "achievement" },
      { title: "Student Favorite Teacher", year: "2022", type: "recognition" },
    ],
  }

  const profile = userProfile || defaultProfile

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
    onClose()
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "TEACHER":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      case "STUDENT":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4" />
      case "TEACHER":
        return <GraduationCap className="w-4 h-4" />
      case "STUDENT":
        return <BookOpen className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-6xl h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <DialogHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg md:text-xl text-slate-900 dark:text-white break-words">
                User Profile
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                View and manage profile information
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="border-slate-300 dark:border-slate-600 self-start sm:self-auto whitespace-nowrap"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">{isEditing ? "Cancel" : "Edit"}</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6">
          <div className="py-3 sm:py-4 md:py-6 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Profile Header Card */}
            <Card className="border-slate-200 dark:border-slate-700">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:items-start">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                      <AvatarImage src={profile.image || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-slate-500 to-slate-600 text-white text-lg sm:text-xl">
                        {profile.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-full border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-2 sm:space-y-3 min-w-0">
                    {isEditing ? (
                      <Input
                        value={editedProfile.name || profile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="text-sm sm:text-base md:text-lg font-semibold border-slate-300 dark:border-slate-600"
                        placeholder="Full Name"
                      />
                    ) : (
                      <div className="space-y-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg md:text-2xl text-slate-900 dark:text-white break-words">
                          {profile.name}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">
                          {profile.role === "TEACHER"
                            ? profile.teacherProfile?.subject || "No Subject"
                            : profile.role === "STUDENT"
                              ? `${profile.studentProfile?.class?.name || "No Class"} Section ${profile.studentProfile?.class?.section || ""
                                }`.trim()
                              : profile.department || "Department"}
                        </CardDescription>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2">
                      <Badge className={`${getRoleColor(profile.role)} text-xs sm:text-sm py-1`}>
                        {getRoleIcon(profile.role)}
                        <span className="ml-1 hidden xs:inline">{profile.role}</span>
                        <span className="ml-1 xs:hidden">{profile.role.slice(0, 3)}</span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-300 dark:border-slate-600 text-xs sm:text-sm py-1"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">{profile.stats?.yearsExperience || 0} years</span>
                        <span className="sm:hidden">{profile.stats?.yearsExperience || 0}y</span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-300 dark:border-slate-600 text-xs sm:text-sm py-1 break-all"
                      >
                        ID: {
                          profile.role === "TEACHER"
                            ? profile.teacherProfile?.employeeId || profile.id.slice(-6)
                            : profile.role === "STUDENT"
                              ? profile.studentProfile?.studentId || profile.id.slice(-6)
                              : profile.id.slice(-6)
                        }
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Personal Information */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="p-3 sm:p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-slate-900 dark:text-white">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="break-words">Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="break-words">Email</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={editedProfile.email || profile.email}
                            onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                            className="text-xs sm:text-sm border-slate-300 dark:border-slate-600"
                          />
                        ) : (
                          <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[40px] sm:min-h-[44px] flex items-center">
                            <p className="text-xs sm:text-sm text-slate-900 dark:text-white break-all">
                              {profile.email}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="break-words">Phone</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.phone || profile.phone}
                            onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                            className="text-xs sm:text-sm border-slate-300 dark:border-slate-600"
                          />
                        ) : (
                          <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[40px] sm:min-h-[44px] flex items-center">
                            <p className="text-xs sm:text-sm text-slate-900 dark:text-white">
                              {profile.phoneNumber || "Not provided"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="break-words">Address</span>
                      </Label>
                      {isEditing ? (
                        <Textarea
                          value={editedProfile.address || profile.address}
                          onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                          className="text-xs sm:text-sm border-slate-300 dark:border-slate-600"
                          rows={3}
                        />
                      ) : (
                        <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <p className="text-xs sm:text-sm text-slate-900 dark:text-white break-words leading-relaxed">
                            {profile.address || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="break-words">Birth Date</span>
                        </Label>
                        <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[40px] sm:min-h-[44px] flex items-center">
                          <p className="text-xs sm:text-sm text-slate-900 dark:text-white">
                            {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <School className="w-4 h-4 flex-shrink-0" />
                          <span className="break-words">Join Date</span>
                        </Label>
                        <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[40px] sm:min-h-[44px] flex items-center">
                          <p className="text-xs sm:text-sm text-slate-900 dark:text-white">
                            {new Date(profile.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {profile.teacherProfile?.bio && (
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Bio</Label>
                        {isEditing ? (
                          <Textarea
                            value={editedProfile.bio || profile.teacherProfile.bio}
                            onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                            className="text-xs sm:text-sm border-slate-300 dark:border-slate-600"
                            rows={4}
                          />
                        ) : (
                          <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words leading-relaxed">
                              {profile.teacherProfile.bio}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Teaching Information */}
                {profile.teacherProfile && (
                  <Card className="border-slate-200 dark:border-slate-700">
                    <CardHeader className="p-3 sm:p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-slate-900 dark:text-white">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="break-words">Teaching Info</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 md:p-6 pt-0 space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        <div className="text-center p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words">
                            {profile.stats?.totalClasses || 0}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Classes</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words">
                            {profile.stats?.totalStudents || 0}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Students</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words">
                            {profile.stats?.averageAttendance || 0}%
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Attendance</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words">
                            {profile.stats?.reportsGenerated || 0}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Reports</div>
                        </div>
                      </div>

                      {/* Classes List */}
                      {profile.teacherProfile.classes && profile.teacherProfile.classes.length > 0 && (
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                            Current Classes
                          </Label>
                          <div className="space-y-2">
                            {profile.teacherProfile.classes.map((cls) => (
                              <div
                                key={cls.id}
                                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-xs sm:text-sm text-slate-900 dark:text-white break-words">
                                    {cls.name} - Sec {cls.section}
                                  </p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400">Year {cls.year}</p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="border-slate-300 dark:border-slate-600 text-xs py-1 self-start sm:self-auto whitespace-nowrap"
                                >
                                  <Users className="w-3 h-3 mr-1" />
                                  {cls.studentCount}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Account Status */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base text-slate-900 dark:text-white">
                      Account Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Status</span>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs py-1">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Email Verified</span>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs py-1">
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Last Updated</span>
                      <span className="text-xs text-slate-900 dark:text-white">
                        {new Date(profile.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base text-slate-900 dark:text-white">
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3 max-h-40 overflow-y-auto">
                    {profile.recentActivity?.map((activity, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <div className="w-2 h-2 bg-slate-400 rounded-full mt-1 flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-slate-900 dark:text-white break-words">
                            {activity.action}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Achievements */}
                {profile.achievements && profile.achievements.length > 0 && (
                  <Card className="border-slate-200 dark:border-slate-700">
                    <CardHeader className="p-3 sm:p-4">
                      <CardTitle className="text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
                      {profile.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white break-words">
                              {achievement.title}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{achievement.year}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 dark:border-slate-600 bg-transparent text-xs sm:text-sm"
          >
            Close
          </Button>
          {isEditing && (
            <Button onClick={handleSave} className="bg-slate-600 hover:bg-slate-700 text-white text-xs sm:text-sm">
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}








































































































































































































// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   GraduationCap,
//   BookOpen,
//   Users,
//   Clock,
//   Edit,
//   Save,
//   Camera,
//   Shield,
//   School,
//   Award,
// } from "lucide-react"

// export function ProfilePopup({ isOpen, onClose, userProfile }) {
//   const [isEditing, setIsEditing] = useState(false)
//   const [editedProfile, setEditedProfile] = useState(userProfile || {})

//   // Sample user data based on your schema
//   const defaultProfile = {
//     id: "user_123",
//     name: "Dr. Sarah Johnson",
//     email: "sarah.johnson@greenwood.edu",
//     image: "/avatars/sarah.jpg",
//     role: "ADMIN",
//     emailVerified: "2024-01-15T10:30:00Z",
//     createdAt: "2023-08-15T09:00:00Z",
//     updatedAt: "2024-01-20T14:30:00Z",

//     // Teacher profile (if role is TEACHER or ADMIN)
//     teacherProfile: {
//       id: "teacher_123",
//       fullName: "Dr. Sarah Johnson",
//       subject: "Mathematics & Administration",
//       bio: "Experienced educator with over 15 years in mathematics education and school administration. Passionate about innovative teaching methods and student success.",
//       classes: [
//         { id: "class_1", name: "Advanced Mathematics", section: "A", year: 2024, studentCount: 28 },
//         { id: "class_2", name: "Statistics", section: "B", year: 2024, studentCount: 24 },
//       ],
//     },

//     // Additional profile data
//     phone: "+1 (555) 123-4567",
//     address: "123 Education Street, Learning City, LC 12345",
//     birthDate: "1985-03-15",
//     joinDate: "2023-08-15",
//     department: "Mathematics Department",
//     employeeId: "EMP001",

//     // Statistics
//     stats: {
//       totalClasses: 2,
//       totalStudents: 52,
//       averageAttendance: 87.5,
//       reportsGenerated: 24,
//       yearsExperience: 15,
//     },

//     // Recent activity
//     recentActivity: [
//       { action: "Generated monthly report", date: "2024-01-20", type: "report" },
//       { action: "Updated class schedule", date: "2024-01-19", type: "schedule" },
//       { action: "Reviewed attendance records", date: "2024-01-18", type: "attendance" },
//     ],

//     // Achievements
//     achievements: [
//       { title: "Excellence in Teaching", year: "2023", type: "award" },
//       { title: "Perfect Attendance Record", year: "2023", type: "achievement" },
//       { title: "Student Favorite Teacher", year: "2022", type: "recognition" },
//     ],
//   }

//   const profile = userProfile || defaultProfile

//   const handleSave = () => {
//     // Save logic here
//     setIsEditing(false)
//     onClose()
//   }

//   const getRoleColor = (role) => {
//     switch (role) {
//       case "ADMIN":
//         return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
//       case "TEACHER":
//         return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
//       case "STUDENT":
//         return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
//       default:
//         return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
//     }
//   }

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case "ADMIN":
//         return <Shield className="w-4 h-4" />
//       case "TEACHER":
//         return <GraduationCap className="w-4 h-4" />
//       case "STUDENT":
//         return <BookOpen className="w-4 h-4" />
//       default:
//         return <User className="w-4 h-4" />
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-[95vw] sm:w-[90vw] max-w-6xl h-[90vh] p-0 overflow-hidden">
//         {/* Header - Fixed */}
//         <DialogHeader className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//             <div>
//               <DialogTitle className="text-slate-900 dark:text-white text-lg sm:text-xl">User Profile</DialogTitle>
//               <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm">
//                 View and manage profile information
//               </DialogDescription>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setIsEditing(!isEditing)}
//               className="border-slate-300 dark:border-slate-600 self-start sm:self-auto"
//             >
//               <Edit className="w-4 h-4 mr-2" />
//               {isEditing ? "Cancel" : "Edit"}
//             </Button>
//           </div>
//         </DialogHeader>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto px-4 sm:px-6">
//           <div className="py-4 sm:py-6 space-y-6">
//             {/* Profile Header Card */}
//             <Card className="border-slate-200 dark:border-slate-700">
//               <CardHeader className="p-4 sm:p-6">
//                 <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
//                   <div className="relative flex-shrink-0">
//                     <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
//                       <AvatarImage src={profile.image || "/placeholder.svg"} />
//                       <AvatarFallback className="bg-gradient-to-r from-slate-500 to-slate-600 text-white text-xl">
//                         {profile.name
//                           ?.split(" ")
//                           .map((n) => n[0])
//                           .join("") || "U"}
//                       </AvatarFallback>
//                     </Avatar>
//                     {isEditing && (
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
//                       >
//                         <Camera className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </div>
//                   <div className="flex-1 text-center sm:text-left space-y-3">
//                     {isEditing ? (
//                       <Input
//                         value={editedProfile.name || profile.name}
//                         onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
//                         className="text-lg font-semibold border-slate-300 dark:border-slate-600"
//                         placeholder="Full Name"
//                       />
//                     ) : (
//                       <div className="space-y-1">
//                         <CardTitle className="text-xl sm:text-2xl text-slate-900 dark:text-white">
//                           {profile.name}
//                         </CardTitle>
//                         <CardDescription className="text-slate-600 dark:text-slate-400">
//                           {profile.teacherProfile?.subject || profile.department || "Department"}
//                         </CardDescription>
//                       </div>
//                     )}
//                     <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
//                       <Badge className={`${getRoleColor(profile.role)} text-sm`}>
//                         {getRoleIcon(profile.role)}
//                         <span className="ml-1">{profile.role}</span>
//                       </Badge>
//                       <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-sm">
//                         <Clock className="w-4 h-4 mr-1" />
//                         {profile.stats?.yearsExperience || 0} years
//                       </Badge>
//                       <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-sm">
//                         ID: {profile.employeeId || profile.id.slice(-6)}
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//             </Card>

//             {/* Content Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Main Content */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Personal Information */}
//                 <Card className="border-slate-200 dark:border-slate-700">
//                   <CardHeader className="p-4 sm:p-6">
//                     <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
//                       <User className="w-5 h-5" />
//                       Personal Information
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                           <Mail className="w-4 h-4" />
//                           Email Address
//                         </Label>
//                         {isEditing ? (
//                           <Input
//                             type="email"
//                             value={editedProfile.email || profile.email}
//                             onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
//                             className="border-slate-300 dark:border-slate-600"
//                           />
//                         ) : (
//                           <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[44px] flex items-center">
//                             <p className="text-slate-900 dark:text-white text-sm break-all">{profile.email}</p>
//                           </div>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                           <Phone className="w-4 h-4" />
//                           Phone Number
//                         </Label>
//                         {isEditing ? (
//                           <Input
//                             value={editedProfile.phone || profile.phone}
//                             onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
//                             className="border-slate-300 dark:border-slate-600"
//                           />
//                         ) : (
//                           <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[44px] flex items-center">
//                             <p className="text-slate-900 dark:text-white text-sm">{profile.phone || "Not provided"}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                         <MapPin className="w-4 h-4" />
//                         Address
//                       </Label>
//                       {isEditing ? (
//                         <Textarea
//                           value={editedProfile.address || profile.address}
//                           onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
//                           className="border-slate-300 dark:border-slate-600"
//                           rows={3}
//                         />
//                       ) : (
//                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
//                           <p className="text-slate-900 dark:text-white text-sm break-words">
//                             {profile.address || "Not provided"}
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                           <Calendar className="w-4 h-4" />
//                           Birth Date
//                         </Label>
//                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[44px] flex items-center">
//                           <p className="text-slate-900 dark:text-white text-sm">
//                             {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : "Not provided"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                           <School className="w-4 h-4" />
//                           Join Date
//                         </Label>
//                         <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg min-h-[44px] flex items-center">
//                           <p className="text-slate-900 dark:text-white text-sm">
//                             {new Date(profile.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {profile.teacherProfile?.bio && (
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</Label>
//                         {isEditing ? (
//                           <Textarea
//                             value={editedProfile.bio || profile.teacherProfile.bio}
//                             onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
//                             className="border-slate-300 dark:border-slate-600"
//                             rows={4}
//                           />
//                         ) : (
//                           <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
//                             <p className="text-slate-600 dark:text-slate-400 text-sm break-words leading-relaxed">
//                               {profile.teacherProfile.bio}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Teaching Information */}
//                 {profile.teacherProfile && (
//                   <Card className="border-slate-200 dark:border-slate-700">
//                     <CardHeader className="p-4 sm:p-6">
//                       <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
//                         <BookOpen className="w-5 h-5" />
//                         Teaching Information
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
//                       {/* Statistics Grid */}
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                         <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
//                           <div className="text-2xl font-bold text-slate-900 dark:text-white">
//                             {profile.stats?.totalClasses || 0}
//                           </div>
//                           <div className="text-xs text-slate-600 dark:text-slate-400">Classes</div>
//                         </div>
//                         <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
//                           <div className="text-2xl font-bold text-slate-900 dark:text-white">
//                             {profile.stats?.totalStudents || 0}
//                           </div>
//                           <div className="text-xs text-slate-600 dark:text-slate-400">Students</div>
//                         </div>
//                         <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
//                           <div className="text-2xl font-bold text-slate-900 dark:text-white">
//                             {profile.stats?.averageAttendance || 0}%
//                           </div>
//                           <div className="text-xs text-slate-600 dark:text-slate-400">Attendance</div>
//                         </div>
//                         <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
//                           <div className="text-2xl font-bold text-slate-900 dark:text-white">
//                             {profile.stats?.reportsGenerated || 0}
//                           </div>
//                           <div className="text-xs text-slate-600 dark:text-slate-400">Reports</div>
//                         </div>
//                       </div>

//                       {/* Classes List */}
//                       {profile.teacherProfile.classes && profile.teacherProfile.classes.length > 0 && (
//                         <div className="space-y-3">
//                           <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                             Current Classes
//                           </Label>
//                           <div className="space-y-2">
//                             {profile.teacherProfile.classes.map((cls) => (
//                               <div
//                                 key={cls.id}
//                                 className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50"
//                               >
//                                 <div className="min-w-0">
//                                   <p className="font-medium text-slate-900 dark:text-white text-sm">
//                                     {cls.name} - Section {cls.section}
//                                   </p>
//                                   <p className="text-xs text-slate-600 dark:text-slate-400">Year {cls.year}</p>
//                                 </div>
//                                 <Badge
//                                   variant="outline"
//                                   className="border-slate-300 dark:border-slate-600 text-xs self-start sm:self-auto"
//                                 >
//                                   <Users className="w-3 h-3 mr-1" />
//                                   {cls.studentCount}
//                                 </Badge>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>

//               {/* Sidebar */}
//               <div className="space-y-6">
//                 {/* Account Status */}
//                 <Card className="border-slate-200 dark:border-slate-700">
//                   <CardHeader className="p-4">
//                     <CardTitle className="text-base text-slate-900 dark:text-white">Account Status</CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4 pt-0 space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
//                       <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs">
//                         Active
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-slate-600 dark:text-slate-400">Email Verified</span>
//                       <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs">
//                         Verified
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-slate-600 dark:text-slate-400">Last Updated</span>
//                       <span className="text-xs text-slate-900 dark:text-white">
//                         {new Date(profile.updatedAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Recent Activity */}
//                 <Card className="border-slate-200 dark:border-slate-700">
//                   <CardHeader className="p-4">
//                     <CardTitle className="text-base text-slate-900 dark:text-white">Recent Activity</CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4 pt-0 space-y-3">
//                     {profile.recentActivity?.map((activity, index) => (
//                       <div key={index} className="flex items-start gap-3">
//                         <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm text-slate-900 dark:text-white break-words">{activity.action}</p>
//                           <p className="text-xs text-slate-600 dark:text-slate-400">
//                             {new Date(activity.date).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>

//                 {/* Achievements */}
//                 {profile.achievements && profile.achievements.length > 0 && (
//                   <Card className="border-slate-200 dark:border-slate-700">
//                     <CardHeader className="p-4">
//                       <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
//                         <Award className="w-4 h-4" />
//                         Achievements
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-4 pt-0 space-y-3">
//                       {profile.achievements.map((achievement, index) => (
//                         <div key={index} className="flex items-center gap-3">
//                           <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
//                             <Award className="w-4 h-4 text-white" />
//                           </div>
//                           <div className="min-w-0 flex-1">
//                             <p className="text-sm font-medium text-slate-900 dark:text-white break-words">
//                               {achievement.title}
//                             </p>
//                             <p className="text-xs text-slate-600 dark:text-slate-400">{achievement.year}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer - Fixed */}
//         <DialogFooter className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
//           <div className="flex items-center gap-3 w-full">
//             <Button
//               variant="outline"
//               onClick={onClose}
//               className="border-slate-300 dark:border-slate-600 bg-transparent flex-1 sm:flex-none"
//             >
//               Close
//             </Button>
//             {isEditing && (
//               <Button onClick={handleSave} className="bg-slate-600 hover:bg-slate-700 text-white flex-1 sm:flex-none">
//                 <Save className="w-4 h-4 mr-2" />
//                 Save Changes
//               </Button>
//             )}
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
