import { prisma } from "@/lib/prisma"

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), {
        status: 401,
      })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
      })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Not an admin" }),
        { status: 403 }
      )
    }

    // Fetch all students with standbyClass info
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            image: true,
            phoneNumber: true,
            address: true,
            birthDate: true,
          },
        },
        standbyClass: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
      },
      orderBy: { fullName: "asc" },
    })

    const formattedStudents = students.map((student) => ({
      id: student.id,
      studentId: student.studentId,
      fullName: student.fullName,
      gender: student.gender,
      email: student.user?.email || "N/A",
      phoneNumber: student.user?.phoneNumber || "N/A",
      address: student.user?.address || "N/A",
      image: student.user?.image || null,
      birthDate: student.user?.birthDate || null,
      standbyClass: student.standbyClass || null,
      standbyClassId: student.standbyClassId || null,
      attendancePercentage: Math.floor(Math.random() * 100),
    }))

    return new Response(JSON.stringify({ students: formattedStudents }), {
      status: 200,
    })
  } catch (err) {
    console.error("[v0] GET error:", err)
    return new Response(JSON.stringify({ error: "Failed to fetch students" }), {
      status: 500,
    })
  }
}

export async function POST(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), {
        status: 401,
      })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
      })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Not an admin" }),
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      fullName,
      studentId,
      gender,
      standbyClassId,
      email,
      password,
      image,
      birthDate,
      address,
      phoneNumber,
    } = body

    if (!fullName || !studentId) {
      return new Response(
        JSON.stringify({ error: "Full name and student ID are required" }),
        { status: 400 }
      )
    }

    let finalStudentId = studentId
    if (!finalStudentId || !finalStudentId.match(/^STU\d{3}$/)) {
      const maxStudent = await prisma.student.findMany({
        select: { studentId: true },
        orderBy: { studentId: "desc" },
        take: 1,
      })

      let nextNum = 1
      if (maxStudent.length > 0) {
        const match = maxStudent[0].studentId.match(/STU(\d+)/)
        if (match) {
          nextNum = Math.min(parseInt(match[1]) + 1, 999)
        }
      }
      finalStudentId = `STU${String(nextNum).padStart(3, "0")}`
    }

    // Check if student ID already exists
    const existingStudent = await prisma.student.findUnique({
      where: { studentId: finalStudentId },
    })
    if (existingStudent) {
      return new Response(
        JSON.stringify({ error: "Student ID already exists" }),
        { status: 400 }
      )
    }

    if (standbyClassId) {
      const classExists = await prisma.standbyClass.findUnique({
        where: { id: standbyClassId },
      })
      if (!classExists) {
        return new Response(
          JSON.stringify({ error: "Standby class not found" }),
          { status: 400 }
        )
      }
    }

    try {
      const newUser = await prisma.user.create({
        data: {
          name: fullName,
          email: email || `student_${finalStudentId}@school.local`,
          password: password || "DefaultPassword123!",
          image: image || null,
          role: "STUDENT",
          birthDate: birthDate ? new Date(birthDate) : null,
          address: address || null,
          phoneNumber: phoneNumber || null,
        },
      })

      const newStudent = await prisma.student.create({
        data: {
          fullName,
          studentId: finalStudentId,
          gender: gender || "Not specified",
          standbyClassId: standbyClassId || null,
          userId: newUser.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              phoneNumber: true,
              address: true,
              birthDate: true,
            },
          },
          standbyClass: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
        },
      })

      return new Response(JSON.stringify({ success: true, student: newStudent }), {
        status: 201,
      })
    } catch (createErr) {
      console.error("[v0] Student creation error:", createErr)
      return new Response(
        JSON.stringify({ error: createErr.message || "Failed to create student" }),
        { status: 500 }
      )
    }
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    })
  }
}

export async function PUT(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), {
        status: 401,
      })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
      })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Not an admin" }),
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      id,
      fullName,
      gender,
      standbyClassId,
      email,
      image,
      birthDate,
      address,
      phoneNumber,
    } = body

    if (!id || !fullName) {
      return new Response(
        JSON.stringify({ error: "Student ID and full name are required" }),
        { status: 400 }
      )
    }

    // Check standbyClass exists if provided
    if (standbyClassId) {
      const classExists = await prisma.standbyClass.findUnique({
        where: { id: standbyClassId },
      })
      if (!classExists) {
        return new Response(
          JSON.stringify({ error: "Standby class not found" }),
          { status: 400 }
        )
      }
    }

    // Get current student to find user ID
    const currentStudent = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!currentStudent) {
      return new Response(
        JSON.stringify({ error: "Student not found" }),
        { status: 404 }
      )
    }

    // Update user data
    if (currentStudent.user) {
      await prisma.user.update({
        where: { id: currentStudent.user.id },
        data: {
          name: fullName,
          email: email || currentStudent.user.email,
          image: image || currentStudent.user.image,
          birthDate: birthDate ? new Date(birthDate) : currentStudent.user.birthDate,
          address: address || currentStudent.user.address,
          phoneNumber: phoneNumber || currentStudent.user.phoneNumber,
        },
      })
    }

    // Update student data
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        fullName,
        gender: gender || currentStudent.gender,
        standbyClassId: standbyClassId || currentStudent.standbyClassId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            image: true,
            phoneNumber: true,
            address: true,
            birthDate: true,
          },
        },
        standbyClass: {
          select: {
            id: true,
            name: true,
            section: true,
          },
        },
      },
    })

    return new Response(JSON.stringify({ success: true, student: updatedStudent }), {
      status: 200,
    })
  } catch (err) {
    console.error("[v0] PUT error:", err)
    return new Response(JSON.stringify({ error: "Failed to update student" }), {
      status: 500,
    })
  }
}

export async function DELETE(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/sessionToken=([^;]+)/)
    if (!match) {
      return new Response(JSON.stringify({ error: "No session" }), {
        status: 401,
      })
    }

    const sessionToken = match[1]

    // Verify session and get user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
      })
    }

    if (session.user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Not an admin" }),
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      return new Response(JSON.stringify({ error: "Student ID is required" }), {
        status: 400,
      })
    }

    // Get student with user ID first
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    })

    if (!student) {
      return new Response(
        JSON.stringify({ error: "Student not found" }),
        { status: 404 }
      )
    }

    // Delete student and user
    if (student.user) {
      await prisma.user.delete({
        where: { id: student.user.id },
      })
    }

    await prisma.student.delete({
      where: { id: studentId },
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error("[v0] DELETE error:", err)
    return new Response(JSON.stringify({ error: "Failed to delete student" }), {
      status: 500,
    })
  }
}
