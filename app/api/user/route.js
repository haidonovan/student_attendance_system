// app/api/users/route.js
import { prisma } from "@/lib/prisma";
import { requireAuth } from "../auth-check"; // adjust path if needed

// Helper: only allow TEACHER or ADMIN
function checkUserPermission(user) {
  return user && (user.role === "ADMIN" || user.role === "TEACHER");
}

// GET all users
export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  const user = await prisma.user.findUnique({ 
    where: { id: auth.session.userId } 
  });

  if (!checkUserPermission(user)) {
    return new Response(JSON.stringify({ error: "Forbidden: Only teachers or admins can view users" }), { status: 403 });
  }

  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST create users
export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  const user = await prisma.user.findUnique({ 
    where: { id: auth.session.userId } 
  });

  if (!checkUserPermission(user)) {
    return new Response(JSON.stringify({ error: "Forbidden: Only teachers or admins can create users" }), { status: 403 });
  }

  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      for (const u of body) {
        if (!u.name || !u.email || !u.password) {
          return new Response(JSON.stringify({ error: 'Each user must have name, email, and password' }), { status: 400 });
        }
      }

      const newUsers = await prisma.user.createMany({
        data: body.map(u => ({
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role || 'STUDENT',
        })),
        skipDuplicates: true,
      });

      return new Response(JSON.stringify(newUsers), { status: 201 });
    } else {
      const { name, email, password, role } = body;
      if (!name || !email || !password) {
        return new Response(JSON.stringify({ error: 'Name, email, and password are required' }), { status: 400 });
      }

      const newUser = await prisma.user.create({
        data: { name, email, password, role: role || 'STUDENT' },
      });

      return new Response(JSON.stringify(newUser), { status: 201 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
