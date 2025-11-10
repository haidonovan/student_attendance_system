// middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma"; // adjust path if needed

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // PUBLIC_PATHS: pages or APIs that anyone can access
  const PUBLIC_PATHS = ["/", "/login", "/api/login", "/favicon.ico", "/_next/"];
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next(); // allow access without checking cookies
  }

  // Block all /api routes if no valid session
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (!sessionToken) {
    // API request → return 401 JSON
    if (pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    // Page request → redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check session in DB
  const session = await prisma.session.findUnique({
    where: { sessionToken },
  });

  if (!session || new Date(session.expires) < new Date()) {
    if (pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Session expired" }), { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Valid session → allow request
  return NextResponse.next();
}

// ✅ Matcher to run middleware on all paths except static assets
export const config = {
  matcher: ["/((?!favicon.ico|_next/static|_next/image|_next/font).*)"],
};
