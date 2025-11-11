
// This is nav-user.jsx


// NavUser.jsx
// This is the user account menu:
// Shows avatar, name, email
// Has a dropdown with profile, notifications, billing, logout
// Also includes a custom <ThemeToggle /> component



"use client"


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { useRouter } from "next/navigation"
import { ThemeToggle } from "./userDefine/ThemeToggle/ThemeToggle"
import SignOutDropdownItem from "./sessionwrapper/signOut/SignOutButton"
import ProfileDemo from "@/app/dashboard/profile/page"
import { useState } from "react"
import { ProfilePopup } from "./userDefine/profile/profle"

export function NavUser({
  user
}) {
  const { isMobile } = useSidebar()
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profileData, setProfileData] = useState(null)

  const handleOpenProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      const data = await res.json()
      setProfileData(data.user)
      setIsProfileOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  function handleLogout() {
    // TODO: add your logout logic here (e.g. clear auth tokens)

    router.push("/login"); // 3. Redirect to login page
  }

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
    phoneNumber: "+1 (555) 123-4567",
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
  console.log("User data:", user);


  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>

                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>

            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ThemeToggle />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleOpenProfile}>
                  <BadgeCheck />
                  Account

                </DropdownMenuItem>
              </DropdownMenuGroup>
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuGroup>


                {/* <DropdownMenuItem>
                  
                  Account
                </DropdownMenuItem>
              



              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem> */}
              {/* SIGN OUT BUTTON */}
              <SignOutDropdownItem />

            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <ProfilePopup
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={profileData}
      />
    </>
  );
}
