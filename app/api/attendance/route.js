import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const standByClassId = searchParams.get("standByClassId");
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = 10;

    if (!standByClassId) {
      return new Response(
        JSON.stringify({ error: "standByClassId is required" }),
        { status: 400 }
      );
    }

    const students = await prisma.student.findMany({
      where: {
        standbyClassId: standByClassId,
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
        standbyClassId: standByClassId,
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
    console.log("[v0] POST body received:", body);
    const { attendanceData, standByClassId } = body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return new Response(
        JSON.stringify({ error: "attendanceData must be an array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!standByClassId) {
      return new Response(
        JSON.stringify({ error: "standByClassId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const classRecord = await prisma.class.findFirst({
      where: {
        standByClassId: standByClassId,
        date: attendanceData[0]?.date ? new Date(attendanceData[0].date) : new Date(),
      },
      select: { id: true },
    });

    if (!classRecord) {
      return new Response(
        JSON.stringify({ 
          error: "No class record found for this standByClass on the selected date",
          details: "Please ensure the class session exists in the database"
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[v0] Creating attendance records for classId:", classRecord.id);
    
    const createdAttendance = await Promise.all(
      attendanceData.map((record) => {
        console.log("[v0] Saving record:", record);
        return prisma.attendance.create({
          data: {
            studentId: record.studentId,
            classId: classRecord.id,
            date: record.date ? new Date(record.date) : new Date(),
            status: record.status || "ABSENT",
          },
        });
      })
    );

    return new Response(JSON.stringify({ success: true, attendance: createdAttendance }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[v0] POST Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to save attendance",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
