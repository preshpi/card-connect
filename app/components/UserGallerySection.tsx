"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const UserGallerySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images = [
    {
      src: "/holding-card-gallery-1.jpg",
      alt: "Developer Business Card showing code interface",
    },
    {
      src: "/holding-card-gallery-2.jpg",
      alt: "Blue NFC business card with JPD branding",
    },
    {
      src: "/holding-card-gallery-3.jpg",
      alt: "Black NFC card with QR code",
    },
    {
      src: "/placeholder-card.png",
      alt: "NFC business card in use",
    },
    // {
    //   src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    //   alt: "Professional NFC card design",
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    //   alt: "Modern NFC card layout",
    // },
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused || isDragging) return;

    const scrollSpeed = 1;
    const scrollStep = () => {
      if (scrollContainer && !isPaused && !isDragging) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Reset scroll when we've scrolled through one set of images
        const maxScroll = scrollContainer.scrollWidth / 3;
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }
    };

    const interval = setInterval(scrollStep, 16);
    return () => clearInterval(interval);
  }, [isPaused, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setIsDragging(false);
  };

  return (
    <section className="py-16 md:py-24 bg-white border-2 border-gray-100/90 rounded-2xl md:rounded-4xl">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 rounded-xl">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              User Gallery
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              See how others are using our NFC Business Cards to connect
              effortlessly!
            </p>
          </div>

          {/* Scrolling Gallery */}
          <div
            className="relative overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={scrollRef}
              className="overflow-x-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ userSelect: "none" }}
            >
              {/* Grid Container that scrolls horizontally */}
              <div className="grid grid-rows-2 grid-flow-col gap-6 w-max">
                {duplicatedImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                      index % 2 === 0
                        ? "w-80 h-60 md:w-96 md:h-72"
                        : "w-64 h-48 md:w-80 md:h-60"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      draggable={false}
                      width={300}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserGallerySection;
