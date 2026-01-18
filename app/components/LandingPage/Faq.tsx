"use client";
import Image from "next/image";
import { useState } from "react";

export const faqData = [
  {
    id: 1,
    q: "How does the NFC card work?",
    a: "The NFC card uses near-field communication technology to instantly share your contact details or digital profile when tapped against a smartphone. No apps or extra steps needed.",
  },
  {
    id: 2,
    q: "Can I customize my card design?",
    a: "Yes. You can upload your own design or choose from our templates. You get a live preview before ordering.",
  },
  {
    id: 3,
    q: "Is my personal data secure?",
    a: "Yes. The card only shares the information you choose. It does not store sensitive data or access your phone.",
  },
  {
    id: 4,
    q: "How long does it take to receive my card?",
    a: "Orders typically take a few days to process, plus shipping time based on your location. Tracking details are sent once shipped.",
  },
  {
    id: 5,
    q: "Can I bulk order cards for my team or company?",
    a: "Yes. We offer bulk pricing for teams and companies. Contact us for details.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-[#F5FAF7]">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-12 md:mb-16">
            FAQs
          </h2>

          <div className="space-y-4 md:space-y-6">
            {faqData.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 md:px-8 py-6 md:py-8 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 pr-4">
                    {faq.q}
                  </h3>

                  <Image
                    src={
                      openIndex === index
                        ? "/assets/icons/ChevronUp.svg"
                        : "/assets/icons/ChevronDown.svg"
                    }
                    alt="Toggle"
                    width={24}
                    height={24}
                    className="h-6 w-6 shrink-0"
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 md:px-8 pb-6 md:pb-8">
                    <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-700 mb-8">We’re here to help you.</p>
            <button className="border-2 border-gray-300 text-gray-700 hover:border-[#7269E3] hover:text-[#7269E3] px-8 py-3 rounded-full transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
