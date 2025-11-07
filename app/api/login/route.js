// app/api/login/route.js
// import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
// import prisma from "@/lib/prisma"

// import { PrismaClient } from "@/lib/generated/prisma"; // not @/lib/prisma
// const prisma = new PrismaClient();


// export async function POST(request) {
//   try {
//     const { email, password } = await request.json();

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user || !user.password) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const isValid = await bcrypt.compare(password, user.password);

//     if (!isValid) {
//       return NextResponse.json(
//         { success: false, message: "Incorrect password" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login API Error:", err); // log full error on server
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
