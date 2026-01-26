"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, AlertCircle } from "lucide-react";
import { CodeCardSchema, CodeCardValues } from "@/app/types/customize/codeCard";
import { useBuilderStore } from "@/app/store/useBuilderStore";

const DetailsPage = () => {
  const router = useRouter();
  const { setDetails, ...storedData } = useBuilderStore();
  const [mobileStep, setMobileStep] = useState<"form" | "preview">("form");
  const [cardView, setCardView] = useState<"front" | "back">("front");

  // 1. Initialize Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CodeCardValues>({
    resolver: zodResolver(CodeCardSchema),
    defaultValues: {
      fullName: storedData.fullName,
      role: storedData.role,
      email: storedData.email,
      link: storedData.link,
      availableForJob: storedData.availableForJob,
    },
  });

  // 2. Sync form changes to Zustand for the Live Preview
  const watchedFields = watch();
  // useEffect(() => {
  //   setDetails(watchedFields);
  // }, [watchedFields, setDetails]);

  const onProceed = (data: CodeCardValues) => {
    setDetails(data);
    setMobileStep("preview");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* FORM SECTION */}
      <form
        onSubmit={handleSubmit(onProceed)}
        className={`flex-1 p-6 md:p-12 lg:max-w-2xl ${mobileStep === "preview" ? "hidden lg:block" : "block"}`}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-8"
        >
          <ArrowLeft size={18} /> <span className="font-medium">Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-8">Enter your details</h1>

        <div className="space-y-5">
          <InputField
            label="Full Name"
            registration={register("fullName")}
            error={errors.fullName?.message}
            placeholder="Enter full name"
          />
          <InputField
            label="Role"
            registration={register("role")}
            error={errors.role?.message}
            placeholder="Enter role"
          />
          <InputField
            label="Email Address"
            registration={register("email")}
            error={errors.email?.message}
            placeholder="Enter email address"
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
        </div>

        <button
          type="submit"
          className="w-full mt-10 py-4 bg-[#6366F1] text-white rounded-2xl font-bold lg:hidden"
        >
          Proceed
        </button>
      </form>

      {/* PREVIEW SECTION (Logic same as previous, but uses storedData for labels) */}
      <div
        className={`flex-1 bg-[#F9FAFB] p-6 md:p-12 flex flex-col items-center ${mobileStep === "form" ? "hidden lg:flex" : "flex"}`}
      >
        {/* ... (Preview Toggle and Card Code from previous step) ... */}
        <div className="w-full max-w-md aspect-[1.6/1] bg-[#1e1e1e] rounded-2xl shadow-2xl p-6 font-mono text-sm text-white">
          <div className="text-gray-400 mb-2">// Developer Business Card</div>
          {`{`} <br />
          <span className="pl-4">"name": "{storedData.fullName || "..."}"</span>
          , <br />
          <span className="pl-4">
            "role": "{storedData.role || "..."}"
          </span>{" "}
          <br />
          {`}`}
        </div>

        <button className="w-full max-w-md mt-auto py-4 bg-[#6366F1] text-white rounded-2xl font-bold">
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
