"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, AlertCircle, Check } from "lucide-react";
import { CodeCardSchema, CodeCardValues } from "@/app/types/customize/codeCard";
import { useBuilderStore } from "@/app/store/useBuilderStore";
import { CODE_THEMES } from "@/app/utils/general";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import Logo from "@/public/assets/LogoWhite.svg";
import BlackLogo from "@/public/assets/Logo.svg";

const DetailsPage = () => {
  const router = useRouter();
  const { setDetails, ...storedData } = useBuilderStore();

  const [mobileStep, setMobileStep] = useState<"form" | "preview">("form");
  const [cardView, setCardView] = useState<"front" | "back">("front");

  // Initialize Form
  const {
    register,
    handleSubmit,
    watch,
    setValue, // Needed to manually set the theme
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CodeCardValues>({
    resolver: zodResolver(CodeCardSchema),
    defaultValues: {
      fullName: storedData.fullName,
      role: storedData.role,
      email: storedData.email,
      link: storedData.link,
      availableForJob: storedData.availableForJob,
      theme: storedData.theme ? storedData.theme : "vscode", // Always provide a string
    },
  });

  // Watch for changes to update Zustand
  useEffect(() => {
    const subscription = watch((values) => {
      // @ts-ignore - partial update is fine
      setDetails(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, setDetails]);

  // Get current theme data for rendering
  const currentThemeKey = watch("theme") ?? "vscode";
  const activeTheme = CODE_THEMES[currentThemeKey];

  const onProceed = (data: CodeCardValues) => {
    setDetails(data);
    setMobileStep("preview");
  };

  const handleCheckout = async () => {
    const valid = await trigger();
    if (valid) {
      setDetails(getValues());
      router.push("/dashboard/capture");
    }
  };

  const handleMobileBack = () => {
    setMobileStep("form");
  };

  return (
    <div className="flex flex-col pt-8 lg:flex-row min-h-screen text-[#1B231F]">
      {/* --- LEFT COLUMN: FORM --- */}
      <div
        className={`flex-1 ${mobileStep === "preview" ? "hidden lg:block" : "block"}`}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#52525B] mb-8 hover:text-black transition-colors"
        >
          <div className="p-1 rounded-full border-2 border-[#7269E3]">
            <ArrowLeft size={16} color="#7269E3" />
          </div>
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-8">Enter your details</h1>

        <form onSubmit={handleSubmit(onProceed)} className="space-y-5">
          <InputField
            label="Full Name"
            registration={register("fullName")}
            error={errors.fullName?.message}
            placeholder="Enter full name"
          />
          <InputField
            label="Email Address"
            registration={register("email")}
            error={errors.email?.message}
            placeholder="Enter email address"
          />
          <InputField
            label="Role"
            registration={register("role")}
            error={errors.role?.message}
            placeholder="Enter role"
          />
          <InputField
            label="Link"
            registration={register("link")}
            error={errors.link?.message}
            placeholder="Enter URL link"
          />

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">
              Available for Job?
            </label>
            <div className="relative">
              <select
                {...register("availableForJob")}
                className={`w-full p-3 bg-white border rounded-xl appearance-none focus:ring-2 outline-none transition-all ${
                  errors.availableForJob
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-indigo-100"
                }`}
              >
                <option value="">Select an option</option>
                <option value="true">Yes, available</option>
                <option value="false">No, occupied</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
            {errors.availableForJob && (
              <p className="text-red-500 text-xs mt-1">
                {errors.availableForJob.message}
              </p>
            )}
          </div>

          {/* --- THEME SELECTOR --- */}
          <div>
            <label className="block text-sm font-bold mb-3 text-gray-700">
              Select Theme
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(CODE_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("theme", key)}
                  className={`relative w-12 h-12 cursor-pointer rounded-full border-2 transition-all flex items-center justify-center ${
                    currentThemeKey === key
                      ? "border-indigo-600 scale-110 shadow-md"
                      : "hover:scale-105 border-neutral-400"
                  }`}
                  style={{ backgroundColor: theme.bg }}
                  title={theme.label}
                >
                  {currentThemeKey === key && (
                    <Check
                      size={18}
                      className={theme.isLight ? "text-black" : "text-white"}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full my-8 py-4 cur bg-[#6366F1] text-white rounded-2xl font-bold lg:hidden shadow-lg shadow-indigo-200"
          >
            Proceed
          </button>
        </form>
      </div>

      {/* --- RIGHT COLUMN: PREVIEW --- */}
      <div
        className={`flex-1 bg-[#F9FAFB] lg:p-12 flex flex-col items-center ${mobileStep === "form" ? "hidden lg:flex" : "flex"}`}
      >
        {/* Mobile Header */}
        <div className="w-full flex items-center lg:hidden">
          <button
            type="button"
            onClick={handleMobileBack}
            className="flex items-center gap-2 text-[#52525B] mb-8 hover:text-black transition-colors"
          >
            <div className="p-1 rounded-full border-2 border-[#7269E3]">
              <ArrowLeft size={16} color="#7269E3" />
            </div>
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="bg-gray-200 p-1 rounded-full flex gap-1 mb-12 w-full max-w-[320px]">
          <button
            onClick={() => setCardView("front")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${cardView === "front" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
          >
            Front View
          </button>
          <button
            onClick={() => setCardView("back")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${cardView === "back" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
          >
            Back View
          </button>
        </div>

        {/* The Card */}
        <div className="w-full max-w-md aspect-[1.6/1] relative perspective-1000">
          {cardView === "front" ? (
            /* FRONT VIEW: Dynamic Styles based on ActiveTheme */
            <div
              className="w-full h-full rounded-2xl shadow-2xl p-6 font-mono text-sm animate-in fade-in zoom-in-95 duration-300 border border-black/5"
              style={{
                backgroundColor: activeTheme.bg,
                color: activeTheme.text,
              }}
            >
              <div className="flex gap-1.5 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>

              <div
                className="mb-3 text-xs opacity-50"
                style={{ color: activeTheme.tokens.comment }}
              >
                // Developer Business Card
              </div>

              <div className="leading-relaxed text-xs sm:text-sm">
                <span className="select-none mr-4 opacity-30">1</span> {`{`}{" "}
                <br />
                <span className="select-none mr-4 opacity-30">2</span>
                <span
                  className="pl-2"
                  style={{ color: activeTheme.tokens.key }}
                >
                  "name"
                </span>
                :
                <span style={{ color: activeTheme.tokens.string }}>
                  {" "}
                  "{storedData.fullName || "@username"}"
                </span>
                ,<br />
                <span className="select-none mr-4 opacity-30">3</span>
                <span
                  className="pl-2"
                  style={{ color: activeTheme.tokens.key }}
                >
                  "email"
                </span>
                :
                <span style={{ color: activeTheme.tokens.string }}>
                  {" "}
                  "{storedData.email || "mail@example.com"}"
                </span>
                ,<br />
                <span className="select-none mr-4 opacity-30">4</span>
                <span
                  className="pl-2"
                  style={{ color: activeTheme.tokens.key }}
                >
                  "role"
                </span>
                :
                <span style={{ color: activeTheme.tokens.string }}>
                  {" "}
                  "{storedData.role || "developer"}"
                </span>
                ,<br />
                <span className="select-none mr-4 opacity-30">5</span>
                <span
                  className="pl-2"
                  style={{ color: activeTheme.tokens.key }}
                >
                  "available"
                </span>
                :
                <span style={{ color: activeTheme.tokens.boolean }}>
                  {" "}
                  {storedData.availableForJob || "true"}
                </span>
                <br />
                <span className="select-none mr-4 opacity-30">6</span> {`}`}
              </div>
            </div>
          ) : (
            /* BACK VIEW: Dynamic Background */
            <div
              className="w-full h-full rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden border border-black/5"
              style={{ backgroundColor: activeTheme.bg }}
            >
              {/* Pattern effect */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle, ${activeTheme.tokens.key} 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>

              <div className="z-10 bg-white p-4 rounded-xl shadow-lg">
                {/* <QrCode size={100} className="text-black" /> */}
                <QRCodeSVG
                  value={storedData.link || "https://example.com"}
                  size={100}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                />
              </div>
              <p
                className="z-10 text-xs mt-4 font-mono opacity-70"
                style={{ color: activeTheme.text }}
              >
                Scan to connect
              </p>

              <div className="absolute bottom-0 left-0 px-5 py-3">
                <Image
                  src={
                    CODE_THEMES.github_light.bg === activeTheme.bg
                      ? BlackLogo
                      : Logo
                  }
                  alt="logo"
                  width={100}
                  height={100}
                  priority
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="w-full cursor-pointer max-w-md mt-auto lg:mt-72 py-4 bg-[#6366F1] text-white rounded-2xl font-bold hover:bg-[#5355d1] transition-all shadow-lg shadow-indigo-200"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

// Helper Input Component
const InputField = ({ label, registration, error, placeholder }: any) => (
  <div>
    <label className="block text-sm font-bold mb-2 text-gray-700">
      {label}
    </label>
    <input
      {...registration}
      placeholder={placeholder}
      className={`w-full p-3 border rounded-xl focus:ring-2 outline-none transition-all ${
        error
          ? "border-red-500 focus:ring-red-100"
          : "border-gray-200 focus:ring-indigo-100"
      }`}
    />
    {error && (
      <div className="flex items-center gap-1 text-red-500 mt-1">
        <AlertCircle size={12} />
        <p className="text-xs">{error}</p>
      </div>
    )}
  </div>
);

export default DetailsPage;
