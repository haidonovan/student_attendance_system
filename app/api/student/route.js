import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../auth-check';

// GET all students
export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  const user = auth.session.user;

  try {
    let students;
    if (user.role === 'ADMIN' || user.role === 'TEACHER') {
      students = await prisma.student.findMany({
        include: { user: true, class: true }
      });
    } else if (user.role === 'STUDENT') {
      const studentProfile = await prisma.student.findUnique({
        where: { userId: user.id },
        include: { user: true, class: true }
      });
      if (!studentProfile) return new Response(JSON.stringify({ error: 'No student profile found' }), { status: 403 });
      students = [studentProfile];
    } else {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST create student(s)
export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  if (auth.session.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden: Only admin can create students' }), { status: 403 });
  }

  try {
    const body = await req.json();
    const studentsArray = Array.isArray(body) ? body : [body];
    const createdStudents = [];

    for (const s of studentsArray) {
      const { userId, fullName, birthDate, studentId, gender, address, classId } = s;

      if (!userId || !fullName || !birthDate || !studentId || !gender) {
        return new Response(JSON.stringify({ error: 'Missing required fields for each student' }), { status: 400 });
      }

      const student = await prisma.student.create({
        data: {
          userId,
          fullName,
          birthDate: new Date(birthDate),
          studentId,
          gender,
          address,
          classId
        },
        include: { user: true, class: true }
      });

      createdStudents.push(student);
    }

    return new Response(JSON.stringify(createdStudents), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
