"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Loader2 } from "lucide-react"

export default function ReportPage() {
  const [reportType, setReportType] = useState("attendance")
  const [standbyClass, setStandbyClass] = useState("")
  const [standbyClasses, setStandbyClasses] = useState([])
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const [classLoading, setClassLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchStandbyClasses()
  }, [])

  useEffect(() => {
    if (standbyClasses.length > 0) {
      fetchReport()
    }
  }, [reportType, standbyClass])

  const fetchStandbyClasses = async () => {
    try {
      setClassLoading(true)
      const response = await fetch("/api/dashboard/admin/standby-class")
      const data = await response.json()

      if (response.ok && data.standbyClasses) {
        setStandbyClasses(data.standbyClasses)
      }
    } catch (err) {
      console.error("[v0] Failed to fetch standby classes:", err)
    } finally {
      setClassLoading(false)
    }
  }

  const fetchReport = async () => {
    try {
      setLoading(true)
      const url = new URL("/api/dashboard/admin/report", window.location.origin)
      url.searchParams.append("type", reportType)
      if (standbyClass) {
        url.searchParams.append("standbyClassId", standbyClass)
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (response.ok && data.data) {
        setReportData(data.data)
      } else {
        console.error("[v0] Failed to fetch report:", data.error)
      }
    } catch (err) {
      console.error("[v0] Error fetching report:", err)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = () => {
    if (reportData.length === 0) return

    // Create CSV content
    const headers =
      reportType === "attendance"
        ? [
            "Student ID",
            "Full Name",
            "Standby Class",
            "Total Classes",
            "Present Days",
            "Absent Days",
            "Late Days",
            "Attendance %",
          ]
        : ["Student ID", "Full Name", "Standby Class", "Attendance %", "Total Classes", "Present Days"]

    const rows = reportData.map((row) =>
      reportType === "attendance"
        ? [
            row.studentId,
            row.fullName,
            row.standbyClass,
            row.totalClasses,
            row.presentDays,
            row.absentDays,
            row.lateDays,
            row.attendancePercentage + "%",
          ]
        : [
            row.studentId,
            row.fullName,
            row.standbyClass,
            row.attendancePercentage + "%",
            row.totalClasses,
            row.presentDays,
          ],
    )

    let csv = headers.join(",") + "\n"
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n"
    })

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const filteredData = reportData.filter(
    (row) =>
      row.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and export student attendance and performance reports</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Student Attendance</SelectItem>
                  <SelectItem value="bestStudents">Best Students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Standby Class</label>
              <Select value={standbyClass} onValueChange={setStandbyClass}>
                <SelectTrigger disabled={classLoading}>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {standbyClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={exportToExcel} disabled={loading || filteredData.length === 0} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </CardContent>
      </Card>

      {/* Report Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>{reportType === "attendance" ? "Student Attendance Report" : "Best Students Report"}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No data available</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-semibold">Student ID</th>
                    <th className="px-4 py-2 text-left font-semibold">Full Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Standby Class</th>
                    {reportType === "attendance" ? (
                      <>
                        <th className="px-4 py-2 text-center font-semibold">Total Classes</th>
                        <th className="px-4 py-2 text-center font-semibold">Present</th>
                        <th className="px-4 py-2 text-center font-semibold">Absent</th>
                        <th className="px-4 py-2 text-center font-semibold">Late</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-2 text-center font-semibold">Total Classes</th>
                        <th className="px-4 py-2 text-center font-semibold">Present Days</th>
                      </>
                    )}
                    <th className="px-4 py-2 text-center font-semibold">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2">{row.studentId}</td>
                      <td className="px-4 py-2 font-medium">{row.fullName}</td>
                      <td className="px-4 py-2">{row.standbyClass}</td>
                      <td className="px-4 py-2 text-center">{row.totalClasses}</td>
                      <td className="px-4 py-2 text-center">{row.presentDays}</td>
                      {reportType === "attendance" && (
                        <>
                          <td className="px-4 py-2 text-center">{row.absentDays}</td>
                          <td className="px-4 py-2 text-center">{row.lateDays}</td>
                        </>
                      )}
                      <td
                        className={`px-4 py-2 text-center font-semibold ${
                          row.attendancePercentage >= 80 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {row.attendancePercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
