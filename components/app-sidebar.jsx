"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    { name: "Admin", role: "ADMIN", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Teacher", role: "TEACHER", logo: AudioWaveform, plan: "Startup" },
    { name: "Student", role: "STUDENT", logo: Command, plan: "Free" },
  ],
  navMain: [
    {
      title: "Teacher",
      role: "TEACHER",
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: "General", url: "/dashboard/teacher" },
        { title: "Check Attendance", url: "/dashboard/teacher/check-attendance" },
        { title: "Class", url: "/dashboard/teacher/class" },
        { title: "Report", url: "/dashboard/teacher/report" },
        { title: "History", url: "/dashboard/teacher/history" },
      ],
    },
    {
      title: "Admin",
      role: "ADMIN",
      url: "#",
      icon: Bot,
      items: [
        { title: "General", url: "/dashboard/admin" },
        { title: "Admin Attendance", url: "/dashboard/admin/attendance" },
        { title: "Teachers", url: "/dashboard/admin/teachers" },
        { title: "Students", url: "/dashboard/admin/students" },
        { title: "Class", url: "/dashboard/admin/class" },
        { title: "Messaging & Alert", url: "/dashboard/admin/messaging" },
        { title: "Reports", url: "/dashboard/admin/reports" },
        { title: "Settings", url: "/dashboard/admin/settings" },
      ],
    },
    {
      title: "Student",
      role: "STUDENT",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "General", url: "/dashboard/student/" },
        { title: "Student Attendance", url: "/dashboard/student/attendance" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
};

export function AppSidebar(props) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTeam, setActiveTeam] = useState(data.teams[0]);
  const [filteredNavMain, setFilteredNavMain] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        console.log("🍀 /api/me response:", json); // 🔹 debug

        if (!res.ok || !json.user) {
          console.warn("No user found, redirecting to login...");
          router.push("/login");
          return;
        }

        const currentUser = json.user;
        setUser(currentUser);

        // Set active team based on role
        const team = data.teams.find(t => t.role === currentUser.role);
        if (team) setActiveTeam(team);

        // Filter menus for this role
        const menus = data.navMain.filter(item => item.role === currentUser.role || item.role === "All");
        setFilteredNavMain(menus);

      } catch (err) {
        console.error("Error fetching user:", err);
        router.push("/login");
      }
    }

    fetchUser();
  }, [router]);

  const handleSetActiveTeam = (team) => {
    setActiveTeam(team);
    router.push(`/dashboard/${team.role.toLowerCase()}`);
  };

  if (!user) return <div>Loading Sidebar...</div>;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[activeTeam]}          // only the team matching user role
          activeTeam={activeTeam}      // already set by role
          setActiveTeam={() => { }}     // do nothing, disable switching
        />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{
          name: user.name,
          email: user.email,
          avatar: user.image || "/avatars/placeholder.jpg",
        }} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
