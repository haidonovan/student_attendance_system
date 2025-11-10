// middleware.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public paths
  const PUBLIC_PATHS = ["/", "/login", "/api/login", "/favicon.ico", "/_next/"];
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get cookie from request
  const sessionToken = req.cookies.get("sessionToken")?.value;

  if (!sessionToken) {
    if (pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Find session in DB
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || new Date(session.expires) < new Date()) {
    if (pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Session expired" }), { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user.role.toUpperCase(); // STUDENT, TEACHER, ADMIN

if (pathname === "/dashboard") {
  // Redirect to the correct role page
  return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, req.url));
}

// Restrict access to role-specific pages
if (role === "STUDENT" && pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/student")) {
  return NextResponse.redirect(new URL("/dashboard/student", req.url));
}

if (role === "TEACHER" && pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/teacher")) {
  return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
}

if (role === "ADMIN" && pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/admin")) {
  return NextResponse.redirect(new URL("/dashboard/admin", req.url));
}


  return NextResponse.next();
}

// Run middleware on all paths except static files
export const config = {
  matcher: ["/((?!favicon.ico|_next/static|_next/image|_next/font).*)"],
};
