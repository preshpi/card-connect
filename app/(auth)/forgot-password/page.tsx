"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "../../../public/assets/Logo.svg";
import { useForgotPassword } from "@/app/services/auth";
import { getApiErrorMessage } from "@/app/utils/apiError";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP sent to your email");
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        },
        onError: (err: unknown) => {
          const message = getApiErrorMessage(
            err,
            "Failed to send reset code. Please try again.",
          );
          toast.error(message);
        },
      },
    );
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
            Forgot Password
          </h1>
          <p className="text-sm text-[#1B231F]">
            A link will be sent to your registered email address to reset your
            password.
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#7269E3] hover:bg-[#7269D1] text-white font-medium py-3 rounded-full transition duration-200 cursor-pointer shadow-sm"
          >
            {isPending ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </main>
  );
}
