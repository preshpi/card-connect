"use client";

import Image from "next/image";
import { useDesignStore } from "@/app/store/useDesignStore";
import { THEMES } from "@/app/config/themes";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function ThemeSelector() {
  const draft = useDesignStore((state) => state.draft);
  const setDraft = useDesignStore((state) => state.setDraft);
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme</h2>
      <p className="text-sm text-gray-600 mb-6">
        Choose how your profile layout will look
      </p>

      <div className="grid grid-cols-2 gap-4">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setDraft({ theme: theme.id })}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              draft.theme === theme.id
                ? "border-purple-600 bg-purple-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {/* Simple preview mockup */}
            <div className="mb-3 overflow-hidden rounded-lg h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                {theme.id === "minimal" ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-white mx-auto" />
                    <div className="text-xs text-gray-600">Centered</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="h-6 bg-white/50 mx-auto w-16" />
                    <div className="w-10 h-10 rounded-full bg-white mx-auto relative -mt-3" />
                    <div className="text-xs text-gray-600">Spotlight</div>
                  </div>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {theme.name}
            </h3>
            <p className="text-xs text-gray-600">
              {theme.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
