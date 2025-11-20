// app/api/notifications/route.js
import { prisma } from "@/lib/prisma";

// ================================
// GET — Fetch all notifications
// ================================
export async function GET(req) {
  try {
    console.log("[NOTIF GET] Fetching notifications...");
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log("[NOTIF GET] Found", notifications.length, "notifications");
    return new Response(JSON.stringify({ notifications }), { status: 200 });
  } catch (err) {
    console.error("[NOTIF GET]", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}

// ================================
// PUT — Update a notification (check / read)
// ================================
export async function PUT(req) {
  try {
    console.log("[NOTIF PUT] Incoming request...");

    const cookie = req.headers.get("cookie") || "";
    console.log("[NOTIF PUT] Cookie:", cookie);

    const match = cookie.match(/sessionToken=([^;]+)/);
    if (!match) {
      console.warn("[NOTIF PUT] No session token found in cookie");
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 });
    }

    const sessionToken = match[1];
    console.log("[NOTIF PUT] Session token:", sessionToken);

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || new Date(session.expires) < new Date()) {
      console.warn("[NOTIF PUT] Session invalid or expired");
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 });
    }

    const user = session.user;
    console.log("[NOTIF PUT] User:", user.id, user.email);

    const body = await req.json();
    console.log("[NOTIF PUT] Body received:", body);

    const { notificationId, check } = body;
    if (!notificationId) {
      console.warn("[NOTIF PUT] notificationId missing");
      return new Response(JSON.stringify({ error: "notificationId required" }), { status: 400 });
    }

    const notif = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notif) {
      console.warn("[NOTIF PUT] Notification not found");
      return new Response(JSON.stringify({ error: "Notification not found" }), { status: 404 });
    }

    console.log("[NOTIF PUT] Updating notification", notificationId);

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        check: typeof check === "boolean" ? check : !notif.check,
      },
    });

    console.log("[NOTIF PUT] Notification updated:", updated);
    return new Response(JSON.stringify({ notification: updated }), { status: 200 });
  } catch (err) {
    console.error("[NOTIF PUT]", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}

// ================================
// DELETE — Remove a notification
// ================================
export async function DELETE(req) {
  try {
    console.log("[NOTIF DELETE] Incoming request...");

    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/sessionToken=([^;]+)/);
    if (!match) {
      console.warn("[NOTIF DELETE] No session token found");
      return new Response(JSON.stringify({ error: "No session" }), { status: 401 });
    }

    const sessionToken = match[1];
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || new Date(session.expires) < new Date()) {
      console.warn("[NOTIF DELETE] Session invalid or expired");
      return new Response(JSON.stringify({ error: "Session expired" }), { status: 401 });
    }

    const user = session.user;
    console.log("[NOTIF DELETE] User:", user.id, user.email);

    const body = await req.json();
    const { notificationId } = body;
    if (!notificationId) {
      console.warn("[NOTIF DELETE] notificationId missing");
      return new Response(JSON.stringify({ error: "notificationId required" }), { status: 400 });
    }

    const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif) {
      console.warn("[NOTIF DELETE] Notification not found");
      return new Response(JSON.stringify({ error: "Notification not found" }), { status: 404 });
    }

    console.log("[NOTIF DELETE] Deleting notification", notificationId);
    await prisma.notification.delete({ where: { id: notificationId } });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("[NOTIF DELETE]", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
