"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "../../../public/assets/Logo.svg";
import { useSignUp } from "@/app/services/auth";
import { getApiErrorMessage } from "@/app/utils/apiError";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { mutate: signup, isPending } = useSignUp();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    signup(
      {
        fullName: `${formData.firstname} ${formData.lastname}`.trim(),
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
          router.push(
            `/verify-email?email=${encodeURIComponent(formData.email)}`,
          );
        },
        onError: (err: unknown) => {
          const message = getApiErrorMessage(
            err,
            "Signup failed. Please try again.",
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

  return (
    <main className="flex h-screen items-start justify-start lg:items-center lg:justify-center p-5 bg-white">
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
            Create an account
          </h1>
          <p className="text-sm text-[#1B231F]">
            Start exploring and utilizing all the resources that will help you
            elevate every design you make.
          </p>
        </div>

        {/* Form Fields */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* First Name Field */}
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter first name"
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter last name"
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

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
              autoComplete="off"
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                {showPassword ? (
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
                autoComplete="off"
                placeholder="Confirm password"
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
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-left lg:text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#7269E3] hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
