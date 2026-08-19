import { Icons } from "../ui/Icon";

const Benefit = () => {
  return (
    <section className="py-20 md:py-24 bg-[#F5FAF7]">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Why Choose Our
              <br />
              <span className="text-[#7269E3]">NFC Cards</span>
            </h2>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* One-Time Payment */}
            <div className="relative rounded-3xl p-8 md:py-12 md:px-6 text-white overflow-hidden bg-linear-to-br from-[#7269E3] to-[#4F46E5]">
              {/* subtle glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%)]" />

              <div className="relative z-10">
                <div className="w-16 h-16 flex items-center justify-center mb-8">
                  <Icons.nfcIcon className="text-white" />
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                  One-Time Payment
                  <br />
                  Advantage
                </h3>

                <p className="text-base md:text-lg text-white/90 leading-relaxed">
                  Enjoy full ownership with no ongoing subscription fees.
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="relative rounded-3xl p-8 md:py-12 md:px-6 text-white overflow-hidden bg-linear-to-br from-[#0F172A] to-[#020617]">
              {/* subtle glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(114,105,227,0.25),transparent_45%)]" />

              <div className="relative z-10">
                <div className="w-16 h-16 flex items-center justify-center mb-8">
                  <Icons.securityShield className="text-white" />
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                  Your Security is
                  <br />
                  Our Priority
                </h3>

                <p className="text-base md:text-lg text-white/85 leading-relaxed">
                  Experience peace of mind with advanced data protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefit;
