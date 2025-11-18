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

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" }),
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: "File size exceeds 10MB limit" }), { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "student_profiles",
            resource_type: "image",
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    return new Response(
      JSON.stringify({
        success: true,
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
      }),
      { status: 200 }
    )
  } catch (err) {
    console.error("[v0] Upload error:", err)
    return new Response(JSON.stringify({ error: err.message || "Upload failed" }), { status: 500 })
  }
}

























// import { v2 as cloudinary } from "cloudinary"

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// export async function POST(req) {
//   try {
//     const formData = await req.formData()
//     const file = formData.get("file")

//     if (!file) {
//       return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 })
//     }

//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)

//     const uploadRes = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream({ folder: "student_profiles", resource_type: "image" }, (error, result) => {
//           if (error) reject(error)
//           else resolve(result)
//         })
//         .end(buffer)
//     })

//     return new Response(JSON.stringify({ url: uploadRes.secure_url }), { status: 200 })
//   } catch (err) {
//     console.error("Upload error:", err)
//     return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 })
//   }
// }
