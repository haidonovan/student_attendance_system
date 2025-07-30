
// This Is app-sidebar.jsx


// TeamSwitcher.jsx
// Dropdown for switching between teams (Acme Inc, Evil Corp, etc.)
// Click opens a dropdown menu with team selection
// Shows team logo, name, and plan
// Stores selected team in activeTeam state




"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
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
      name: "Admin",
      role: "admin",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Teacher",
      role: "teacher",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Student",
      role: "student",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Teacher",
      role: "Teacher",
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
          url: "/dashboard/teacher/check-attendance",
        },
        {
          title: "Class",
          url: "/dashboard/teacher/class",
        },
        {
          title: "Report",
          url: "/dashboard/teacher/report"
        },
        {
          title: "History",
          url: "/dashboard/teacher/history",
        }
      ],
    },
    {
      title: "Admin",
      role: "Admin",
      url: "/dashboard/admin",
      icon: Bot,
      items: [
        {
          title: "General",
          url: "/dashboard/admin",
        },
        {
          title: "Admin Attendance",
          url: "/dashboard/admin/attendance",
        },
        {
          title: "Teachers",
          url: "/dashboard/admin/teachers",
        },
        {
          title: "Students",
          url: "/dashboard/admin/students",
        },
        {
          title: "Class",
          url: "/dashboard/admin/class",
        },
        {
          title: "Messaging & Alert",
          url: "/dashboard/admin/messaging",
        },
        {
          title: "Reports",
          url: "/dashboard/admin/reports",
        },
        {
          title: "Settings",
          url: "/dashboard/admin/settings",
        },
      ],
    },
    {
      title: "Student",
      role: "Student",
      url: "/dashboard/student",
      icon: BookOpen,
      items: [
        {
          title: "General",
          url: "/dashboard/student/",
        },
        {
          title: "Student Attendance",
          url: "/dashboard/student/attendance",
        }

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

  const { data: session, status } = useSession();
  const router = useRouter();

  const user = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "unknown@email.com",
    avatar: session?.user?.image || "/avatars/placeholder.jpg",

  }

  const [activeTeam, setActiveTeam] = React.useState(data.teams[0]);

  // when switches team, update state and navigate to that team's dashboard home
  const handleSetActiveTeam = (team) => {
    setActiveTeam(team);
    router.push(`/dashboard/${team.role.toLowerCase()}`)
  }

  // Filter only relevant menu items
  const filteredNavMain = data.navMain.filter(item => 
    item.role?.toLowerCase() === activeTeam.role || item.role === "All"
    
  );

  return (
    // show all the left side bar
    <Sidebar collapsible="icon" {...props}>
      {/* header upper */}
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} activeTeam={activeTeam} setActiveTeam={handleSetActiveTeam}/>
      </SidebarHeader>
      {/* middle all the content student teacher admin */}
      <SidebarContent>
        <NavMain items={filteredNavMain} />
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

