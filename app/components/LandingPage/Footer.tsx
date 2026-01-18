import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
            {/* Logo and Brand */}
            <div className="flex justify-center w-full gap-3 mb-6 md:mb-0">
              <Image
                src="/assets/Logo.svg"
                alt="CardConnect Logo"
                width={200}
                height={200}
              />
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col items-center w-full sm:flex-row gap-6 md:gap-8 mb-6 md:mb-0">
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-[#7269E3] transition-colors duration-200 font-medium"
              >
                How it Works
              </a>
              <a
                href="#catalogue"
                className="text-gray-700 hover:text-[#7269E3] transition-colors duration-200 font-medium"
              >
                Catalogue
              </a>
            </div>

            {/* Social Media Icons */}
            {/* <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors duration-200 group"
              >
                <Facebook className="h-5 w-5 text-gray-600 group-hover:text-[#7269E3]" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors duration-200 group"
              >
                <Instagram className="h-5 w-5 text-gray-600 group-hover:text-[#7269E3]" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors duration-200 group"
              >
                <Twitter className="h-5 w-5 text-gray-600 group-hover:text-[#7269E3]" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors duration-200 group"
              >
                <Linkedin className="h-5 w-5 text-gray-600 group-hover:text-[#7269E3]" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors duration-200 group"
              >
                <Youtube className="h-5 w-5 text-gray-600 group-hover:text-[#7269E3]" />
              </Link>
            </div> */}
          </div>

          {/* Copyright */}
          <div className="text-center pt-8 border-t border-gray-100">
            <p className="text-gray-600">
              © 2026 CardConnect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
