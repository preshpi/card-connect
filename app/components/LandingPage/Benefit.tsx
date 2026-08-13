"use client";
import { Icons } from "../ui/Icon";
import Reveal from "../ui/Reveal";

const Benefit = () => {
  return (
    <section className="py-20 md:py-24 bg-[#2E3132]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <Reveal direction="left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-12">
              Why Choose Our
              <br />
              NFC Cards
            </h2>

            {/* Benefits List */}
            <div className="space-y-8">
              {/* One-Time Payment */}
              <div className="flex gap-6">
                <div className="shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#7269E3]/20">
                    <Icons.nfcIcon className="text-[#7269E3]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    One-Time Payment Advantage
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Enjoy full ownership with no ongoing subscription fees. Your
                    card and your profile stay yours forever.
                  </p>
                </div>
              </div>

              {/* Security */}
              <div className="flex gap-6">
                <div className="shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#7269E3]/20">
                    <Icons.securityShield className="text-[#7269E3]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Your Security is Our Priority
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Experience peace of mind with advanced data protection and
                    privacy controls for your public profile.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Image */}
          <Reveal
            direction="right"
            delay={0.15}
            className="hidden md:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-linear-to-br from-purple-900 to-gray-900">
              {/* Placeholder for product image */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p className="text-lg">Product Image</p>
                  <p className="text-sm mt-2">(NFC Card)</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Benefit;
