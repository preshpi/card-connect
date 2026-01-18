import { Icons } from "../ui/Icon";
import Image from "next/image";

const About = () => {
  return (
    <section className="w-full bg-[#F9FAFB] py-20 md:py-24">
      <div className="max-w-336 mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left content */}
        <div className="space-y-10">
          {/* Heading */}
          <div className="relative text-center md:text-left">
            <div className="hidden md:block absolute -right-38 -top-14">
              <Icons.scribbleArrow className="w-[260px]" />
            </div>

            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Ditch Paper Cards for{" "}
              <span className="text-[#7269E3]">Sustainable</span> Digital
              Solutions
            </h2>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl md:max-w-none mx-auto md:mx-0">
              Every year, 100 billion paper business cards are discarded,
              contributing to environmental waste. By switching to NFC cards,
              you reduce waste and simplify how you share your details.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Eco-Friendly */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#7269E3]/10 flex items-center justify-center flex-shrink-0">
                <Icons.recycleIcon className="w-5 h-5 text-[#7269E3]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Eco Friendly
                </h3>
                <p className="text-sm text-gray-600">
                  Reduce waste and lower your carbon footprint with one reusable
                  card.
                </p>
              </div>
            </div>

            {/* Cost Effective */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#7269E3]/10 flex items-center justify-center flex-shrink-0">
                <Icons.costIcon className="w-5 h-5 text-[#7269E3]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Cost Effective
                </h3>
                <p className="text-sm text-gray-600">
                  Pay once and update your details anytime without reprinting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right visual anchor */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-lg aspect-[1.6/1] rounded-3xl bg-[#0B0F1A] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(114,105,227,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(114,105,227,0.1),transparent_40%)]" />

            <div className="relative p-8">
              <Image
                src="/assets/LogoWhite.svg"
                alt="CardConnect"
                width={96}
                height={90}
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-semibold tracking-wide opacity-90">
                YOUR DESIGN HERE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
