"use client";

import { useDesignStore } from "@/app/store/useDesignStore";
import { FONT_CLASS_MAP } from "@/app/lib/fonts";
import { FontId } from "@/app/types/design";

const FONT_OPTIONS: Array<{ id: FontId; name: string; description: string }> = [
  { id: "manrope", name: "Manrope", description: "Friendly and modern" },
  { id: "poppins", name: "Poppins", description: "Bold and geometric" },
  { id: "inter", name: "Inter", description: "Clean and readable" },
  { id: "playfair", name: "Playfair", description: "Elegant and serif" },
];

export default function TypographySection() {
  const draft = useDesignStore((state) => state.draft);
  const setDraft = useDesignStore((state) => state.setDraft);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Typography</h2>
      <p className="text-sm text-gray-600 mb-4">Choose a font for your profile</p>

      <div className="space-y-3">
        {FONT_OPTIONS.map((font) => {
          const fontClass = FONT_CLASS_MAP[font.id];
          const isSelected = draft.font === font.id;

          return (
            <button
              key={font.id}
              onClick={() => setDraft({ font: font.id as any })}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-purple-600 bg-purple-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold text-gray-900 ${fontClass}`}>
                  {font.name}
                </h3>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.293 5.293a1 1 0 011.414 1.414l-10 10a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L11 14.586l9.293-9.293z" />
                    </svg>
                  </div>
                )}
              </div>
              <p className={`text-sm text-gray-600 ${fontClass}`}>
                {font.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
