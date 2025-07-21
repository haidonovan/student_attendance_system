 // adjust relative path from /app/api/sword
import { PrismaClient } from "@/lib/generated/prisma/index";



const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const swords = await prisma.sword.findMany();
    return new Response(JSON.stringify(swords), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch swords' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
