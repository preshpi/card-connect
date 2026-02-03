/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft } from "lucide-react";
import CardUI from "./CardUI";
import { isColorLight } from "@/app/utils/general";

export default function PlainCardPreview({ values, onBack }: any) {
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
          className={`flex-1 py-2 rounded-full text-sm ${view === "front" ? "bg-white shadow" : ""}`}
        >
          Front View
        </button>
        <button
          onClick={() => setView("back")}
          className={`flex-1 py-2 rounded-full text-sm ${view === "back" ? "bg-white shadow" : ""}`}
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
          </div>
        )}
      </div>

      <button className="w-full max-w-md mt-auto py-4 bg-indigo-600 text-white rounded-2xl font-bold">
        Checkout
      </button>
    </div>
  );
}
