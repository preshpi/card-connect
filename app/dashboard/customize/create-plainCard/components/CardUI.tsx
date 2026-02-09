"use client";

import React from "react";
import Image from "next/image";
import { PATTERNS } from "@/app/utils/general";

interface CardUIProps {
  values: {
    pattern: string;
    patternOpacity: number;
    hasLogo: string;
    bgColor: string;
    fontSize: string;
    fontWidth: string;
    fontFamily: string;
    logoFile: File | string | null;
    text: string;
    imageSize: number;
    logoPosition: string;
    logoSpacing: number;
  };
}

const CardUI = ({ values }: CardUIProps) => {
  const logoSrc = values.logoFile
    ? values.logoFile instanceof File
      ? URL.createObjectURL(values.logoFile)
      : values.logoFile
    : null;

  // Extract numeric font weight from the string "400 (Normal)"
  const fontWeight = values.fontWidth.split(" ")[0];
  const activePattern = PATTERNS.find((p) => p.id === values.pattern);

  // Determine layout based on logo position
  const getLayoutClasses = () => {
    const position = values.logoPosition || "center";
    switch (position) {
      case "top":
        return "flex-col items-center";
      case "bottom":
        return "flex-col-reverse items-center";
      case "left":
        return "flex-row items-center";
      case "right":
        return "flex-row-reverse items-center";
      case "center":
      default:
        return "flex-col items-center";
    }
  };

  return (
    <div
      className="w-full h-full rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center border border-black/5 animate-in fade-in zoom-in-95 duration-300"
      style={{
        backgroundColor: values.bgColor,
        fontFamily: values.fontFamily,
      }}
    >
      {/* --- PATTERN LAYER --- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: activePattern?.css,
          backgroundSize: activePattern?.size || "cover", // Use the size from the object
          opacity: values.patternOpacity / 100,
          backgroundRepeat: "repeat", // Ensure it tiles
        }}
      />

      {/* --- CONTENT LAYER --- */}
      <div
        className={`z-10 flex ${getLayoutClasses()} px-8`}
        style={{ gap: `${values.logoSpacing || 16}px` }}
      >
        {values.hasLogo === "yes" && logoSrc && (
          <div className="flex justify-center shrink-0">
            <Image
              src={logoSrc}
              alt="User Logo"
              width={values.imageSize || 100}
              height={values.imageSize || 100}
              style={{
                width: `${values.imageSize || 100}px`,
                height: `${values.imageSize || 100}px`,
              }}
              className="object-contain"
            />
          </div>
        )}
        {/* --- TEXT LAYER --- */}
        {values.text && (
          <p
            className="text-white uppercase tracking-[0.2em] leading-tight"
            style={{
              fontSize: values.fontSize, // e.g., "16 px"
              fontWeight: fontWeight, // e.g., "400"
              textAlign:
                values.logoPosition === "left" ||
                values.logoPosition === "right"
                  ? "left"
                  : "center",
            }}
          >
            {values.text || "Your Text Here"}
          </p>
        )}
      </div>

      {/* Subtle Gloss Effect */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default CardUI;
