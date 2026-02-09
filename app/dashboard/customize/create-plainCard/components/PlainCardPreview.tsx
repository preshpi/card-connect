/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft } from "lucide-react";
import CardUI from "./CardUI";
import { isColorLight } from "@/app/utils/general";
import Image from "next/image";
import Logo from "@/public/assets/LogoWhite.svg";
import BlackLogo from "@/public/assets/Logo.svg";

export default function PlainCardPreview({ values, onBack, onCheckout }: any) {
  const [view, setView] = useState<"front" | "back">("front");

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={onBack}
        className="self-start lg:hidden mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* View Switcher */}
      <div className="bg-gray-200 p-1 rounded-full flex w-full max-w-xs mb-10">
        <button
          onClick={() => setView("front")}
          className={`flex-1 py-2 cursor-pointer rounded-full text-sm ${view === "front" ? "bg-white shadow" : ""}`}
        >
          Front View
        </button>
        <button
          onClick={() => setView("back")}
          className={`flex-1 py-2 cursor-pointer rounded-full text-sm ${view === "back" ? "bg-white shadow" : ""}`}
        >
          Back View
        </button>
      </div>

      {/* Actual Card Display */}
      <div className="w-full max-w-md aspect-[1.6/1]">
        {view === "front" ? (
          <CardUI values={values} />
        ) : (
          /* BACK VIEW - Now uses the selected bgColor */
          <div
            className="w-full h-full rounded-2xl flex flex-col items-center justify-center shadow-xl transition-colors duration-300 relative overflow-hidden"
            style={{ backgroundColor: values.bgColor }}
          >
            {/* Optional: Add the pattern to the back too for extra detail */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url('/assets/patterns/${values.pattern}.svg')`,
                backgroundSize: "cover",
              }}
            />

            {/* QR Code container - always white for scan-ability */}
            <div className="z-10 bg-white p-4 rounded-xl shadow-lg">
              <QRCodeSVG
                value={values.link || "https://example.com"}
                size={110}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>

            <p
              className="mt-4 text-xs font-medium uppercase tracking-widest z-10"
              style={{ color: isColorLight(values.bgColor) ? "#000" : "#fff" }}
            >
              Scan to connect
            </p>

            <div className="absolute bottom-0 left-0 px-5 py-3">
              <Image
                src={values.bgColor === "#FFFFFF" ? BlackLogo : Logo}
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
        onClick={onCheckout}
        className="w-full max-w-md mt-64 py-4 bg-[#7269E3] text-white shadow-indigo-100 cursor-pointer hover:bg-[#5355d1] rounded-full border-[#7269E3] inner-shadow-md border font-bold"
      >
        Checkout
      </button>
    </div>
  );
}
