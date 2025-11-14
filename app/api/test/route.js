import { prisma } from "@/lib/prisma";



export async function GET(req) {
  try {
    const students = await prisma.student.findMany({
      select: {
        fullName: true,
        studentId: true,
      }
    })
    return new Response(JSON.stringify({students}), {status: 200})
  } catch (err){
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error"}), {status: 500});
  }
}