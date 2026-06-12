"use client";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogout } from "@/app/services/auth";
import { useAuthStore } from "@/app/store/useAuthStore";
import { getApiErrorMessage } from "@/app/utils/apiError";
import { ChevronDown } from "lucide-react";

type MenuItem = {
  label: string;
  icon: string | StaticImport;
  href?: string | null;
  subItems?: MenuItem[];
};

const menuItems: MenuItem[] = [
  {
    label: "My Link",
    icon: "/assets/icons/Category.svg",
    href: "/dashboard/links",
    subItems: [
      {
        label: "Manage Links",
        icon: "/assets/icons/Category.svg",
        href: "/dashboard/links",
      },
      {
        label: "Customize Design",
        icon: "/assets/icons/Edit.svg",
        href: "/dashboard/design",
      },
    ],
  },
  {
    label: "Analytics",
    icon: "/assets/icons/Chart.svg",
    href: "/dashboard/analytics",
  },
  {
    label: "Customize Card",
    icon: "/assets/icons/Edit.svg",
    href: "/dashboard/customize",
  },
  {
    label: "Orders",
    icon: "/assets/icons/shoppingBag.svg",
    href: "/dashboard/orders",
  },
  {
    label: "Templates",
    icon: "/assets/icons/Template.svg",
    href: "/dashboard/templates",
  },
  {
    label: "Profile",
    icon: "/assets/icons/Profile.svg",
    href: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: "/assets/icons/Setting.svg",
    href: "/dashboard/settings",
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const activeItem = menuItems.find((item) => pathname === item.href);
  const user = useAuthStore((state) => state.user);
  const displayUser = user;
  const fullName = displayUser?.fullName?.trim() || "User";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase())
      .join("") || "U";

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/login");
      },
      onError: (error: unknown) => {
        toast.error(getApiErrorMessage(error, "Failed to log out."));
      },
    });
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const isSubItemActive = (item: MenuItem) => {
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.href);
    }
    return false;
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#F3F4F6] z-40 grid grid-cols-3 items-center px-4">
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
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-66 bg-[#7269E3]
          py-6 px-6 flex flex-col justify-between
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Profile + Menu */}
        <div className="space-y-8">
          <div className="flex items-center gap-x-2 bg-[#5D53DF] py-3 px-4 rounded-lg">
            <p className="bg-[#80D68D] px-3 py-2 rounded-lg text-white font-bold text-sm">
              {initials}
            </p>
            <p className="text-white font-semibold text-sm">{fullName}</p>
          </div>

          <div className="space-y-4">
            {/* <div className="text-white text-sm font-medium tracking-wide">
              MAIN MENU
            </div> */}

            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItems.includes(item.label);
                const isSubActive = isSubItemActive(item);

                return (
                  <div key={item.label}>
                    {/* Main menu item */}
                    <button
                      onClick={() => {
                        if (hasSubItems) {
                          toggleExpanded(item.label);
                        } else if (item.href) {
                          router.push(item.href);
                          setIsOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive || isSubActive
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
                          filter:
                            isActive || isSubActive
                              ? "none"
                              : "brightness(0) saturate(100%) invert(1)",
                        }}
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      {hasSubItems && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    {/* Submenu items */}
                    {hasSubItems && isExpanded && (
                      <div className="mt-2 ml-4 space-y-1 border-l border-white/20 pl-4">
                        {item.subItems!.map((subItem) => {
                          const isSubItemActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.label}
                              href={subItem.href || "#"}
                              onClick={() => setIsOpen(false)}
                              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isSubItemActive
                                  ? "bg-white/30 text-white"
                                  : "text-white/70 hover:text-white hover:bg-white/20"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 text-white text-base font-medium px-4 py-3 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
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
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
