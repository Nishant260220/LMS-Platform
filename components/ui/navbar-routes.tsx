"use client";

import { useSession } from "next-auth/react";

export const NavbarRoutes = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const name = session.user.name || "User";
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">
      {firstLetter}
    </div>
  );
};