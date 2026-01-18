"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    quote:
      "NFC Contact Cards are the future of networking, no need to worry about printing business cards. You buy it once and get to keep it forever",
    name: "Yves Kwameh",
    title: "UX/UI Designer",
    avatar: "/testimonial.png",
  },
  {
    id: 2,
    quote:
      "These NFC cards have revolutionized how I network at events. No more fumbling with paper cards or worrying about running out!",
    name: "Sarah Johnson",
    title: "Marketing Director",
    avatar: "/testimonial.png",
  },
  {
    id: 3,
    quote:
      "The convenience and professional impression these cards make is incredible. Best investment for my business networking.",
    name: "Michael Chen",
    title: "Sales Manager",
    avatar: "/testimonial.png",
  },
  {
    id: 4,
    quote:
      "Sustainable, efficient, and impressive. These NFC cards align perfectly with our company's tech-forward approach.",
    name: "Emma Davis",
    title: "Tech Lead",
    avatar: "/testimonial.png",
  },
  {
    id: 5,
    quote:
      "I love how easy it is to update my information without reprinting cards. The future of professional networking!",
    name: "David Wilson",
    title: "Entrepreneur",
    avatar: "/testimonial.png",
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.children[0]?.clientWidth || 0;
      const gap = 16; // 1rem gap
      const scrollPosition = index * (cardWidth + gap);

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrevious = () => {
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.children[0]?.clientWidth || 0;
      const gap = 16;
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setCurrentIndex(newIndex);
    }
  };

  return (
    <section className="py-16 bg-[#F5FAF7]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Navigation Buttons */}

              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={handlePrevious}
              >
                <Image
                  src="/assets/icons/ChevronLeft.svg"
                  alt="left-arrow"
                  width={16}
                  height={16}
                />
              </button>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={handleNext}
              >
                <Image
                  src="/assets/icons/ChevronRight.svg"
                  alt="right-arrow"
                  width={16}
                  height={16}
                />
              </button>

              {/* Testimonial Card */}
              <div className="mx-16 px-8 py-12 -rotate-6 hover:rotate-0">
                <div className="bg-gradient-to-br from-green-100/80 via-green-50/60 to-purple-100/80 rounded-3xl p-12 max-w-4xl mx-auto backdrop-blur-sm border border-white/50 shadow-xl">
                  <div className="text-center">
                    <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-relaxed mb-8">
                      &quot;{testimonials[currentIndex].quote}&quot;
                    </blockquote>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-lg">
                        <Image
                          width={50}
                          height={50}
                          src={testimonials[currentIndex].avatar}
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-1">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-600 font-medium">
                        {testimonials[currentIndex].title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gray-800 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="relative">
            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
              onScroll={handleScroll}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-none w-[calc(100vw-2rem)] snap-start"
                >
                  <div className="bg-linear-to-br from-green-100/80 via-green-50/60 to-purple-100/80 rounded-3xl p-6 mx-4 backdrop-blur-sm border border-white/50 shadow-xl">
                    <div className="text-center">
                      <blockquote className="text-lg font-bold text-gray-900 leading-relaxed mb-6">
                        &quot;{testimonial.quote}&quot;
                      </blockquote>

                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mb-3 ring-4 ring-white shadow-lg">
                          <Image
                            width={50}
                            height={50}
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 font-medium text-sm">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              className="absolute left-2 bottom-20 z-10 p-3 rounded-full bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 shadow-lg"
              onClick={handlePrevious}
            >
              <Image
                src="/assets/icons/ChevronLeft.svg"
                alt="left-arrow"
                width={16}
                height={16}
              />
            </button>

            <button
              className="absolute right-2 bottom-20 z-10 p-3 rounded-full bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 shadow-lg"
              onClick={handleNext}
            >
              <Image
                src="/assets/icons/ChevronRight.svg"
                alt="right-arrow"
                width={16}
                height={16}
              />
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gray-800 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
