"use client";
import About from "./components/LandingPage/About";
import Benefit from "./components/LandingPage/Benefit";
import CTASection from "./components/LandingPage/CTA";
import FAQSection from "./components/LandingPage/Faq";
import Hero from "./components/LandingPage/Hero";
import HowItWorks from "./components/LandingPage/HowItWorks";
import TestimonialSection from "./components/LandingPage/Testimony";

export default function Home() {
  return (
    <main className="text-neutral-500 min-h-screen bg-[#F9FAFB]">
      <div className="px-4 md:px-6 lg:px-8">
        <Hero />
        <About />
        <HowItWorks />
        <Benefit />
        <TestimonialSection />
        <FAQSection />
        <CTASection />
      </div>
    </main>
  );
}
