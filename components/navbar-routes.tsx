"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const userId = session?.user?.id;

  if (!session?.user) {
    return (
      <div className="ml-auto">
        <Link href="/api/auth/signin">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  const name = session?.user?.name || "User";
  const firstLetter = name.charAt(0).toUpperCase();

  const isTeacherPage = pathName?.startsWith("/teacher");
  const isCoursePage = pathName?.includes("/courses");
  const isSearchPage = pathName === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null }
        <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">
          {firstLetter}
        </div>
      </div>
    </>
  );
};
