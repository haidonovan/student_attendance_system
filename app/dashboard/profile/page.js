"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProfilePopup } from "@/components/userDefine/profile/profle"

export default function ProfileDemo() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const sampleUser = {
    id: "user_123",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@greenwood.edu",
    image: "/placeholder.svg?height=100&width=100",
    role: "ADMIN",
    emailVerified: "2024-01-15T10:30:00Z",
    createdAt: "2023-08-15T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
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
    phone: "+1 (555) 123-4567",
    address: "123 Education Street, Learning City, LC 12345",
    birthDate: "1985-03-15",
    joinDate: "2023-08-15",
    department: "Mathematics Department",
    employeeId: "EMP001",
    stats: {
      totalClasses: 2,
      totalStudents: 52,
      averageAttendance: 87.5,
      reportsGenerated: 24,
      yearsExperience: 15,
    },
    recentActivity: [
      { action: "Generated monthly report", date: "2024-01-20", type: "report" },
      { action: "Updated class schedule", date: "2024-01-19", type: "schedule" },
      { action: "Reviewed attendance records", date: "2024-01-18", type: "attendance" },
    ],
    achievements: [
      { title: "Excellence in Teaching", year: "2023", type: "award" },
      { title: "Perfect Attendance Record", year: "2023", type: "achievement" },
      { title: "Student Favorite Teacher", year: "2022", type: "recognition" },
    ],
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Popup Demo</h1>
          <p className="text-slate-600 dark:text-slate-400">Click the button below to open the profile popup modal</p>
          <Button onClick={() => setIsProfileOpen(true)} className="bg-slate-600 hover:bg-slate-700 text-white">
            Open Profile
          </Button>
        </div>

        <ProfilePopup isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} userProfile={sampleUser} />
      </div>
    </div>
  )
}


// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"

// export default function AlertDialogDemo() {
//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button variant="outline">Show Dialog</Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete your
//             account and remove your data from our servers.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction>Continue</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }
