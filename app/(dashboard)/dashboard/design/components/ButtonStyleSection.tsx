"use client";

import { useDesignStore } from "@/app/store/useDesignStore";

const BUTTON_STYLES = [
  { id: "filled", name: "Filled", description: "Solid colored buttons" },
  { id: "outline", name: "Outline", description: "Bordered buttons" },
  { id: "soft", name: "Soft", description: "Light background buttons" },
];

export default function ButtonStyleSection() {
  const draft = useDesignStore((state) => state.draft);
  const setDraft = useDesignStore((state) => state.setDraft);

  const getPreviewButtonStyle = (style: string) => {
    if (style === "filled") {
      return {
        backgroundColor: draft.buttonColor,
        color: "white",
      };
    } else if (style === "outline") {
      return {
        borderColor: draft.buttonColor,
        color: draft.buttonColor,
        border: "1px solid",
        backgroundColor: "transparent",
      };
    } else {
      return {
        backgroundColor: draft.buttonColor + "1F",
        color: draft.buttonColor,
      };
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Button Style</h2>
      <p className="text-sm text-gray-600 mb-4">
        Choose how your link buttons will look
      </p>

      <div className="space-y-3">
        {BUTTON_STYLES.map((style) => {
          const isSelected = draft.buttonStyle === style.id;

          return (
            <button
              key={style.id}
              onClick={() => setDraft({ buttonStyle: style.id as any })}
              className={`w-full p-4 rounded-xl border transition-all ${
                isSelected
                  ? "border-purple-600 bg-purple-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-left">
                    {style.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 text-left">
                    {style.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
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

              {/* Preview button */}
              <button
                className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                style={getPreviewButtonStyle(style.id)}
                disabled
              >
                Sample Button
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}
