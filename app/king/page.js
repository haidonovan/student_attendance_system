"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Users, Search, Save } from "lucide-react"

// Example attendance options
const attendanceOptions = [
  { value: "PRESENT", label: "Present", shortLabel: "P", icon: Users, bg: "bg-green-500", color: "text-white", hoverBg: "hover:bg-green-600" },
  { value: "ABSENT", label: "Absent", shortLabel: "A", icon: Users, bg: "bg-red-500", color: "text-white", hoverBg: "hover:bg-red-600" },
  { value: "LATE", label: "Late", shortLabel: "L", icon: Users, bg: "bg-yellow-500", color: "text-white", hoverBg: "hover:bg-yellow-600" },
]

export default function AttendanceCard({ selectedClass, selectedDate }) {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Filter students based on search term
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Fetch students when class changes
  useEffect(() => {
    if (!selectedClass) return
    setLoading(true)
    setError(null)

    const fetchStudents = async () => {
      try {
        const res = await fetch(`/api/classes/${selectedClass}/students?page=${currentPage}`)
        const data = await res.json()
        setStudents(data.students)
        setTotalPages(data.totalPages || 1)
        setAttendance({}) // reset attendance when class changes
      } catch (err) {
        console.error(err)
        setError("Failed to fetch students")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [selectedClass, currentPage])

  // Handle attendance button click
  const handleAttendanceChange = (studentId, value) => {
    setAttendance(prev => ({ ...prev, [studentId]: value }))
  }

  // Handle save attendance
  const handleSaveAttendance = async () => {
    try {
      const payload = {
        classId: selectedClass,
        date: selectedDate,
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      }

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save attendance")
      alert("Attendance saved successfully!")
    } catch (err) {
      console.error(err)
      alert("Error saving attendance")
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
              <Users className="w-5 h-5" /> Student Attendance
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
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{student.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ID: {student.rollNo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      {attendanceOptions.map(option => {
                        const Icon = option.icon
                        const isSelected = attendance[student.id] === option.value
                        return (
                          <Button
                            key={option.value}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAttendanceChange(student.id, option.value)}
                            className={`h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-0 ${
                              isSelected
                                ? `${option.bg} ${option.color} border-transparent ${option.hoverBg}`
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            title={option.label}
                          >
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="ml-1 hidden md:inline">{option.shortLabel}</span>
                            <span className="ml-1 hidden lg:inline">{option.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Object.keys(attendance).length} of {filteredStudents.length} students marked
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
                  size="sm"
                  onClick={handleSaveAttendance}
                >
                  <Save className="w-4 h-4 mr-2" /> Save Attendance
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

























































// "use client"

// import { useEffect, useState } from "react"

// export default function KingPage() {
//   const [subject, setSubject] = useState("")

//   useEffect(() => {
//     const fetchSubject = async () => {
//       try {
//         const res = await fetch("/api/dashboard/teacher/subject")
//         const data = await res.json()
//         setSubject(data.subject) // just the string
//       } catch (err) {
//         console.error("Failed to fetch subject:", err)
//       }
//     }

//     fetchSubject()
//   }, [])

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-2">Teacher Subject</h1>
//       <p>{subject || "No subject assigned yet"}</p>
//     </div>
//   )
// }
