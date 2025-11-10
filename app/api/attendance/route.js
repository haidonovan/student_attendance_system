// app/api/attendance/route.js
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../auth-check';

export async function GET(req) {
  try {
    const { session, error, status } = await requireAuth();
    if (error) {
      return new Response(JSON.stringify({ error }), { status });
    }

    // Fetch user with profiles
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { studentProfile: true, teacherProfile: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    let where = {};

    // STUDENT can only see their own attendance
    if (user.role === 'STUDENT') {
      if (!user.studentProfile) {
        return new Response(JSON.stringify({ error: 'No student profile found' }), { status: 403 });
      }
      where.studentId = user.studentProfile.id;
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        student: { include: { user: true, class: true } },
        class: true,
      },
      orderBy: { date: 'desc' },
    });

    return new Response(JSON.stringify(attendanceRecords), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST, PUT, DELETE (Teacher/Admin only)
export async function POST(req) {
  try {
    const { session, error, status } = await requireAuth();
    if (error) return new Response(JSON.stringify({ error }), { status });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const body = await req.json();
    const { classId, records, date } = body;

    if (!classId || !records || !Array.isArray(records)) {
      return new Response(JSON.stringify({ error: 'classId, date, and records array are required' }), { status: 400 });
    }

    const recordDate = date ? new Date(date) : new Date();
    const results = [];

    for (const rec of records) {
      const { studentId, status } = rec;
      if (!studentId || !status) continue;

      const attendance = await prisma.attendance.upsert({
        where: { studentId_date: { studentId, date: recordDate } },
        update: { status },
        create: { studentId, classId, date: recordDate, status },
        include: { student: { include: { user: true, class: true } }, class: true },
      });

      results.push(attendance);
    }

    return new Response(JSON.stringify(results), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Similar logic can be added to PUT / DELETE with role check
