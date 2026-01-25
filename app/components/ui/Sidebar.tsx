"use client";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  icon: string | StaticImport;
  href?: string;
};

const menuItems: MenuItem[] = [
  { label: "My Link", icon: "/assets/icons/Category.svg", href: "/links" },
  { label: "Analytics", icon: "/assets/icons/Chart.svg", href: "/analytics" },
  { label: "Customize", icon: "/assets/icons/Edit.svg", href: "/customize" },
  { label: "Profile", icon: "/assets/icons/Profile.svg", href: "/profile" },
  { label: "Settings", icon: "/assets/icons/Setting.svg", href: "/settings" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const activeItem = menuItems.find((item) => pathname === item.href);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#F3F4F6] z-40 grid grid-cols-3 items-center px-4">
        {/* Left */}
        <div className="flex justify-start">
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-900"
            aria-label="Open menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Center */}
        <div className="flex justify-center">
          <span className="font-semibold text-gray-900">
            {activeItem?.label || "Dashboard"}
          </span>
        </div>

        {/* Right (empty spacer for balance) */}
        <div />
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-66 bg-[#7269E3]
          py-6 px-6 flex flex-col justify-between
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Profile + Menu */}
        <div className="space-y-8">
          <div className="flex items-center gap-x-2 bg-[#5D53DF] py-3 px-4 rounded-lg">
            <p className="bg-[#80D68D] px-3 py-2 rounded-lg text-white font-bold text-sm">
              P
            </p>
            <p className="text-white font-semibold text-sm">Precious Ijeoma</p>
          </div>

          <div className="space-y-4">
            <div className="text-white text-sm font-medium tracking-wide">
              MAIN MENU
            </div>

            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-white text-[#1D1F2C] shadow"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                      style={{
                        filter: isActive
                          ? "none"
                          : "brightness(0) saturate(100%) invert(1)",
                      }}
                    />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Logout */}
        <button className="flex items-center gap-3 text-white text-base font-medium px-4 py-3 hover:bg-white/20 rounded-xl transition-colors">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M15.75 9V7.5A2.25 2.25 0 0 0 13.5 5.25h-6A2.25 2.25 0 0 0 5.25 7.5v9A2.25 2.25 0 0 0 7.5 18.75h6A2.25 2.25 0 0 0 15.75 16.5V15"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M18.75 12H9.75m0 0 2.25-2.25M9.75 12l2.25 2.25"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Log out
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
