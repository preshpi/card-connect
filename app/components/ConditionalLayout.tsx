"use client";

import { usePathname } from "next/navigation";
import Header from "./LandingPage/Header";
import Footer from "./LandingPage/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  // Known single-segment routes that should show header/footer
  const knownPublicRoutes = [
    "catalogue",
    "about",
    "pricing",
    "blog",
    "contact",
  ];
  const isKnownRoute = knownPublicRoutes.includes(pathSegments[0]);

  // Single-segment routes that aren't known routes = user profiles
  const isPublicProfile =
    pathSegments.length === 1 && pathname !== "/" && !isKnownRoute;

  // Hide header and footer on these routes
  const hideLayout =
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.includes("/dashboard") ||
    isPublicProfile; // Hide for public profile pages like /preciousegwuenu

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
