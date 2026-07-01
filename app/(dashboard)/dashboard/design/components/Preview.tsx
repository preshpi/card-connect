"use client";

import Image from "next/image";
import React from "react";
import { useDesignStore } from "@/app/store/useDesignStore";
import { useAuthStore } from "@/app/store/useAuthStore";

const DesignPreview = () => {
  const customization = useDesignStore((state) => state.customization);
  const user = useAuthStore((state) => state.user);

  const fullName = user?.fullName || "Your Name";
  const profileImage = user?.profileImage;
  const bio = user?.bio || "Your bio goes here";

  // Sample links for preview
  const sampleLinks = [
    { id: 1, title: "My Portfolio", url: "https://example.com" },
    { id: 2, title: "GitHub", url: "https://github.com" },
    { id: 3, title: "LinkedIn", url: "https://linkedin.com" },
  ];

  // Determine button style classes
  const getButtonClasses = () => {
    const baseClasses =
      "w-full py-3 px-4 rounded-xl font-medium transition-opacity hover:opacity-90";

    switch (customization.buttonStyle) {
      case "Fill":
        return `${baseClasses} bg-purple-600 text-white`;
      case "Outline":
        return `${baseClasses} border-2 border-purple-600 text-purple-600 bg-transparent`;
      case "Ghost":
        return `${baseClasses} bg-gray-100 text-gray-900 hover:bg-gray-200`;
      default:
        return `${baseClasses} bg-purple-600 text-white`;
    }
  };

  // Determine font classes
  const getFontClasses = () => {
    switch (customization.textFont) {
      case "Manrope":
        return "font-sans";
      case "Poppins":
        return "font-sans";
      case "Inter":
        return "font-sans";
      case "Playfair":
        return "font-serif";
      default:
        return "font-sans";
    }
  };

  // Determine background
  const getBackgroundClasses = () => {
    switch (customization.backgroundColor) {
      case "Gradient":
        return "bg-gradient-to-br from-purple-600 to-blue-600";
      case "Solid":
        return "bg-purple-600";
      case "Light":
        return "bg-gradient-to-br from-purple-100 to-blue-100";
      case "Dark":
        return "bg-gradient-to-br from-gray-900 to-gray-800";
      default:
        return "bg-gradient-to-br from-purple-600 to-blue-600";
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Preview Card */}
      <div
        className={`rounded-3xl overflow-hidden shadow-2xl border border-gray-200 transition-all duration-300 ${getBackgroundClasses()}`}
      >
        {/* Header Section */}
        <div className="h-32 bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-sm" />

        {/* Profile Section */}
        <div className="px-6 py-8 flex flex-col items-center gap-4 -mt-16 relative z-10">
          {/* Profile Image */}
          <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg flex-shrink-0">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={fullName}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name and Bio */}
          <div className={`text-center ${getFontClasses()}`}>
            <p className="font-bold text-xl text-white mb-1">{fullName}</p>
            <p className="text-sm text-white/90">{bio}</p>
          </div>
        </div>

        {/* Links Section */}
        <div className="px-6 pb-8 space-y-3">
          {sampleLinks.map((link) => (
            <button
              key={link.id}
              className={`${getButtonClasses()} transition-all duration-300`}
            >
              {link.title}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-white/70">Powered by CardConnect</p>
        </div>
      </div>

      {/* Preview Info */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Header:</span>{" "}
          {customization.headerStyle} •{" "}
          <span className="font-medium">Buttons:</span>{" "}
          {customization.buttonStyle}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          <span className="font-medium">Font:</span> {customization.textFont} •{" "}
          <span className="font-medium">Background:</span>{" "}
          {customization.backgroundColor}
        </p>
      </div>
    </div>
  );
};

export default DesignPreview;
