"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#F5FAF7] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto h-20 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src={Logo}
            alt="CardConnect Logo"
            width={150}
            height={150}
            priority
          />
        </Link>

        {/* Desktop Links - Center */}
        <div className="hidden md:flex items-center gap-12 flex-1 justify-center">
          <Link
            href="/catalogue"
            className={`font-medium ${
              pathname === "/catalogue" ? "text-[#7269E3]" : "text-gray-700"
            } hover:text-gray-900`}
          >
            catalogue
          </Link>
          <Link
            href="/#how-it-works"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            How it works
          </Link>
          <Link
            href="/#testimonials"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Testimonials
          </Link>
          <Link
            href="/#faqs"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            FAQs
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block shrink-0">
          <Link href="/signup">
            <button className="bg-[#7269E3] cursor-pointer text-white px-6 rounded-full py-4 text-sm">
              Get Your Card
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Image src="/assets/icons/Menu.svg" alt="" width={20} height={20} />
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0  backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-screen w-80 bg-[#F8F9FA] md:hidden z-50 overflow-y-auto">
            <div className="flex flex-col gap-4 px-6 py-8">
              {/* Logo in Sidebar */}
              <Link href="/" onClick={() => setIsOpen(false)} className="mb-4">
                <Image
                  src={Logo}
                  alt="CardConnect Logo"
                  width={120}
                  height={120}
                  priority
                />
              </Link>

              {/* Features - Highlighted */}
              <Link
                href="/features"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4  text-gray-700 font-medium px-6 py-4 rounded-full"
              >
                <span>Features</span>
              </Link>

              {/* Catalogue */}
              <Link
                href="/catalogue"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-gray-700 font-medium px-4 py-3 hover:text-gray-900"
              >
                <span>Catalogue</span>
              </Link>

              {/* How it Works */}
              <Link
                href="/#how-it-works"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-gray-700 font-medium px-4 py-3 hover:text-gray-900"
              >
                <span>How it Works</span>
              </Link>

              {/* Testimonials */}
              <Link
                href="/#testimonials"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-gray-700 font-medium px-4 py-3 hover:text-gray-900"
              >
                <span>Testimonials</span>
              </Link>

              {/* Get Started */}
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-gray-700 font-medium px-4 py-3 hover:text-gray-900"
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Header;
