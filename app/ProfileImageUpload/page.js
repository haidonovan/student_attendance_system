


"use client";
import { useState } from "react";

export default function ProfileImageUpload() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/profile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (data.url) {
      setImage(data.url);
      alert("Upload successful!");
    } else {
      alert("Upload failed!");
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" onChange={handleUpload} accept="image/*" />
      {uploading && <p>Uploading...</p>}
      {image && <img src={image} alt="Profile" className="w-32 h-32 rounded-full" />}
    </div>
  );
}
