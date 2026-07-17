import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-linear-to-br from-[#3C2FAA] via-[#6a5dd4] to-[#5a4dc4] rounded-[40px]">
      <div className="container mx-auto px-4 ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Ready to Elevate Your Networking?
          </h2>

          <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-12 leading-relaxed">
            Transform how you connect, customize your NFC business card today
            and leave a lasting impression. Join 50,000+ professionals
            worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-white text-[#7269E3] px-8 md:px-12 py-4 md:py-5 text-lg font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 hover:shadow-lg">
                Build My Smart Card
              </button>
            </Link>
            <Link href="/catalogue">
              <button className="border-2 border-white text-white px-8 md:px-12 py-4 md:py-5 text-lg font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
                View Catalogue
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
