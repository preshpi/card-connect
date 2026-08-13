"use client";
import Image from "next/image";
import Link from "next/link";
import Reveal from "../ui/Reveal";

const Hero = () => {
  return (
    <div className="bg-linear-to-br from-green-100/80 via-green-50/60 to-purple-100/80  bg-custom-radial flex flex-col">
      {/* Main content area */}
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:px-6 md:py-20 text-center w-full">
        {/* Main heading with leaf icon */}
        <Reveal className="hidden md:block mb-6 w-full max-w-3xl">
          <h1 className="font-sora whitespace-pre-line text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight">
            Tap. Connect.
            {/* <br /> */}
            <span className="relative inline-flex items-center md:gap-2 -mt-4">
              Impress.
              <Image
                src="/assets/Branch.svg"
                alt=""
                width={100}
                height={32}
                className="ml-2 md:ml-4 lg:ml-6"
              />
            </span>
          </h1>
        </Reveal>

        {/* Mobile header text walk around for design accuracy */}
        <Reveal className="block md:hidden mb-6 w-full max-w-3xl">
          <h1 className="font-sora whitespace-pre-line text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            <span className="block">Tap.</span>
            <span className="block">Connect.</span>
            {/* <br /> */}
            <span className="relative inline-flex items-center gap-1 sm:gap-2 -mt-2">
              Impress.
              <Image
                src="/assets/Branch.svg"
                alt=""
                width={80}
                height={24}
                className="ml-1 sm:ml-2"
              />
            </span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal
          delay={0.15}
          className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mb-8 sm:mb-10 md:mb-12 leading-relaxed font-work-sans"
        >
          <p>
            Transform the way you network with our customizable NFC business
            cards. Share your contact info and portfolio with a single tap
            away.
          </p>
        </Reveal>

        {/* CTA Buttons */}
        <Reveal
          delay={0.3}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full bg-[#7269E3] cursor-pointer rounded-full text-white py-3 sm:py-4 lg:py-5 px-6 sm:px-8 font-semibold hover:bg-[#6058d4] transition-colors"
            >
              Build My Smart Card →
            </button>
          </Link>
          <Link href="/catalogue" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full border-2 border-gray-300 cursor-pointer rounded-full text-gray-900 py-3 sm:py-4 lg:py-5 px-6 sm:px-8 font-semibold hover:border-gray-400 transition-colors"
            >
              Explore Catalogue
            </button>
          </Link>
        </Reveal>
      </div>
    </div>
  );
};

export default Hero;
