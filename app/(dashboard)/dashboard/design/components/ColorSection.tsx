"use client";

import { useState } from "react";
import { useDesignStore } from "@/app/store/useDesignStore";

const COLOR_SWATCHES = [
  "#FFFFFF",
  "#F3F4F6",
  "#E5E7EB",
  "#D1D5DB",
  "#111111",
  "#1F2937",
];

const BUTTON_COLOR_SWATCHES = [
  "#7269E3",
  "#FF5A5F",
  "#10B981",
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
];

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  swatches: string[];
}

function ColorInput({ label, value, onChange, swatches }: ColorInputProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>

      {/* Swatches */}
      <div className="flex gap-2 mb-2">
        {swatches.map((color) => (
          <button
            key={color}
            onClick={() => {
              onChange(color);
              setShowCustom(false);
            }}
            className={`w-8 h-8 rounded-lg border-2 transition-all ${
              value === color ? "border-gray-900 ring-2 ring-offset-2" : "border-gray-300 hover:border-gray-400"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`w-8 h-8 rounded-lg border-2 font-bold text-xs flex items-center justify-center transition-all ${
            showCustom
              ? "border-purple-600 bg-purple-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          +
        </button>
      </div>

      {/* Custom color picker */}
      {showCustom && (
        <div className="mt-2 flex gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const hex = e.target.value;
              if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
                onChange(hex);
              }
            }}
            placeholder="#000000"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}
    </div>
  );
}

export default function ColorSection() {
  const draft = useDesignStore((state) => state.draft);
  const setDraft = useDesignStore((state) => state.setDraft);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Colors</h2>

      <ColorInput
        label="Background Color"
        value={draft.backgroundColor}
        onChange={(color) => setDraft({ backgroundColor: color })}
        swatches={COLOR_SWATCHES}
      />

      <ColorInput
        label="Text Color"
        value={draft.textColor}
        onChange={(color) => setDraft({ textColor: color })}
        swatches={COLOR_SWATCHES}
      />

      <ColorInput
        label="Button Color"
        value={draft.buttonColor}
        onChange={(color) => setDraft({ buttonColor: color })}
        swatches={BUTTON_COLOR_SWATCHES}
      />
    </div>
  );
}
