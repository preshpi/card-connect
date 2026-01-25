"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const catalogueItems = [
  { name: "Classic Card", price: "₦10,000" },
  { name: "Premium Card", price: "₦10,000" },
  { name: "Eco-Friendly Card", price: "₦10,000" },
  { name: "Luxury Card", price: "₦10,000" },
  { name: "Minimalist Card", price: "₦10,000" },
  { name: "Bold Card", price: "₦10,000" },
  { name: "Artisan Card", price: "₦10,000" },
  { name: "Product name", price: "₦10,000" },
];

const CatalogueSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ensure window is defined (prevents SSR issues)
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };

    // Initial check
    checkMobile();

    // Add resize listener with passive option for performance
    window.addEventListener("resize", checkMobile, { passive: true });

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 4 : 8;
  const totalPages = Math.ceil(catalogueItems.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentItems = () => {
    const startIndex = currentPage * itemsPerPage;
    return catalogueItems.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <section className="py-16 md:py-24 bg-[#F5FAF7]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Catalogue
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Discover our range of customizable NFC business cards.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {getCurrentItems().map((item, index) => (
              <div
                key={index}
                className="bg-transparent rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Card Image Placeholder */}
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    {item.price}
                  </p>
                  <button className="w-full bg-[#7269E3] hover:bg-[#7269E3]/102 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                    Buy now
                    <Image
                      src={"/assets/icons/ChevronLeft.svg"}
                      alt="arrow-left"
                      width={9}
                      height={9}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentPage ? "bg-[#7269E3]" : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                aria-label="Previous page"
              >
                <Image
                  src={"/assets/icons/ChevronLeft.svg"}
                  alt="arrow-left"
                  width={9}
                  height={9}
                />{" "}
              </button>
              <button
                onClick={nextPage}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                aria-label="Next page"
              >
                <Image
                  src={"/assets/icons/ChevronLeft.svg"}
                  alt="arrow-left"
                  width={9}
                  height={9}
                />{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogueSection;
