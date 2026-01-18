"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#F5FAF7] border-[#E5E7EB]">
      <div className="max-w-336 mx-auto h-24 px-4 flex items-center justify-between relative">
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            How it works
          </Link>
          <Link
            href="/catalogue"
            className={`font-medium ${
              pathname === "/catalogue" ? "text-[#7269E3]" : "text-gray-700"
            } hover:text-gray-900`}
          >
            Catalogue
          </Link>
        </div>

        {/* Logo */}
        <Link href="/" className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <Image
            src={Logo}
            alt="CardConnect Logo"
            width={150}
            height={150}
            priority
          />
        </Link>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button className="bg-[#7269E3] text-white px-6 rounded-full py-4 text-sm">
            Create an account
          </Button>
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E7EB]">
          <div className="flex flex-col gap-6 px-4 py-6">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium"
            >
              How it works
            </Link>
            <Link
              href="/catalogue"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium"
            >
              Catalogue
            </Link>
            <Button
              className="bg-[#7269E3] text-white rounded-full"
              onClick={() => setIsOpen(false)}
            >
              Create an account
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
