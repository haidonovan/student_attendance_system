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
    const { attendanceData, classId: standbyClassId } = body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return new Response(
        JSON.stringify({ error: "attendanceData must be an array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!standbyClassId) {
      return new Response(
        JSON.stringify({ error: "standbyClassId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1️⃣ Ensure Class exists for this StandbyClass
    let classRecord = await prisma.class.findFirst({
      where: { standbyClass: standbyClassId }
    });

    if (!classRecord) {
      // Get standby class info for naming
      const standbyClass = await prisma.standbyClass.findUnique({
        where: { id: standbyClassId },
      });

      if (!standbyClass) {
        return new Response(
          JSON.stringify({ error: "Standby class not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      classRecord = await prisma.class.create({
        data: {
          name: standbyClass.name,        // copy standby class name
          year: new Date().getFullYear(), // or use standbyClass.year if available
          standbyClassId: standbyClass.id,
          // teacherId: optional if needed
        },
      });
    }

    // 2️⃣ Save attendance
    const savedRecords = await Promise.all(
      attendanceData.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {  // matches your @@unique([studentId, date])
              studentId: record.studentId,
              date: new Date(record.date),
            },
          },
          update: {
            status: record.status || "ABSENT",
          },
          create: {
            studentId: record.studentId,
            classId: classRecord.id,   // use the class id ensured above
            date: new Date(record.date),
            status: record.status || "ABSENT",
          },
        })
      )
    );

    return new Response(
      JSON.stringify({ success: true, attendance: savedRecords }),
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
