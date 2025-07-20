"use client";

import { useEffect, useState } from "react";
import StudentCard from "./StudentCard";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // For adding a new student
  const [newName, setNewName] = useState("");
  const [newMajor, setNewMajor] = useState("");

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Add new student
  async function handleAddStudent(e) {
    e.preventDefault();
    if (!newName.trim() || !newMajor.trim()) return;

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, major: newMajor }),
      });
      if (!res.ok) throw new Error("Failed to add student");
      const addedStudent = await res.json();
      setStudents([...students, addedStudent]);
      setNewName("");
      setNewMajor("");
    } catch (err) {
      console.error(err);
    }
  }

  // Delete student
  async function handleDeleteStudent(id) {
    try {
      const res = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete student");
      setStudents(students.filter((student) => student._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  // Update student
  async function handleUpdateStudent(id, updatedFields) {
    try {
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updatedFields }),
      });
      if (!res.ok) throw new Error("Failed to update student");
      setStudents(
        students.map((student) =>
          student._id === id ? { ...student, ...updatedFields } : student
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p>Loading students...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Student List</h1>

      {/* Form to add new student */}
      <form onSubmit={handleAddStudent} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Major"
          value={newMajor}
          onChange={(e) => setNewMajor(e.target.value)}
          required
          style={{ marginRight: 10 }}
        />
        <button type="submit">Add Student</button>
      </form>

      {/* List students */}
      {students.map((student) => (
        <StudentCard
          key={student._id}
          student={student}
          onDelete={() => handleDeleteStudent(student._id)}
          onUpdate={(updatedFields) =>
            handleUpdateStudent(student._id, updatedFields)
          }
        />
      ))}
    </div>
  );
}
