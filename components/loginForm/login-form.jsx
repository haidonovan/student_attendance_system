// "use client"

// import { useRouter } from "next/navigation"
// import { useState, useEffect } from "react"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import SignInButton from "../sessionwrapper/signIn/SignInButton"
// import { useRouter } from "next/navigation"
// import { useSession } from "next-auth/react"
// import { useEffect } from "react"

// export function LoginForm({ className, ...props }) {
//     // auto redirect to dashboard if cookies exist

//     // 1. get data from cookies if they used to sign in 
//     const { data: session, status } = useSession();
//     // 2. create router to use pointing to where
//     const router = useRouter();
//     // 3. redirect them using router to push them
//     // use effect will separate render page from programming it will run once when first time render and run again if these status and router variable change to any value it will trigger if condition to check if user authenticated or not
//     useEffect(() => {
//         if (status === "authenticated") {
//             router.push("/dashboard");
//         }
//     }, [status, router]); // run this only after status change

//     return (
//         <form className={cn("flex flex-col gap-6", className)} {...props}>
//             <div className="flex flex-col items-center gap-2 text-center">
//                 <h1 className="text-2xl font-bold">Login to your account</h1>
//                 <p className="text-muted-foreground text-sm text-balance">
//                     Enter your email below to login to your account
//                 </p>
//             </div>
//             <div className="grid gap-6">
//                 <div className="grid gap-3">
//                     <Label htmlFor="email">Email</Label>
//                     <Input id="email" type="email" placeholder="m@example.com" required />
//                 </div>
//                 <div className="grid gap-3">
//                     <div className="flex items-center">
//                         <Label htmlFor="password">Password</Label>
//                         <a
//                             href="#"
//                             className="ml-auto text-sm underline-offset-4 hover:underline"
//                         >
//                             Forgot your password?
//                         </a>
//                     </div>
//                     <Input id="password" type="password" required />
//                 </div>
//                 <Button type="submit" className="w-full">
//                     Login
//                 </Button>
//                 <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
//                     <span className="bg-background text-muted-foreground relative z-10 px-2">
//                         Or continue with
//                     </span>
//                 </div>
//                 {/* Google Icon */}
//                 {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
//             <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C34 32.1 29.5 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 7.1 29.1 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c9.8 0 18-7.1 18-19 0-1.2-.1-2.3-.4-3.5z"/>
//             <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 16 18.8 13 24 13c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 7.1 29.1 5 24 5c-7.5 0-14 4.1-17.7 9.7z"/>
//             <path fill="#4CAF50" d="M24 43c5.3 0 10.1-1.8 13.8-4.8l-6.4-5.3c-2 1.4-4.5 2.1-7.4 2.1-5.5 0-10.1-3.8-11.6-9l-6.6 5.1C9.9 38.7 16.4 43 24 43z"/>
//             <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 2.9-3.1 5.1-5.7 6.6l.1.1 6.4 5.3c-.4.3 7.9-5.8 7.9-17.5 0-1.2-.1-2.3-.4-3.5z"/>
//           </svg> */}
//                 <SignInButton>Login with Google</SignInButton>

//             </div>
//             <div className="text-center text-sm">
//                 Don&apos;t have an account?{" "}
//                 <a href="#" className="underline underline-offset-4">
//                     Sign up
//                 </a>
//             </div>
//         </form>
//     )
// }




// login-form.jsx



"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import SignInButton from "../sessionwrapper/signIn/SignInButton"

export function LoginForm({ className, ...props }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])


  // old one
  // async function handleSubmit(e) {
  //   e.preventDefault()
  //   const res = await fetch("/api/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   })

  //   const result = await res.json()
  //   if (!res.ok) {
  //     setError(result.message || "Login failed")
  //   } else {
  //     router.push("/dashboard") // or reload for session to kick in
  //   }
  // }

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    // Show error from backend
    setError(data.error || "Login failed");
  } else {
    // Login successful → redirect to dashboard
    router.push("/dashboard");
  }
}



  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email below to login to your account
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-500 text-center">{error}</div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <SignInButton>Login with Google</SignInButton>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </div>
    </form>
  )
}
