"use client";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    rating: 5,
    quote:
      "NFC Contact Cards are the future of networking. You buy it once and get to keep it forever. My clients are always impressed!",
    name: "Yves Kwameh",
    title: "UX/UI Designer",
    avatar: "/testimonial.png",
  },
  {
    id: 2,
    rating: 5,
    quote:
      "These NFC cards have revolutionized how I network. No more fumbling with paper cards or worrying about running out!",
    name: "Sarah Johnson",
    title: "Marketing Director",
    avatar: "/testimonial.png",
  },
  {
    id: 3,
    rating: 5,
    quote:
      "Sustainable, efficient, and impressive. These NFC cards align perfectly with our company's tech-forward approach.",
    name: "Emma Davis",
    title: "Tech Lead",
    avatar: "/testimonial.png",
  },
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Trusted by Professionals
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Join thousands of networkers making a better first impression.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-[#7269E3] text-xl">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image
                    width={50}
                    height={50}
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
