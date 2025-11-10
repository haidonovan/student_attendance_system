"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function SignOutDropdownItem() {
  function handleLogout() {
    // 1️⃣ Remove cookies manually
    document.cookie = "sessionToken=; path=/; max-age=0"; // expire immediately
    document.cookie = "otherCookie=; path=/; max-age=0"; // any other cookies

    // 2️⃣ Sign out and redirect
    signOut({ callbackUrl: "/login" });
  }

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center space-x-2">
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}






























































// "use client";

// import { signOut } from "next-auth/react";
// import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { LogOut } from "lucide-react"; // or your icon import

// export default function SignOutDropdownItem() {
//   function handleLogout() {
//     signOut({callbackUrl: "/login"}); // Redirect to /login after logout
//   }

//   return (
//     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center space-x-2">
//       <LogOut className="h-4 w-4" />
//       <span>Log out</span>
//     </DropdownMenuItem>
//   );
// }
