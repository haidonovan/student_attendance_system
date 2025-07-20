"use client";

import { useState } from "react";

export default function StudentCard({ student, onDelete, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(student.name);
  const [major, setMajor] = useState(student.major);

  function handleSave() {
    onUpdate({ name, major });
    setEditMode(false);
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      {editMode ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <input
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)} style={{ marginLeft: 5 }}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2>{student.name}</h2>
          <p>Major: {major}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={onDelete} style={{ marginLeft: 10 }}>
            Delete
          </button>
          <h1>hello fk you soksan</h1>
        </>
      )}
    </div>
  );
}
