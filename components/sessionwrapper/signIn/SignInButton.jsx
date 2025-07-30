"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignInButton() {

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center space-x-2"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C34 32.1 29.5 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 7.1 29.1 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c9.8 0 18-7.1 18-19 0-1.2-.1-2.3-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 16 18.8 13 24 13c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 7.1 29.1 5 24 5c-7.5 0-14 4.1-17.7 9.7z" />
        <path fill="#4CAF50" d="M24 43c5.3 0 10.1-1.8 13.8-4.8l-6.4-5.3c-2 1.4-4.5 2.1-7.4 2.1-5.5 0-10.1-3.8-11.6-9l-6.6 5.1C9.9 38.7 16.4 43 24 43z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 2.9-3.1 5.1-5.7 6.6l.1.1 6.4 5.3c-.4.3 7.9-5.8 7.9-17.5 0-1.2-.1-2.3-.4-3.5z" />
      </svg>
      <span>Continue with Google</span>
    </Button>
  );
}
