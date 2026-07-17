const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Order Your CardConnect",
      description:
        "Choose from our premium materials—matte black, recycled ocean plastic, or sustainable bamboo.",
    },
    {
      number: "2",
      title: "Customize With Your Details",
      description:
        "Use our intuitive dashboard to link your LinkedIn, portfolio, and contact details instantly.",
    },
    {
      number: "3",
      title: "Tap to Share Your Profile",
      description:
        "Simply tap your card to any NFC-enabled smartphone. No app required for your connections.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            Three <span className="text-[#7269E3]">Networking Steps</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            How to revolutionize your professional presence in minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 md:p-12 rounded-2xl shadow-sm overflow-hidden ${
                index === 1 ? "md:translate-y-12" : ""
              }`}
            >
              {/* Ghost Number Background */}
              <div className="absolute top-0 right-[-1rem] z-40 text-9xl font-bold text-gray-200 opacity-50  leading-none">
                {step.number}
              </div>

              {/* Step Number Label */}
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <div className="h-0.5 w-8 bg-[#7269E3]"></div>
                <span className="text-sm font-semibold text-[#7269E3] tracking-wider">
                  STEP {step.number}
                </span>
              </div>

              {/* Step Content */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 relative z-10">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
