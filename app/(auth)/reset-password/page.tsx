"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Logo from "../../../public/assets/Logo.svg";
import { useResetPassword } from "@/app/services/auth";
import { getApiErrorMessage } from "@/app/utils/apiError";
import OtpInput from "@/app/components/ui/OtpInput";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPassword(
      {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successful");
          router.push("/login");
        },
        onError: (err: unknown) => {
          const message = getApiErrorMessage(
            err,
            "Failed to reset password. Please try again.",
          );
          toast.error(message);
        },
      },
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (otp: string) => {
    setFormData((prev) => ({
      ...prev,
      otp,
    }));
  };

  return (
    <main className="flex items-start justify-start lg:items-center lg:justify-center p-5 bg-white min-h-screen">
      <div className="w-full max-w-full lg:max-w-md p-4 lg:p-8">
        {/* Logo */}
        <div className="flex items-center justify-start lg:justify-center mb-8">
          <Link href="/">
            <Image
              src={Logo}
              alt="CardConnect Logo"
              width={150}
              height={150}
              priority
            />
          </Link>
        </div>

        {/* Header */}
        <div className="text-left lg:text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1D1F2C] mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-[#1B231F]">
            Choose a new and secure password to protect your account.
          </p>
        </div>

        {/* Form Fields */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* OTP Field */}
          <div>
            <label
              htmlFor="reset-otp-0"
              className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
            >
              OTP Code
            </label>
            <OtpInput
              value={formData.otp}
              onChange={handleOtpChange}
              idPrefix="reset-otp"
              name="otp"
              length={6}
              disabled={isPending}
            />
          </div>

          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                {showNewPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                {showConfirmPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#7269E3] hover:bg-[#7269D1] text-white font-medium py-3 rounded-full transition duration-200 cursor-pointer shadow-sm"
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
