/* eslint-disable @typescript-eslint/no-explicit-any */
import { PATTERNS } from "@/app/utils/general";
import { LogoUpload } from "./LogoUpload";

export default function PlainCardForm({ methods, onProceed }: any) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const hasLogo = watch("hasLogo");
  const logoFile = watch("logoFile");

  return (
    <div className="px-6 lg:px-10">
      <h1 className="text-2xl font-bold mb-8">Enter your details</h1>
      <form onSubmit={methods.handleSubmit(onProceed)} className="space-y-6">
        {/* Patterns Grid */}
        <div>
          <label className="block text-sm font-bold mb-3">Patterns</label>
          <div className="grid grid-cols-3 gap-3">
            {PATTERNS.map((pat) => (
              <div
                key={pat.id}
                onClick={() => setValue("pattern", pat.id)}
                className={`h-16 rounded-lg cursor-pointer border-2 transition-all overflow-hidden relative ${
                  watch("pattern") === pat.id
                    ? "border-[#6366F1]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ background: "#f3f4f6" }}
              >
                {/* Visual representation of pattern */}
                <div
                  className="absolute inset-0  bg-black"
                  style={{ background: pat.css, backgroundSize: "20px 20px" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Opacity Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-700">
              Patterns Opacity
            </label>
            <span className="text-sm font-medium">
              {watch("patternOpacity")}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            {...register("patternOpacity", { valueAsNumber: true })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6366F1]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">
            Background Colour
          </label>
          <div className="flex gap-3">
            {/* Native Color Picker Trigger */}
            <div className="relative w-12 h-10 shrink-0">
              <input
                type="color"
                value={watch("bgColor")}
                onChange={(e) => setValue("bgColor", e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="w-full h-full rounded-md border border-gray-200 shadow-sm"
                style={{ backgroundColor: watch("bgColor") }}
              />
            </div>

            {/* Hex Code Input */}
            <div className="relative flex-1">
              <input
                {...register("bgColor")}
                placeholder="#000000"
                className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-indigo-100 outline-none uppercase"
              />
            </div>
          </div>
        </div>

        {/* Logo Toggle & Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-bold">Do you want a Logo?</label>
          <div className="flex flex-col gap-2">
            {["yes", "no"].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" value={opt} {...register("hasLogo")} />
                <span className="capitalize">
                  {opt === "yes"
                    ? "Yes, I want a logo"
                    : "No, I don't want a logo"}
                </span>
              </label>
            ))}
          </div>

          {hasLogo === "yes" && (
            <LogoUpload
              value={logoFile}
              onChange={(file) => setValue("logoFile", file)}
            />
          )}

          {hasLogo === "yes" && (
            <>
              <InputField
                label="Image Size (px)"
                placeholder="e.g., 40"
                type="number"
                registration={register("imageSize", { valueAsNumber: true })}
                error={errors.imageSize?.message}
              />
              <SelectField
                label="Logo Position"
                registration={register("logoPosition")}
                options={["center", "top", "bottom", "left", "right"]}
              />
              <InputField
                label="Spacing Between Logo & Text (px)"
                placeholder="e.g., 16"
                type="number"
                registration={register("logoSpacing", { valueAsNumber: true })}
                error={errors.logoSpacing?.message}
              />
            </>
          )}
        </div>

        <InputField
          label="Add Text"
          placeholder="Enter your text here"
          type="text"
          registration={register("text")}
          error={errors.text?.message}
        />

        {/* Font Settings */}
        <div className="space-y-4">
          <SelectField
            label="Font Size"
            registration={register("fontSize")}
            options={[
              "14 px",
              "16 px",
              "18 px",
              "24 px",
              "32 px",
              "48 px",
              "64 px",
              "96 px",
              "128 px",
            ]}
          />
          <SelectField
            label="Font Width"
            registration={register("fontWidth")}
            options={[
              "300 (Light)",
              "400 (Normal)",
              "600 (Semi-Bold)",
              "700 (Bold)",
            ]}
          />
          <SelectField
            label="Font"
            registration={register("fontFamily")}
            options={["Arial", "Inter", "Roboto Mono", "Times New Roman"]}
          />
        </div>

        <InputField
          label="Link"
          placeholder="https://example.com"
          type="url"
          registration={register("link")}
          error={errors.link?.message}
        />

        <button
          type="submit"
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl lg:hidden"
        >
          Proceed
        </button>
      </form>
    </div>
  );
}

export const InputField = ({
  label,
  registration,
  error,
  placeholder,
  type,
}: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold">{label}</label>
    <input
      {...registration}
      type={type || "text"}
      placeholder={placeholder}
      className="p-3 border rounded-xl border-[#DDDDDD] background-none outline-none focus:ring-2 text-sm  focus:ring-indigo-100"
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

export const SelectField = ({ label, registration, options }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold">{label}</label>
    <select
      {...registration}
      className="p-3 border rounded-xl bg-white border-[#DDDDDD] outline-none focus:ring-1 text-sm  focus:ring-indigo-100 background-none"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
