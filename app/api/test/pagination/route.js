import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ClassName = searchParams.get("className"); // can be name now
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = 10;

    if (!ClassName) {
      return new Response(
        JSON.stringify({ error: "standByClassId is required" }),
        { status: 400 }
      );
    }

    const students = await prisma.student.findMany({
      where: {
        standbyClass: {
          name: ClassName,
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        fullName: true,
        studentId: true,
      },
    });

    const totalStudents = await prisma.student.count({
      where: {
        standbyClass: {
          name: ClassName,
        }
      },
    });

    return new Response(
      JSON.stringify({
        students,
        pagination: {
          page,
          pageSize,
          totalStudents,
          totalPages: Math.ceil(totalStudents / pageSize),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[v0] GET Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch students",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { attendanceData, teacherName, className } = body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return new Response(
        JSON.stringify({ error: "attendanceData must be an array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!className) {
      return new Response(
        JSON.stringify({ error: "className is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1️⃣ Ensure StandbyClass exists
    const standbyClass = await prisma.standbyClass.findUnique({
      where: { name: className },
    });

    // Ensure Teacher exists
    const teacher = await prisma.teacher.findFirst({
      where: { fullName: teacherName },
    });

    if (!standbyClass) {
      return new Response(
        JSON.stringify({ error: "Standby class not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!teacher) {
      return new Response(
        JSON.stringify({ error: "Teacher not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2️⃣ ALWAYS create a new Class for this attendance submission
    const classRecord = await prisma.class.create({
      data: {
        name: className,
        year: new Date().getFullYear(),
        teacherId: teacher.id,
        standbyClassId: standbyClass.id,
      },
    });

    // 3️⃣ Ensure all students exist
    const studentIds = attendanceData.map(r => r.studentId);
    const studentsInDB = await prisma.student.findMany({
      where: { studentId: { in: studentIds } },
    });

    if (studentsInDB.length !== studentIds.length) {
      const missing = studentIds.filter(
        id => !studentsInDB.some(s => s.studentId === id)
      );
      return new Response(
        JSON.stringify({ error: "Some students not found", missing }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4️⃣ Map studentId to actual DB id
    const studentMap = Object.fromEntries(
      studentsInDB.map(s => [s.studentId, s.id])
    );

    // 5️⃣ Create attendance and link students to class
    const savedRecords = [];
    for (const record of attendanceData) {
      const studentDbId = studentMap[record.studentId];

      // Create attendance
      const attendance = await prisma.attendance.create({
        data: {
          studentId: studentDbId,
          classId: classRecord.id,
          date: new Date(record.date),
          status: record.status || "ABSENT",
        },
      });
      savedRecords.push(attendance);

      // Update student to link to the new class
      await prisma.student.update({
        where: { id: studentDbId },
        data: { classId: classRecord.id },
      });
    }

    return new Response(
      JSON.stringify({ success: true, class: classRecord, attendance: savedRecords }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[v0] POST Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to save attendance",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
