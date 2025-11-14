// app/api/standby-classes/students

import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("name"); // optional

    // If name param exists, filter by class
    let students;

    if (className) {
      students = await prisma.student.findMany({
        where: { standbyClass: { name: className } },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
              phoneNumber: true,
              birthDate: true,
              address: true,
            },
          },
        },
      });
    } else {
      students = await prisma.student.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
              phoneNumber: true,
              birthDate: true,
              address: true,
            },
          },
        },
      });
    }

    // Flatten user info into student object
    const result = students.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      studentId: s.studentId,
      gender: s.gender,
      email: s.user.email,
      role: s.user.role,
      image: s.user.image,
      phoneNumber: s.user.phoneNumber,
      birthDate: s.user.birthDate,
      address: s.user.address,
    }));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch students", details: err.message }),
      { status: 500 }
    );
  }
}
