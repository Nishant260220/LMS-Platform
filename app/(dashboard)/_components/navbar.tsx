import React from "react";
import { MobileSidebar } from "./mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center dark:bg-gray-900 text-gray-900 dark:text-white bg-white shadow-sm">
      <MobileSidebar />

      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
