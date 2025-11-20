// app/api/dashboard/teacher/notification/route.js
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        // ---------------------------
        // 1. AUTH: Get teacher user
        // ---------------------------
        // const cookie = req.headers.get("cookie") || "";
        // const match = cookie.match(/sessionToken=([^;]+)/);

        // if (!match) {
        //     return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        // }

        // const sessionToken = match[1];
        // const session = await prisma.session.findUnique({
        //     where: { sessionToken },
        //     include: { user: true },
        // });

        // if (session.user.role !== "TEACHER") {
        //     return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        // }


        // if (!session || new Date(session.expires) < new Date()) {
        //     return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 });


        // }

        // const teacherUser = session.user;
        // console.log("teacher User DEBUG", teacherUser)

        // ---------------------------
        // 2. Read POST body
        // ---------------------------
        const body = await req.json();
        const { studentId, message } = body;

        if (!studentId || !message) {
            return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
        }

        // ---------------------------
        // 3. Find ADMIN user
        // ---------------------------
        const admin = await prisma.user.findFirst({
            where: { role: "ADMIN" },
        });

        // if (!admin) {
        //     return new Response(
        //         JSON.stringify({ error: "No admin account found" }),
        //         { status: 500 }
        //     );
        // }

        // ---------------------------
        // 4. Create Notification
        // ---------------------------
        const notif = await prisma.notification.create({
            data: {
                userId: admin.id,      // notification sent TO admin
                message,
                type: "ABSENT",
                read: false,
            },
        });

        return new Response(JSON.stringify({ notification: notif }), { status: 201 });
    } catch (error) {
        console.error("[NOTIF ERROR]", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
