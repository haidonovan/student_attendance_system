"use client"

import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import { Users, Search, Save, RefreshCw, CheckCircle, XCircle, AlertTriangle, UserCheck, Timer, GraduationCap, Download } from 'lucide-react'

export default function CheckAttendancePage() {
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
    const [selectedSession, setSelectedSession] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [attendance, setAttendance] = useState({})

    const [classNames, setClassNames] = useState([])
    const [students, setStudents] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [teacherSubject, setTeacherSubject] = useState("")
    const [teacherName, setTeacherName] = useState("");
    const [userId, setUserId] = useState("");

    const [allStudents, setAllStudents] = useState([]);



    useEffect(() => {
        const fetchClassNames = async () => {
            try {
                const res = await fetch("/api/standby-classes/allClassNames")
                if (!res.ok) throw new Error("Failed to fetch class names")
                const data = await res.json()
                setClassNames(data)
                // console.log("Set class name: ", classNames)
            } catch (error) {
                console.error("Error fetching class names:", error)
                setError(error.message)
            }
        }

        fetchClassNames()
    }, [])

    // useEffect(() => {
    //     const fetchTeacherName = async () => {
    //         try {
    //             const res = await fetch("/api/me", { method: "GET" });
    //             if (!res.ok) throw new Error("Failed to fetch class names")
    //             const data = await res.json();

    //             setTeacherName(data.user.id);
    //             // console.log("Teacher Name: ", data.user.name, " test: ", teacherName)
    //         } catch (error) {
    //             console.error(`Error fetching teacher name: ${error}`);
    //         }
    //     };

    //     fetchTeacherName();

    // }, [teacherName])


    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await fetch("/api/me", { method: "GET" });
                if (!res.ok) throw new Error("Failed to fetch class names")
                const data = await res.json();

                setUserId(data.user.id);
                console.log("User ID : ", data.user.id, " test: ", userId)
            } catch (error) {
                console.error(`Error fetching teacher name: ${error}`);
            }
        };

        fetchUserId();

    }, [userId])

    useEffect(() => {
        const fetchTeacherSubject = async () => {
            try {
                const res = await fetch("/api/dashboard/teacher/subject")
                const data = await res.json()
                setTeacherSubject(data.subject)
            } catch (error) {
                console.error(" Error fetching subject:", error)
            }
        }

        fetchTeacherSubject()
    }, [])

    const sections = [
        { id: "1", name: "7:00 AM - 8:30 AM" },
        { id: "2", name: "9:00 AM - 10:30 AM" },
        { id: "3", name: "1:00 PM - 2:30 PM" },
        { id: "4", name: "2:00 PM - 3:30 PM" },
        { id: "5", name: "6:00 PM - 7:30 PM" },
        { id: "6", name: "7:45 PM - 9:15 PM" },
    ]

    useEffect(() => {
        if (selectedClass) {
            setAllStudents([]); // reset for new class
            fetchStudents(1)
        }
    }, [selectedClass, selectedSession])

    const fetchStudents = async (page = 1) => {
        try {
            setLoading(true)
            setError("")
            // console.log("selected Class: ", selectedClass, " | page: ", page)
            const response = await fetch(
                `/api/dashboard/teacher/attendance?className=${selectedClass}&page=${page}`
            )
            if (!response.ok) throw new Error("Failed to fetch students")
            const data = await response.json()
            setStudents(data.students)

            // Merge new students into allStudents
            setAllStudents((prev) => {
                const ids = new Set(prev.map(s => s.studentId));
                const newStudents = data.students.filter(s => !ids.has(s.studentId));
                return [...prev, ...newStudents];
            });

            setCurrentPage(page)
            setTotalPages(data.pagination.totalPages)
            // setAttendance({})
        } catch (err) {
            setError(err.message)
            console.error("[v0] Error fetching students:", err)
        } finally {
            setLoading(false)
        }
    }

    const attendanceOptions = [
        {
            value: "PRESENT",
            label: "Present",
            shortLabel: "✓",
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/20",
            hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/30",
        },
        {
            value: "EXCUSED",
            label: "Permission",
            shortLabel: "P",
            icon: UserCheck,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/20",
            hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
        },
        {
            value: "LATE",
            label: "Late",
            shortLabel: "L",
            icon: Timer,
            color: "text-yellow-600",
            bg: "bg-yellow-100 dark:bg-yellow-900/20",
            hoverBg: "hover:bg-yellow-50 dark:hover:bg-yellow-900/30",
        },
        {
            value: "ABSENT",
            label: "Absent",
            shortLabel: "A",
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-100 dark:bg-red-900/20",
            hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/30",
        },
    ]

    const handleAttendanceChange = (studentId, value) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: value,
        }))
    }

    const handleSaveAttendance = async () => {
        try {
            const attendanceData = Object.keys(attendance).map(studentId => ({
                studentId,
                status: attendance[studentId] || "ABSENT",
                date: selectedDate
            }));


            console.log(`ClassName: ${selectedClass} | User ID: ${userId} | attendance: ${JSON.stringify(attendanceData)}`);

            const response = await fetch("/api/dashboard/teacher/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    className: selectedClass, // ✅ must match backend
                    userId: userId,
                    attendanceData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(`Error: ${data.error || "Unknown error"}`);
            } else {
                console.log("Attendance submitted successfully!");
                console.log("Response:", data);
            }

            if (!response.ok) throw new Error("Failed to save attendance")
            alert("Attendance saved successfully!")
            // setAttendance({})
            fetchStudents(currentPage)
        } catch (err) {
            setError(err.message)
            console.error("[v0] Error saving attendance:", err)
        }
    }

    const filteredStudents = students.filter(
        (student) =>
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getAttendanceSummary = () => {
        const total = allStudents.length;
        const present = Object.values(attendance).filter(a => a === "PRESENT").length;
        const absent = Object.values(attendance).filter(a => a === "ABSENT").length;
        const late = Object.values(attendance).filter(a => a === "LATE").length;
        const excused = Object.values(attendance).filter(a => a === "EXCUSED").length;
        const unmarked = total - Object.keys(attendance).length;

        return { total, present, absent, late, excused, unmarked };
    };


    const summary = getAttendanceSummary()

    return (
        <SidebarProvider>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 px-3 sm:px-4">
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
                                    <BreadcrumbPage className="text-gray-900 dark:text-white">Check Attendance</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="px-3 sm:px-4">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-950">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Check Attendance</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                                Mark student attendance for class sessions
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm"
                                onClick={() => fetchStudents(currentPage)}
                            >
                                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Refresh</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-xs sm:text-sm"
                            >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </div>
                    </div>

                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
                                <GraduationCap className="w-5 h-5" />
                                Session Details
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                                Select class, subject, and session to mark attendance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="class" className="text-gray-700 dark:text-gray-300 text-sm">
                                        Class
                                    </Label>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10">
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            {classNames.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.name} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300 text-sm">
                                        Subject
                                    </Label>
                                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10">
                                            <SelectValue placeholder={teacherSubject || "NO DATA"} />
                                        </SelectTrigger>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 text-sm">
                                        Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10"
                                    />
                                </div>

                                {/* <div className="space-y-2">
                                    <Label htmlFor="session" className="text-gray-700 dark:text-gray-300 text-sm">
                                        Time Slot
                                    </Label>
                                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10">
                                            <SelectValue placeholder="Select time slot" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            {sections.map((section) => (
                                                <SelectItem
                                                    key={section.id}
                                                    value={section.id}
                                                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {section.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Summary */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</span>
                                </div>
                                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Present</span>
                                </div>
                                <div className="text-lg sm:text-2xl font-bold text-green-600">{summary.present}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Absent</span>
                                </div>
                                <div className="text-lg sm:text-2xl font-bold text-red-600">{summary.absent}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Late</span>
                                </div>
                                <div className="text-lg sm:text-2xl font-bold text-yellow-600">{summary.late}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Permission</span>
                                </div>
                                <div className="text-lg sm:text-2xl font-bold text-blue-600">{summary.excused}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Unmarked</span>
                                </div>
                                <div className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-400">{summary.unmarked}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Student List */}
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
                                        <Users className="w-5 h-5" />
                                        Student Attendance
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                                        Mark attendance for each student in the selected session
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="Search students..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 w-full sm:w-64 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading && <p className="text-center text-gray-500">Loading students...</p>}
                            {error && <p className="text-center text-red-500">{error}</p>}
                            {!loading && !error && (
                                <>
                                    <div className="space-y-3 sm:space-y-4">
                                        {filteredStudents.map((student) => (
                                            <div
                                                key={student.id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                                                        {student.fullName.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                                            {student.fullName}
                                                        </h3>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                                ID: {student.studentId}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        {attendanceOptions.map((option) => {
                                                            const Icon = option.icon
                                                            const isSelected = attendance[student.studentId] === option.value
                                                            return (
                                                                <Button
                                                                    key={option.value}
                                                                    variant={isSelected ? "default" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => handleAttendanceChange(student.studentId, option.value)}
                                                                    className={`
                                    h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-0
                                    ${isSelected
                                                                            ? `${option.bg} ${option.color} border-transparent ${option.hoverBg}`
                                                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                                        }
                                  `}
                                                                    title={option.label}
                                                                >
                                                                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    <span className="ml-1 hidden md:inline">{option.shortLabel}</span>
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Page {currentPage} of {totalPages} ({Object.keys(attendance).length} of {filteredStudents.length}{" "}
                                            marked)
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fetchStudents(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                                            >
                                                Previous
                                            </Button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={page === currentPage ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => fetchStudents(page)}
                                                    className={
                                                        page === currentPage
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                                                    }
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fetchStudents(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {Object.keys(attendance).length} of {filteredStudents.length} students marked
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* <Button
                                                variant="outline"
                                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
                                                size="sm"
                                            >
                                                Save as Draft
                                            </Button> */}
                                            <Button
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                                size="sm"
                                                onClick={handleSaveAttendance}
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Attendance
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
