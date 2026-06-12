import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import React from "react";
import { InputField } from "./inputField";
import { useRouter } from "next/navigation";
import { CODE_THEMES } from "@/app/utils/general";

const CodeCardForm = ({
  methods,
  onProceed,
  mobileStep,
  currentThemeKey,
}: any) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;
  const router = useRouter();

  return (
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
  );
};

export default CodeCardForm;
