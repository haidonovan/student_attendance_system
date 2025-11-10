import { prisma } from '@/lib/prisma';
import { requireAuth } from '../auth-check'; // adjust path if needed

function checkPermission(user) {
  return user && (user.role === 'ADMIN' || user.role === 'TEACHER');
}

// GET /api/teachers
export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  if (!checkPermission(auth.session.user)) {
    return new Response(JSON.stringify({ error: 'Forbidden: Only teachers or admins can access' }), { status: 403 });
  }

  try {
    const teachers = await prisma.teacher.findMany({
      include: { user: true, classes: true },
    });
    return new Response(JSON.stringify(teachers), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch teachers' }), { status: 500 });
  }
}

// POST /api/teachers
export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  if (auth.session.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden: Only admin can create teachers' }), { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId, fullName, subject, bio } = body;

    const teacher = await prisma.teacher.create({
      data: { userId, fullName, subject, bio },
    });

    return new Response(JSON.stringify(teacher), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create teacher' }), { status: 500 });
  }
}
