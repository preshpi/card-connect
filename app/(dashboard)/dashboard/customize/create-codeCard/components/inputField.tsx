import { AlertCircle } from "lucide-react";

export const InputField = ({
  label,
  registration,
  error,
  placeholder,
}: any) => (
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
