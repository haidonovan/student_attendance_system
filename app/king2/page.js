"use client";

import { Button } from "@/components/ui/button";
import { attendanceAdapter } from "@/lib/adapters/dashboard/teacher/attendance/attendanceAdapter";
import { useState } from "react";

export default function TAP() {
  const [classNames, setclassNames] = useState([]);


  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/dashboard/teacher/attendance");
      if (!res.ok) throw new Error("Failed to fetch attendance data");
      const data = await res.json();
      setAttendances(attendanceAdapter(data)); // <-- update state here
      // setStudentNames(attendanceAdapter(data));
      const adaptedData = attendanceAdapter(data);
      const names = adaptedData.map((att) => att.studentName);
      setStudentNames(names);

    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

    const fetchClassName = async () => {
    try {
      const res = await fetch("/api/standby-classes");
      if (!res.ok) throw new Error("Failed to fetch attendance data");
      const data = await res.json();
      setAttendances(attendanceAdapter(data)); // <-- update state here
      // setStudentNames(attendanceAdapter(data));
      const adaptedData = attendanceAdapter(data);
      const names = adaptedData.map((att) => att.studentName);
      setStudentNames(names);

    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  return (
    <div>
      <Button onClick={fetchAttendance}>Fetch Attendance</Button>

      <pre>{attendance ? JSON.stringify(attendance, null, 2) : "No data yet"}</pre>
      <pre>{studentNames.length > 0 ? JSON.stringify(studentNames, null, 2) : "No data name yet!"}</pre>

    </div>
  );
}
