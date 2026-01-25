import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F5FAF7]">
      <div className="container mx-auto">
        <div className="bg-linear-to-br from-green-100/80 via-green-50/60 to-purple-100/80 rounded-3xl p-8 md:p-12 lg:p-16 backdrop-blur-sm border border-white/50 shadow-xl">
          <div className=" md:px-16 text-left">
            {/* max-w-4xl mx-auto */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Ready to Elevate Your
              <br />
              Networking?
            </h2>

            <p className="text-lg md:text-xl text-gray-700 mb-8 md:mb-12 leading-relaxed max-w-2xl">
              Transform how you connect, customize your NFC business card today
              and leave a lasting impression.
            </p>
            <Link href="/signup">
              <button className="bg-[#7269E3] cursor-pointer hover:bg-[#7269E3]/102 text-white px-12 lg:py-6 py-3 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl w-full ">
                Build My Smart Card
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
