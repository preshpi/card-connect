import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.svg";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
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

        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
