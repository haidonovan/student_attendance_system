"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react"; // or your icon import

export default function SignOutDropdownItem() {
  function handleLogout() {
    signOut({callbackUrl: "/login"}); // Redirect to /login after logout
  }

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center space-x-2">
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
