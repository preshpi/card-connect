import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import ConditionalLayout from "./components/ConditionalLayout";
import { QueryProvider } from "./providers/QueryProvider";
import { Toaster } from "sonner";
import AuthInitializer from "./components/AuthInitializer";

const sora = localFont({
  src: [
    { path: "../public/fonts/Sora-ExtraBold.ttf", weight: "800" },
    { path: "../public/fonts/Sora-Bold.ttf", weight: "700" },
    { path: "../public/fonts/Sora-SemiBold.ttf", weight: "600" },
    { path: "../public/fonts/Sora-Medium.ttf", weight: "500" },
    { path: "../public/fonts/Sora-Regular.ttf", weight: "400" },
    { path: "../public/fonts/Sora-Light.ttf", weight: "300" },
    { path: "../public/fonts/Sora-Thin.ttf", weight: "200" },
  ],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Card connect",
  description: "Smart card for networking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} antialiased scroll-smooth`}>
        <QueryProvider>
          <AuthInitializer />
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster position="top-right" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
