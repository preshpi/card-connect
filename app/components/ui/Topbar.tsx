"use client";
import React from "react";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  icon: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { label: "My Link", icon: "/assets/icons/Category.svg", href: "/links" },
  { label: "Analytics", icon: "/assets/icons/Chart.svg", href: "/analytics" },
  { label: "Customize", icon: "/assets/icons/Edit.svg", href: "/customize" },
  { label: "Profile", icon: "/assets/icons/Profile.svg", href: "/profile" },
  { label: "Settings", icon: "/assets/icons/Setting.svg", href: "/settings" },
];

const Topbar = () => {
  const pathname = usePathname();
  // Find the menu item whose href matches the current route
  const currentMenu = menuItems.find((item) => pathname.endsWith(item.href));
  const label = currentMenu ? currentMenu.label : "Dashboard";

  return (
    <div className="h-16 border-b border-[#EAECF0] text-[#1D1F2C]">
      <div className="flex items-center justify-between px-6 h-full">
        <p className="font-bold text-[#1D1F2C]">{label}</p>
        <div className="h-10 w-10 border rounded-full bg-amber-400"></div>
      </div>
    </div>
  );
};

export default Topbar;
