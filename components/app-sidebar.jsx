// TeamSwitcher.jsx
// Dropdown for switching between teams (Acme Inc, Evil Corp, etc.)
// Click opens a dropdown menu with team selection
// Shows team logo, name, and plan
// Stores selected team in activeTeam state




"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Teacher dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "General",
          url: "/dashboard/teacher",
        },
        {
          title: "Check Attendance",
          url: "check-attendance",
        },
        {
          title: "Class",
          url: "/dashboard/class",
        },
        { title: "Report",
          url: "/dashboard/report"
        },
        {
          title: "History",
          url: "/dashboard/history",
        },
        {
          title: "Student",
          url: "/dashboard/student-attendance",
        },
        {
          title: "Student Dashboard",
          url: "/dashboard/student-dashboard",
        }
      ],
    },
    {
      title: "Admin",
      url: "/dashboard/admin",
      icon: Bot,
      items: [
        {
          title: "Admin Dashboard",
          url: "/dashboard/admin-dashboard/attendance",
        },
        {
          title: "Teachers",
          url: "/dashboard/admin-dashboard/teachers",
        },
        {
          title: "Students",
          url: "/dashboard/admin-dashboard/students",
        },
        {
          title: "Class",
          url: "/dashboard/admin-dashboard/class",
        },
        {
          title: "Messaging & Alert",
          url: "/dashboard/admin-dashboard/messaging",
        },
        {
          title: "Reports",
          url: "/dashboard/admin-dashboard/reports",
        },
        {
          title: "Settings",
          url: "/dashboard/admin-dashboard/settings",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({
  ...props
}) {

  const {data: session, status } = useSession();

  const user = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "unknown@email.com",
    avatar: session?.user?.image || "/avatars/placeholder.jpg",
  }
  return (
    // show all the left side bar
    <Sidebar collapsible="icon" {...props}>
      {/* header upper */}
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      {/* middle all the content student teacher admin */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      {/* show the profile billing so on */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      {/* icon to collapse side bar */}
      <SidebarRail />
    </Sidebar>
  );
}
