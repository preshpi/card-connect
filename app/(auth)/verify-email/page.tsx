"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useResendVerifyEmail, useVerifyEmail } from "@/app/services/auth";
import { getApiErrorMessage } from "@/app/utils/apiError";
import OtpInput from "@/app/components/ui/OtpInput";

export default function VerifyEmailPage() {
  const RESEND_COOLDOWN_SECONDS = 30;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    otp: "",
  });
  const [resendCooldown, setResendCooldown] = useState(0);
  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResending } = useResendVerifyEmail();

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    verifyEmail(formData, {
      onSuccess: () => {
        toast.success("Email verified successfully");
        router.push("/login");
      },
      onError: (error: unknown) => {
        toast.error(
          getApiErrorMessage(error, "Email verification failed. Try again."),
        );
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOtpChange = (otp: string) => {
    setFormData((prev) => ({
      ...prev,
      otp,
    }));
  };

  const handleResendOtp = () => {
    if (!formData.email) {
      toast.error("Enter your email to resend OTP");
      return;
    }

    resendOtp(
      { email: formData.email },
      {
        onSuccess: () => {
          toast.success("A new OTP has been sent to your email");
          setResendCooldown(RESEND_COOLDOWN_SECONDS);
        },
        onError: (error: unknown) => {
          toast.error(getApiErrorMessage(error, "Failed to resend OTP."));
        },
      },
    );
  };

  return (
    <main className="flex items-start justify-start lg:items-center lg:justify-center p-5 bg-white min-h-screen">
      <div className="w-full max-w-full lg:max-w-md p-4 lg:p-8">
        <div className="text-left lg:text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1D1F2C] mb-2">
            Verify your email
          </h1>
          <p className="text-sm text-[#1B231F]">
            Enter the OTP sent to your email address to activate your account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
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

          <div>
            <label
              htmlFor="otp-0"
              className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
            >
              OTP Code
            </label>
            <OtpInput
              value={formData.otp}
              onChange={handleOtpChange}
              idPrefix="otp"
              name="otp"
              length={6}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[#1B231F]">Didn&apos;t get the code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isPending || isResending || resendCooldown > 0}
              className="text-[#7269E3] hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {isResending
                ? "Resending..."
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#7269E3] hover:bg-[#7269D1] text-white font-medium py-3 rounded-full transition duration-200 cursor-pointer shadow-sm"
          >
            {isPending ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </main>
  );
}
