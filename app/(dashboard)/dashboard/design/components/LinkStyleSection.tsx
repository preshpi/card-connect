"use client";

import { useDesignStore } from "@/app/store/useDesignStore";

const LINK_STYLES = [
  { id: "button", name: "Button", description: "Simple rounded button" },
  { id: "card", name: "Card", description: "Image on top, title underneath" },
  {
    id: "split-card",
    name: "Split Card",
    description: "Image on left, text on right",
  },
];

export default function LinkStyleSection() {
  const draft = useDesignStore((state) => state.draft);
  const setDraft = useDesignStore((state) => state.setDraft);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Link Style</h2>
      <p className="text-sm text-gray-600 mb-4">
        Choose how your links will be displayed
      </p>

      <div className="space-y-3">
        {LINK_STYLES.map((style) => {
          const isSelected = draft.linkStyle === style.id;

          return (
            <button
              key={style.id}
              onClick={() => setDraft({ linkStyle: style.id as any })}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-purple-600 bg-purple-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {style.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
