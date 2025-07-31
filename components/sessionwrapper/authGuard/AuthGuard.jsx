"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../loading/Loading";

export default function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // router.push("/login");
      console.log("I was the one who push you back to login authguard")
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    // return null;
    console.log("sorry session was the one who do!");
  } 

  return <>{children}</>;
}
