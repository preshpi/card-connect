"use client";

import React, { useState } from "react";
import { useDesignStore } from "@/app/store/useDesignStore";
import { ChevronLeft } from "lucide-react";
import DesignPreview from "./components/Preview";

type ViewType = "main" | "header" | "button" | "text" | "background";

interface CustomizationOption {
  id: ViewType;
  label: string;
  icon: string;
  currentValue: string;
}

const CustomizeDesignPage = () => {
  const [currentView, setCurrentView] = useState<ViewType>("main");
  const customization = useDesignStore((state) => state.customization);
  const setHeaderStyle = useDesignStore((state) => state.setHeaderStyle);
  const setButtonStyle = useDesignStore((state) => state.setButtonStyle);
  const setTextFont = useDesignStore((state) => state.setTextFont);
  const setBackgroundColor = useDesignStore(
    (state) => state.setBackgroundColor,
  );

  const customizationOptions: CustomizationOption[] = [
    {
      id: "header",
      label: "Header",
      icon: "/assets/icons/Edit.svg",
      currentValue: customization.headerStyle,
    },
    {
      id: "button",
      label: "Button",
      icon: "/assets/icons/Edit.svg",
      currentValue: customization.buttonStyle,
    },
    {
      id: "text",
      label: "Text",
      icon: "/assets/icons/Edit.svg",
      currentValue: customization.textFont,
    },
    {
      id: "background",
      label: "Background",
      icon: "/assets/icons/Edit.svg",
      currentValue: customization.backgroundColor,
    },
  ];

  // ========== MAIN VIEW ==========
  const MainView = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Design Your Profile
      </h1>
      <p className="text-gray-600 mb-10">
        Customize how your profile looks to visitors
      </p>

      <div className="space-y-4 max-w-2xl">
        {customizationOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setCurrentView(option.id)}
            className="w-full flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0 group-hover:from-purple-200 group-hover:to-purple-100 transition-colors">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-purple-600"
                >
                  <path
                    d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 013 3L12 15H9v-3L18.5 2.5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {option.label}
                </h3>
                <p className="text-sm text-gray-500">
                  Current:{" "}
                  <span className="font-medium text-gray-700">
                    {option.currentValue}
                  </span>
                </p>
              </div>
            </div>

            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  // ========== HEADER VIEW ==========
  const HeaderView = () => {
    const headerOptions = [
      {
        id: "classic",
        label: "Classic",
        description: "Clean and minimal header",
      },
      { id: "modern", label: "Modern", description: "Contemporary design" },
      { id: "minimal", label: "Minimal", description: "Ultra simple header" },
      { id: "bold", label: "Bold", description: "Statement-making header" },
    ];

    return (
      <div>
        <button
          onClick={() => setCurrentView("main")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Header Style</h1>
        <p className="text-gray-600 mb-10">
          Choose how your profile header will appear
        </p>

        <div className="space-y-4 max-w-2xl">
          {headerOptions.map((option) => {
            const isSelected = customization.headerStyle === option.label;
            return (
              <button
                key={option.id}
                onClick={() => setHeaderStyle(option.label)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
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
  };

  // ========== BUTTON VIEW ==========
  const ButtonView = () => {
    const buttonOptions = [
      { id: "fill", label: "Fill", description: "Solid colored buttons" },
      { id: "outline", label: "Outline", description: "Bordered buttons" },
      { id: "ghost", label: "Ghost", description: "Light background buttons" },
    ];

    return (
      <div>
        <button
          onClick={() => setCurrentView("main")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Button Style</h1>
        <p className="text-gray-600 mb-10">
          Choose how your link buttons will look
        </p>

        <div className="space-y-4 max-w-2xl">
          {buttonOptions.map((option) => {
            const isSelected = customization.buttonStyle === option.label;
            return (
              <button
                key={option.id}
                onClick={() => setButtonStyle(option.label)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.293 5.293a1 1 0 011.414 1.414l-10 10a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L11 14.586l9.293-9.293z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Preview buttons */}
                <div className="space-y-2">
                  {option.label === "Fill" && (
                    <>
                      <button className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-purple-600 text-white">
                        Sample
                      </button>
                    </>
                  )}
                  {option.label === "Outline" && (
                    <button className="w-full py-2 px-4 rounded-lg text-sm font-medium border-2 border-purple-600 text-purple-600 bg-transparent">
                      Sample
                    </button>
                  )}
                  {option.label === "Ghost" && (
                    <button className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-gray-100 text-gray-900">
                      Sample
                    </button>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ========== TEXT VIEW ==========
  const TextView = () => {
    const textOptions = [
      { id: "manrope", label: "Manrope", description: "Friendly and modern" },
      { id: "poppins", label: "Poppins", description: "Bold and geometric" },
      { id: "inter", label: "Inter", description: "Clean and readable" },
      { id: "playfair", label: "Playfair", description: "Elegant and serif" },
    ];

    return (
      <div>
        <button
          onClick={() => setCurrentView("main")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Text Font</h1>
        <p className="text-gray-600 mb-10">
          Choose the font for your profile text
        </p>

        <div className="space-y-4 max-w-2xl">
          {textOptions.map((option) => {
            const isSelected = customization.textFont === option.label;
            return (
              <button
                key={option.id}
                onClick={() => setTextFont(option.label)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold text-gray-900`}>
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
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
  };

  // ========== BACKGROUND VIEW ==========
  const BackgroundView = () => {
    const backgroundOptions = [
      {
        id: "gradient",
        label: "Gradient",
        description: "Purple to blue gradient",
      },
      { id: "solid", label: "Solid", description: "Solid purple color" },
      { id: "light", label: "Light", description: "Light gradient" },
      { id: "dark", label: "Dark", description: "Dark gradient" },
    ];

    return (
      <div>
        <button
          onClick={() => setCurrentView("main")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Background</h1>
        <p className="text-gray-600 mb-10">
          Choose the background style for your profile
        </p>

        <div className="space-y-4 max-w-2xl">
          {backgroundOptions.map((option) => {
            const isSelected = customization.backgroundColor === option.label;
            return (
              <button
                key={option.id}
                onClick={() => setBackgroundColor(option.label)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-purple-600 bg-purple-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.293 5.293a1 1 0 011.414 1.414l-10 10a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L11 14.586l9.293-9.293z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Background preview */}
                <div
                  className={`h-12 rounded-lg ${
                    option.label === "Gradient"
                      ? "bg-gradient-to-br from-purple-600 to-blue-600"
                      : option.label === "Solid"
                        ? "bg-purple-600"
                        : option.label === "Light"
                          ? "bg-gradient-to-br from-purple-100 to-blue-100"
                          : "bg-gradient-to-br from-gray-900 to-gray-800"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ========== RENDER VIEW ==========
  const renderView = () => {
    switch (currentView) {
      case "header":
        return <HeaderView />;
      case "button":
        return <ButtonView />;
      case "text":
        return <TextView />;
      case "background":
        return <BackgroundView />;
      default:
        return <MainView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left: Customization Options */}
      <div className="hidden lg:flex flex-col flex-1 px-10 py-8 overflow-y-auto">
        {renderView()}
      </div>

      {/* Mobile: Stacked Layout */}
      <div className="flex flex-col lg:hidden w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-6 sticky top-16 z-10">
          {currentView !== "main" && (
            <button
              onClick={() => setCurrentView("main")}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            Design Your Profile
          </h1>
        </div>

        {/* Options */}
        <div className="px-4 py-6 overflow-y-auto flex-1">{renderView()}</div>

        {/* Preview on Mobile */}
        <div className="px-4 py-6 border-t border-gray-200 pb-20">
          <p className="text-sm font-medium text-gray-700 mb-4">Preview</p>
          <DesignPreview />
        </div>
      </div>

      {/* Right: Live Preview (Desktop Only) */}
      <div className="hidden lg:flex flex-col border-l border-gray-200 w-96 bg-white px-8 py-8 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Preview</h2>
        <div className="flex-1 flex items-start justify-center">
          <DesignPreview />
        </div>
      </div>
    </div>
  );
};

export default CustomizeDesignPage;
