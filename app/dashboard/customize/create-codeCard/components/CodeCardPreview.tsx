import { CODE_THEMES } from "@/app/utils/general";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import Logo from "@/public/assets/LogoWhite.svg";
import BlackLogo from "@/public/assets/Logo.svg";

const CodeCardPreview = ({
  mobileStep,
  handleMobileBack,
  handleCheckout,
  cardView,
  setCardView,
  activeTheme,
  storedData,
}: any) => {
  return (
    <div
      className={`flex-1 bg-[#F9FAFB] lg:p-12 flex flex-col items-center ${mobileStep === "form" ? "hidden lg:flex" : "flex"}`}
    >
      {/* Mobile Header */}
      <div className="w-full flex items-center lg:hidden">
        <button
          type="button"
          onClick={handleMobileBack}
          className="flex items-center gap-2 text-[#52525B] mb-8 hover:text-black transition-colors"
        >
          <div className="p-1 rounded-full border-2 border-[#7269E3]">
            <ArrowLeft size={16} color="#7269E3" />
          </div>
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* View Toggle */}
      <div className="bg-gray-200 p-1 rounded-full flex gap-1 mb-12 w-full max-w-[320px]">
        <button
          onClick={() => setCardView("front")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${cardView === "front" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
        >
          Front View
        </button>
        <button
          onClick={() => setCardView("back")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${cardView === "back" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
        >
          Back View
        </button>
      </div>

      {/* The Card */}
      <div className="w-full max-w-md aspect-[1.6/1] relative perspective-1000">
        {cardView === "front" ? (
          /* FRONT VIEW: Dynamic Styles based on ActiveTheme */
          <div
            className="w-full h-full rounded-2xl shadow-2xl p-6 font-mono text-sm animate-in fade-in zoom-in-95 duration-300 border border-black/5"
            style={{
              backgroundColor: activeTheme.bg,
              color: activeTheme.text,
            }}
          >
            <div className="flex gap-1.5 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>

            <div
              className="mb-3 text-xs opacity-50"
              style={{ color: activeTheme.tokens.comment }}
            >
              // Developer Business Card
            </div>

            <div className="leading-relaxed text-xs sm:text-sm">
              <span className="select-none mr-4 opacity-30">1</span> {`{`}{" "}
              <br />
              <span className="select-none mr-4 opacity-30">2</span>
              <span className="pl-2" style={{ color: activeTheme.tokens.key }}>
                "name"
              </span>
              :
              <span style={{ color: activeTheme.tokens.string }}>
                {" "}
                "{storedData.fullName || "@username"}"
              </span>
              ,<br />
              <span className="select-none mr-4 opacity-30">3</span>
              <span className="pl-2" style={{ color: activeTheme.tokens.key }}>
                "email"
              </span>
              :
              <span style={{ color: activeTheme.tokens.string }}>
                {" "}
                "{storedData.email || "mail@example.com"}"
              </span>
              ,<br />
              <span className="select-none mr-4 opacity-30">4</span>
              <span className="pl-2" style={{ color: activeTheme.tokens.key }}>
                "role"
              </span>
              :
              <span style={{ color: activeTheme.tokens.string }}>
                {" "}
                "{storedData.role || "developer"}"
              </span>
              ,<br />
              <span className="select-none mr-4 opacity-30">5</span>
              <span className="pl-2" style={{ color: activeTheme.tokens.key }}>
                "available"
              </span>
              :
              <span style={{ color: activeTheme.tokens.boolean }}>
                {" "}
                {storedData.availableForJob || "true"}
              </span>
              <br />
              <span className="select-none mr-4 opacity-30">6</span> {`}`}
            </div>
          </div>
        ) : (
          /* BACK VIEW: Dynamic Background */
          <div
            className="w-full h-full rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden border border-black/5"
            style={{ backgroundColor: activeTheme.bg }}
          >
            {/* Pattern effect */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle, ${activeTheme.tokens.key} 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            ></div>

            <div className="z-10 bg-white p-4 rounded-xl shadow-lg">
              {/* <QrCode size={100} className="text-black" /> */}
              <QRCodeSVG
                value={storedData.link || "https://example.com"}
                size={100}
                bgColor="#ffffff"
                fgColor="#000000"
                level="L"
              />
            </div>
            <p
              className="z-10 text-xs mt-4 font-mono opacity-70"
              style={{ color: activeTheme.text }}
            >
              Scan to connect
            </p>

            <div className="absolute bottom-0 left-0 px-5 py-3">
              <Image
                src={
                  CODE_THEMES.github_light.bg === activeTheme?.bg
                    ? BlackLogo
                    : Logo
                }
                alt="logo"
                width={100}
                height={100}
                priority
                crossOrigin="anonymous"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        className="w-full cursor-pointer max-w-md mt-24 lg:mt-72 py-4 bg-[#6366F1] text-white rounded-full font-bold hover:bg-[#5355d1] transition-all shadow-lg shadow-indigo-200"
      >
        Checkout
      </button>
    </div>
  );
};

export default CodeCardPreview;
