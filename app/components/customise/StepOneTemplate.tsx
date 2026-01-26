"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/app/store/useBuilderStore";
import Image from "next/image";
import PlainCard from "@/public/assets/PlainCard.svg";
import CodeCard from "@/public/assets/codeCard.svg";

const StepOneTemplate = () => {
  const router = useRouter();
  // We only pull what we need for this step
  const { selectedTemplate, setTemplate } = useBuilderStore();

  const handleContinue = () => {
    if (selectedTemplate) {
      router.push("/dashboard/customize/create-codeCard"); // Move to Step 2
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customize</h1>
        <p className="text-gray-500">Choose a template to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code Card Option */}
        <button
          onClick={() => setTemplate("code")}
          className={`group relative flex flex-col p-6 rounded-3xl border-2 transition-all text-left ${
            selectedTemplate === "code"
              ? "border-[#6366F1] bg-neutral-50 shadow-md"
              : "border-gray-100 bg-neutral-50 hover:border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-[#1B231F]">Code Card</h3>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedTemplate === "code"
                  ? "border-[#05BF04] border-2"
                  : "border-gray-300 border-2"
              }`}
            >
              {selectedTemplate === "code" && (
                <div className="w-2.5 h-2.5 bg-[#05BF04] rounded-full" />
              )}
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-6">
            A clean developer-style card. Update your info and generate your
            custom design.
          </p>

          {/* Visual representation of the card */}
          <Image
            src={CodeCard}
            alt="code-card"
            width={150}
            height={150}
            className="w-full"
          />
        </button>

        {/* Plain Card Option */}
        <button
          onClick={() => setTemplate("plain")}
          className={`group relative flex flex-col p-6 rounded-3xl border-2 transition-all text-left ${
            selectedTemplate === "plain"
              ? "border-[#6366F1] bg-neutral-50 shadow-md"
              : "border-gray-100 bg-neutral-50 hover:border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-[#1B231F]">Plain Card</h3>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedTemplate === "plain"
                  ? "border-[#05BF04] border-2"
                  : "border-gray-300 border-2"
              }`}
            >
              {selectedTemplate === "plain" && (
                <div className="w-2.5 h-2.5 bg-[#05BF04] rounded-full" />
              )}
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-6">
            A minimal card you can tailor. Personalize it and preview your
            design instantly.
          </p>

          <Image
            src={PlainCard}
            alt="plain-card"
            width={100}
            height={100}
            className="w-full"
          />
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={handleContinue}
          disabled={!selectedTemplate}
          className={`px-16 py-4 rounded-full font-bold transition-all ${
            selectedTemplate
              ? "bg-[#7269E3] text-white shadow-indigo-100 cursor-pointer hover:bg-[#5355d1]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepOneTemplate;
