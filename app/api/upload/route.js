import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "student_profiles", resource_type: "image" }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(buffer)
    })

    return new Response(JSON.stringify({ url: uploadRes.secure_url }), { status: 200 })
  } catch (err) {
    console.error("Upload error:", err)
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 })
  }
}
