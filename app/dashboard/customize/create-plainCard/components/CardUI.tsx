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

      {/* TODO:: FIX IMAGE SIZE */}
      {/* --- CENTER TEXT LAYER --- */}
      <div className="z-10 text-center px-8">
        {values.hasLogo === "yes" && logoSrc && (
          <div className="flex justify-center mb-4">
            <Image
              src={logoSrc}
              alt="User Logo"
              width={values.imageSize || 70}
              height={values.imageSize || 70}
              className=" w-auto object-contain"
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
