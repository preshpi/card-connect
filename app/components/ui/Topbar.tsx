"use client";
import React from "react";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  icon: string;
  hrefPrefix: string;
};

const menuItems: MenuItem[] = [
  {
    label: "My Link",
    icon: "/assets/icons/Category.svg",
    hrefPrefix: "/dashboard/links",
  },
  {
    label: "Analytics",
    icon: "/assets/icons/Chart.svg",
    hrefPrefix: "/dashboard/analytics",
  },
  {
    label: "Capture",
    icon: "/assets/icons/Camera.svg",
    hrefPrefix: "/dashboard/customize/capture",
  },
  {
    label: "Customize",
    icon: "/assets/icons/Edit.svg",
    hrefPrefix: "/dashboard/customize",
  },
  {
    label: "Profile",
    icon: "/assets/icons/Profile.svg",
    hrefPrefix: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: "/assets/icons/Setting.svg",
    hrefPrefix: "/dashboard/settings",
  },
];

const Topbar = () => {
  const pathname = usePathname();
  // Match by route prefix so sub-routes inherit the same topbar label/icon.
  const currentMenu = menuItems.find((item) =>
    pathname.startsWith(item.hrefPrefix),
  );
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
