import Image from "next/image";
import React from "react";
import { Toaster } from "sonner";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="w-full h-screen bg-background background bg-cover">
      <header className="p-5">
        <Image src="/Logo.svg" alt="logo" width={200} height={200} />
      </header>
      <div className="px-5 pt-5 lg:pt-0">{children}</div>
      <Toaster richColors position="top-right" />
    </main>
  );
};

export default AuthLayout;
