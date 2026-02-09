import Image from "next/image";
import { Button } from "../ui/Button";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="min-h-fit max-w-336 mx-auto rounded-4xl md:rounded-[40px] bg-linear-to-br from-green-100/80 via-green-50/60 to-purple-100/80  bg-custom-radial flex flex-col">
      {/* Main content area */}
      <div className=" flex flex-col items-center justify-center px-4 py-14 md:px-6 md:py-12 text-left md:text-center">
        {/* Main heading with leaf icon */}
        <div className="hidden md:block mb-0 pb-6 md:mb-6 w-full max-w-3xl">
          <h1 className="font-sora whitespace-pre-line text-[44px] md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight">
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
        </div>

        {/* Mobile header text walk around for design accuracy */}
        <div className="block md:hidden mb-0 pb-6 md:mb-6 w-full max-w-3xl">
          <h1 className="font-sora whitespace-pre-line text-[44px] md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight">
            <span className="block">Tap.</span>
            <span className="block">Connect.</span>
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
        </div>

        {/* Subtitle */}
        <p className="text-sm text-left md:text-center md:text-lg text-gray-700 max-w-164.5 mb-12 leading-relaxed font-work-sans">
          Transform the way you network with our customizable NFC business
          cards. Share your contact info and portfolio with a single tap away.
        </p>

        {/* CTA Button */}
        <Link href="/signup">
          <button
            type="button"
            className="bg-[#7269E3] cursor-pointer rounded-full text-white lg:py-5 py-4 shadow px-4 max-w-62.25"
          >
            Build My Smart Card
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
