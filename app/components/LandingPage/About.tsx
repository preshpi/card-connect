import { Icons } from "../ui/Icon";

const About = () => {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Centered Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            Ditch Paper Cards for
            <br />
            <span className="text-[#10B981]">
              Sustainable Digital Solutions
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Every year, 100 billion paper business cards are discarded,
            contributing to environmental waste. By switching to NFC cards, you
            reduce waste and simplify how you share your details.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eco Friendly Card */}
          <div className="p-8 md:p-10 rounded-2xl border border-[#10B981] hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-6">
              <Icons.recycleIcon className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Eco Friendly
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Reduce waste and lower your carbon footprint with one reusable
              card. One CardConnect equals roughly 2,000 traditional paper cards
              over its lifetime.
            </p>
          </div>

          {/* Cost Effective Card */}
          <div className="p-8 md:p-10 rounded-2xl border border-[#3C2FAA] hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 rounded-full bg-[#EDE9FE] flex items-center justify-center mb-6">
              <Icons.costIcon className="w-8 h-8 text-[#7269E3]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cost Effective
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Pay once and update your details anytime without reprinting. Save
              thousands on design and printing costs year after year.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
