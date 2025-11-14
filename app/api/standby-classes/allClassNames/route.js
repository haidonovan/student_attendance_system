import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const classNames = await prisma.standbyClass.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return new Response(JSON.stringify(classNames), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[v0] Error fetching class names:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch standby classes",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
