"use client";

import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="w-full flex justify-center">
      {/* iPhone frame: 390px wide, 844px tall with proper proportions */}
      <div
        className="relative"
        style={{ width: "336px", aspectRatio: "9/19.5" }}
      >
        {/* Outer black bezel with rounded corners */}
        <div
          className="absolute inset-0 bg-black rounded-3xl shadow-2xl"
          style={{ padding: "12px" }}
        >
          {/* Screen with rounded corners matching iPhone */}
          <div className="w-full h-full bg-white rounded-3xl overflow-hidden flex flex-col relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-5 bg-black rounded-b-3xl z-10"></div>

            {/* Content area - scrollable */}
            <div className="flex-1 overflow-y-auto w-full">{children}</div>

            {/* Home indicator - safe area bottom */}
            <div className="h-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
