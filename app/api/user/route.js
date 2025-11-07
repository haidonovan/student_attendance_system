import { prisma } from '../../../lib/prisma' // adjust path if needed

// GET all users (optional)
export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return new Response(JSON.stringify(users), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

// POST create single or multiple users
export async function POST(req) {
  try {
    const body = await req.json()

    if (Array.isArray(body)) {
      // multiple users
      for (const user of body) {
        if (!user.name || !user.email || !user.password) {
          return new Response(JSON.stringify({ error: 'Each user must have name, email, and password' }), { status: 400 })
        }
      }

      const newUsers = await prisma.user.createMany({
        data: body.map(u => ({
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role || 'STUDENT',
        })),
        skipDuplicates: true, // skip existing emails
      })

      return new Response(JSON.stringify(newUsers), { status: 201 })

    } else {
      // single user
      const { name, email, password, role } = body

      if (!name || !email || !password) {
        return new Response(JSON.stringify({ error: 'Name, email, and password are required' }), { status: 400 })
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
          role: role || 'STUDENT',
        },
      })

      return new Response(JSON.stringify(newUser), { status: 201 })
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
