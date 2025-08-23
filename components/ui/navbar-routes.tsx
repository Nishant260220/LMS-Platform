"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const NavbarRoutes = () => {
  const { data: session } = useSession();
  const pathName = usePathname();

  if (!session?.user) {
    return (
      <div className="ml-auto">
        <Link href="/api/auth/signin">
          <Button>
            Login
          </Button>
        </Link>
      </div>
    );
  }

  const name = session?.user?.name || "User";
  const firstLetter = name.charAt(0).toUpperCase();

  const isTeacherPage = pathName?.startsWith("/teacher");
  const isPlayerPage = pathName?.includes("/chapter");

  return (
   <div className="flex gap-x-2 ml-auto">
    {isTeacherPage || isPlayerPage ? (
     <Link href="/">
      <Button size="sm" variant="ghost">
        <LogOut className="w-4 h-4 mr-2" />
        Exit
      </Button>
     </Link>
    ):(
       <Link href="/teacher/courses">
        <Button size="sm" variant="ghost">
          Teacher mode
        </Button>
       </Link>
    )}
     <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">
      {firstLetter}
    </div>
   </div>
  );
};