import { Suspense } from "react";
import VerifyEmailForm from "./verify-email-form";

export default function VerifyEmailPage() {
  return (
    <main className="flex items-start justify-start lg:items-center lg:justify-center p-5 bg-white min-h-screen">
      <div className="w-full max-w-full lg:max-w-md p-4 lg:p-8">
        <div className="text-left lg:text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1D1F2C] mb-2">
            Verify your email address
          </h1>
          <p className="text-sm text-[#1B231F]">
            Enter the OTP sent to your email address to activate your account.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </main>
  );
}
