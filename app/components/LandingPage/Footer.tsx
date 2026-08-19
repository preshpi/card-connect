"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.svg";
import { Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="bg-[#EDEEEF] border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src={Logo}
                alt="CardConnect Logo"
                width={150}
                height={150}
                priority
              />
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Sustainable Networking for the Modern Professional.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-600 hover:text-[#7269E3] transition-colors"
                aria-label="Share"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#7269E3] transition-colors"
                aria-label="Global"
              >
               <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-[#7269E3] transition-colors text-sm"
                >
                  How it Works
                </a>
              </li>
              <li>
                <Link
                  href="/catalogue"
                  className="text-gray-600 hover:text-[#7269E3] transition-colors text-sm"
                >
                  Catalogue
                </Link>
              </li>
              {/* <li>
                <a
                  href="#bulk-orders"
                  className="text-gray-600 hover:text-[#7269E3] transition-colors text-sm"
                >
                  Bulk Orders
                </a>
              </li> */}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-[#7269E3] transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-[#7269E3] transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-[#7269E3] transition-colors text-sm"
                >
                  Shipping Info
                </Link>
              </li> */}
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-[#7269E3] transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-600 text-sm mb-4">
              Get networking tips and product updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white rounded-l-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:border-[#7269E3]"
                required
              />
              <button
                type="submit"
                className="bg-[#7269E3] text-white px-4 py-3 rounded-r-lg hover:bg-[#6058d4] transition-colors"
              >
                →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-sm">
            © 2026 CardConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
