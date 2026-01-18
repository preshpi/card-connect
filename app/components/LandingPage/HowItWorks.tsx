import Image from "next/image";
import { Icons } from "../ui/Icon";
import StepCard from "../stepCard";

const HowItWorks = () => {
  return (
    <section className="w-full relative h-full py-20">
      <div className="max-w-336 mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl xl:text-6xl font-bold text-gray-900 leading-tight">
            Three{" "}
            <div className="relative inline-flex gap-2">
              <div className="hidden md:block absolute right-6 -bottom-33 z-10">
                <Icons.leafIcon />
              </div>
              <span className="relative inline-block">
                <span className="text-[#7269E3]">Networking</span>
              </span>{" "}
            </div>{" "}
            Steps
          </h2>
        </div>

        {/* Steps */}
        <Image
          src="/line.svg"
          alt="line"
          width={600}
          height={600}
          className="absolute left-[50%] translate-x-[-50%] z-0 hidden lg:block"
        />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            step="Step 1"
            title="Order Your CardConnect"
            from="from-[#EEF2FF]"
            to="to-[#d4ddfa]"
          />

          <StepCard
            step="Step 2"
            title="Customize with your details"
            from="from-[#F4F3FF]"
            to="to-[#ECEBFF]"
          />

          <StepCard
            step="Step 3"
            title="Tap to share your profile"
            from="from-[#ECFDF5]"
            to="to-[#D1FAE5]"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
