import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const standbyClasses = await prisma.standbyClass.findMany({
      include: {
        students: {
          select: {
            id: true,
            fullName: true,
            studentId: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(standbyClasses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[v0] Error fetching standby classes:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch standby classes",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
