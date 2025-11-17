"use client";

import { useState } from "react";

export default function TestAttendance() {
  const [className, setClassName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [attendanceData, setAttendanceData] = useState([
    { studentId: "STU001", date: new Date().toISOString().split("T")[0], status: "PRESENT" },
  ]);
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/test/pagination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className, teacherName, attendanceData }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(err.message);
    }
  };

  const handleAddStudent = () => {
    setAttendanceData([...attendanceData, { studentId: "", date: new Date().toISOString().split("T")[0], status: "ABSENT" }]);
  };

  const handleChangeStudent = (index, key, value) => {
    const updated = [...attendanceData];
    updated[index][key] = value;
    setAttendanceData(updated);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Attendance API</h1>

      <div>
        <label>Class Name: </label>
        <input value={className} onChange={(e) => setClassName(e.target.value)} />
      </div>

      <div>
        <label>Teacher Name: </label>
        <input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
      </div>

      <h3>Attendance Data</h3>
      {attendanceData.map((att, i) => (
        <div key={i} style={{ marginBottom: "0.5rem" }}>
          <input
            placeholder="Student ID"
            value={att.studentId}
            onChange={(e) => handleChangeStudent(i, "studentId", e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="date"
            value={att.date}
            onChange={(e) => handleChangeStudent(i, "date", e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <select
            value={att.status || "ABSENT"}
            onChange={(e) => handleChangeStudent(i, "status", e.target.value)}
          >
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="LATE">LATE</option>
            <option value="EXCUSED">EXCUSED</option>
          </select>
        </div>
      ))}

      <button onClick={handleAddStudent} style={{ marginTop: "0.5rem" }}>
        Add Student
      </button>

      <div>
        <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
          Submit Attendance
        </button>
      </div>

      <pre style={{ marginTop: "1rem", background: "#f0f0f0", padding: "1rem" }}>
        {response}
      </pre>
    </div>
  );
}
