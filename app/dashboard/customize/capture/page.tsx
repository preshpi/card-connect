/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import domtoimage from "dom-to-image";
import { toast } from "sonner";
import { useBuilderStore } from "@/app/store/useBuilderStore";
import { CODE_THEMES, PATTERNS, isColorLight } from "@/app/utils/general";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import Logo from "@/public/assets/LogoWhite.svg";
import BlackLogo from "@/public/assets/Logo.svg";
import { ChevronLeft, ShieldCheck } from "lucide-react";

const loadingTexts = [
  "Chakam... 📸",
  "Clocking it... ⏰",
  "Cooking... 🍳",
  "Just a moment... ⏳",
  "Hang tight... 🔄",
  "Finishing up... 🎉",
];

const Capture = () => {
  const router = useRouter();
  const builderStore = useBuilderStore();
  const [switchCard, setSwitchCard] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  const cardType = builderStore.selectedTemplate;
  const codeCardData = {
    fullName: builderStore.fullName,
    role: builderStore.role,
    email: builderStore.email,
    link: builderStore.link,
    availableForJob: builderStore.availableForJob,
    theme: builderStore.theme,
  };
  const plainCardData = builderStore.plainCardValues;

  const handleGoBack = () => {
    router.back();
  };

  // Convert logo File to data URL for dom-to-image compatibility
  useEffect(() => {
    if (plainCardData.logoFile && plainCardData.logoFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(plainCardData.logoFile);
    } else if (typeof plainCardData.logoFile === "string") {
      setLogoDataUrl(plainCardData.logoFile);
    }
  }, [plainCardData.logoFile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % loadingTexts.length);
        setFade(true);
      }, 500);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const uploadImageToCloudinary = async (imageData: string) => {
    try {
      if (!imageData || !imageData.startsWith("data:image/")) {
        throw new Error("Invalid image data format");
      }

      const fetchResponse = await fetch(imageData);
      const blob = await fetchResponse.blob();

      const timestamp = new Date().getTime();
      const file = new File([blob], `card-image-${timestamp}.png`, {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "card_connect");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dpokiomqq/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Upload failed with status: ${response.status}, message: ${errorData}`,
        );
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error: any) {
      toast.error(`Error uploading to Cloudinary: ${error.message}`);
      throw error;
    }
  };

  const captureCardAsImage = async (cardId: string) => {
    const cardElement = document.getElementById(cardId);
    if (!cardElement) {
      toast.error(`Card element with ID "${cardId}" not found`);
      return null;
    }

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const style = {
      transform: "scale(2)",
      transformOrigin: "top left",
      width: cardElement?.offsetWidth + "px",
      height: cardElement?.offsetHeight + "px",
    };

    try {
      const dataUrl = await domtoimage.toSvg(cardElement, {
        width: cardElement.offsetWidth * 2,
        height: cardElement.offsetHeight * 2,
        style,
        quality: 1,
        cacheBust: true,
      });
      const imageUrl = await uploadImageToCloudinary(dataUrl);
      return imageUrl;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Unknown error";
      toast.error(`Failed to capture card image: ${errorMessage}`);
      return null;
    }
  };

  const captureAndNavigateToCheckout = async () => {
    setIsLoading(true);
    try {
      setSwitchCard(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const frontUrl = await captureCardAsImage("frontCard");

      if (!frontUrl) {
        throw new Error("Failed to capture front card image");
      }

      setSwitchCard(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const backUrl = await captureCardAsImage("backCard");
      if (!backUrl) {
        throw new Error("Failed to capture back card image");
      }

      localStorage.setItem(
        "cardImages",
        JSON.stringify({
          frontCardUrl: frontUrl,
          backCardUrl: backUrl,
        }),
      );

      router.push("/dashboard/checkout");
    } catch (error: any) {
      toast.error(error.message || "An unknown error occurred");
      toast.error(
        "There was a problem processing your cards. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setSwitchCard(true);
    }
  };

  // Get active theme for code card
  const activeTheme = CODE_THEMES[codeCardData.theme || "vscode"];

  // Plain Card Components
  const PlainCardFront = () => {
    const fontWeight = plainCardData.fontWidth.split(" ")[0];
    const activePattern = PATTERNS.find((p) => p.id === plainCardData.pattern);

    const getLayoutClasses = () => {
      const position = plainCardData.logoPosition || "center";
      switch (position) {
        case "top":
          return "flex-col items-center";
        case "bottom":
          return "flex-col-reverse items-center";
        case "left":
          return "flex-row items-center";
        case "right":
          return "flex-row-reverse items-center";
        case "center":
        default:
          return "flex-col items-center";
      }
    };

    return (
      <div
        className="w-full h-full rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center border border-black/5"
        style={{
          backgroundColor: plainCardData.bgColor,
          fontFamily: plainCardData.fontFamily,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: activePattern?.css,
            backgroundSize: activePattern?.size || "cover",
            opacity: plainCardData.patternOpacity / 100,
            backgroundRepeat: "repeat",
          }}
        />

        <div
          className={`z-10 flex ${getLayoutClasses()} px-8`}
          style={{ gap: `${plainCardData.logoSpacing || 16}px` }}
        >
          {plainCardData.hasLogo === "yes" && logoDataUrl && (
            <div className="flex justify-center shrink-0">
              <Image
                src={logoDataUrl}
                alt="User Logo"
                width={plainCardData.imageSize || 100}
                height={plainCardData.imageSize || 100}
                style={{
                  width: `${plainCardData.imageSize || 100}px`,
                  height: `${plainCardData.imageSize || 100}px`,
                }}
                className="object-contain"
              />
            </div>
          )}
          {plainCardData.text && (
            <p
              className="text-white uppercase tracking-[0.2em] leading-tight"
              style={{
                fontSize: plainCardData.fontSize,
                fontWeight: fontWeight,
                textAlign:
                  plainCardData.logoPosition === "left" ||
                  plainCardData.logoPosition === "right"
                    ? "left"
                    : "center",
              }}
            >
              {plainCardData.text || "Your Text Here"}
            </p>
          )}
        </div>

        <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none" />
      </div>
    );
  };

  const PlainCardBack = () => {
    return (
      <div
        className="w-full h-full rounded-2xl flex flex-col items-center justify-center shadow-xl transition-colors duration-300 relative overflow-hidden"
        style={{ backgroundColor: plainCardData.bgColor }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url('/assets/patterns/${plainCardData.pattern}.svg')`,
            backgroundSize: "cover",
          }}
        />

        <div className="z-10 bg-white p-4 rounded-xl shadow-lg">
          <QRCodeSVG
            value={plainCardData.link || "https://example.com"}
            size={110}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>

        <p
          className="mt-4 text-xs font-medium uppercase tracking-widest z-10"
          style={{
            color: isColorLight(plainCardData.bgColor) ? "#000" : "#fff",
          }}
        >
          Scan to connect
        </p>
      </div>
    );
  };

  // Code Card Components
  const CodeCardFront = () => {
    return (
      <div
        className="w-full h-full rounded-2xl shadow-2xl p-6 font-mono text-sm border border-black/5"
        style={{
          backgroundColor: activeTheme.bg,
          color: activeTheme.text,
        }}
      >
        <div className="flex gap-1.5 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>

        <div
          className="mb-3 text-xs opacity-50"
          style={{ color: activeTheme.tokens.comment }}
        >
          // Developer Business Card
        </div>

        <div className="leading-relaxed text-xs sm:text-sm">
          <span className="select-none mr-4 opacity-30">1</span> {`{`} <br />
          <span className="select-none mr-4 opacity-30">2</span>
          <span className="pl-2" style={{ color: activeTheme.tokens.key }}>
            "name"
          </span>
          :
          <span style={{ color: activeTheme.tokens.string }}>
            {" "}
            "{codeCardData.fullName || "@username"}"
          </span>
          ,<br />
          <span className="select-none mr-4 opacity-30">3</span>
          <span className="pl-2" style={{ color: activeTheme.tokens.key }}>
            "email"
          </span>
          :
          <span style={{ color: activeTheme.tokens.string }}>
            {" "}
            "{codeCardData.email || "mail@example.com"}"
          </span>
          ,<br />
          <span className="select-none mr-4 opacity-30">4</span>
          <span className="pl-2" style={{ color: activeTheme.tokens.key }}>
            "role"
          </span>
          :
          <span style={{ color: activeTheme.tokens.string }}>
            {" "}
            "{codeCardData.role || "developer"}"
          </span>
          ,<br />
          <span className="select-none mr-4 opacity-30">5</span>
          <span className="pl-2" style={{ color: activeTheme.tokens.key }}>
            "available"
          </span>
          :
          <span style={{ color: activeTheme.tokens.boolean }}>
            {" "}
            {codeCardData.availableForJob || "true"}
          </span>
          <br />
          <span className="select-none mr-4 opacity-30">6</span> {`}`}
        </div>
      </div>
    );
  };

  const CodeCardBack = () => {
    return (
      <div
        className="w-full h-full rounded-2xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden border border-black/5"
        style={{ backgroundColor: activeTheme.bg }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, ${activeTheme.tokens.key} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>

        <div className="z-10 bg-white p-4 rounded-xl shadow-lg">
          <QRCodeSVG
            value={codeCardData.link || "https://example.com"}
            size={100}
            bgColor="#ffffff"
            fgColor="#000000"
            level="L"
          />
        </div>
        <p
          className="z-10 text-xs mt-4 font-mono opacity-70"
          style={{ color: activeTheme.text }}
        >
          Scan to connect
        </p>

        <div className="absolute bottom-0 left-0 px-5 py-3">
          <Image
            src={
              CODE_THEMES.github_light.bg === activeTheme?.bg ? BlackLogo : Logo
            }
            alt="logo"
            width={100}
            height={100}
            priority
          />
        </div>
      </div>
    );
  };

  const animationStyles = `
  @keyframes scan {
    from { transform: translateX(-100%) skewX(-12deg); }
    to { transform: translateX(400%) skewX(-12deg); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-scan {
    animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
  .group-hover\\:animate-shimmer:hover {
    animation: shimmer 1.5s infinite;
  }
`;

  return (
    // <div className="min-h-screen py-10 w-[90%] mx-auto text-[#1B231F]">
    //   <div className="flex items-center gap-x-5">
    //     <div className="group max-w-fit">
    //       <button
    //         onClick={handleGoBack}
    //         className="border w-10 h-10 rounded-full flex items-center justify-center text-center group-hover:bg-white duration-300 transition-all"
    //       >
    //         <ChevronLeft className="text-xl text-[#1B231F] group-hover:text-black" />
    //       </button>
    //     </div>
    //   </div>

    //   <h1 className="text-center text-3xl mt-5 text-[#1B231F]">Card Preview</h1>

    //   {/* Card Display */}
    //   <div
    //     className="max-w-[430px] h-full mx-auto mt-10 cursor-pointer"
    //     aria-label="card"
    //     onClick={() => setSwitchCard(!switchCard)}
    //   >
    //     {cardType === "plain" && (
    //       <>
    //         {switchCard ? (
    //           <div
    //             id="frontCard"
    //             className="w-full aspect-[1.6/1] max-w-md mx-auto"
    //           >
    //             <PlainCardFront />
    //           </div>
    //         ) : (
    //           <div
    //             id="backCard"
    //             className="w-full aspect-[1.6/1] max-w-md mx-auto"
    //           >
    //             <PlainCardBack />
    //           </div>
    //         )}
    //       </>
    //     )}

    //     {cardType === "code" && (
    //       <>
    //         {switchCard ? (
    //           <div
    //             id="frontCard"
    //             className="w-full aspect-[1.6/1] max-w-md mx-auto rounded-xl"
    //           >
    //             <CodeCardFront />
    //           </div>
    //         ) : (
    //           <div
    //             id="backCard"
    //             className="w-full aspect-[1.6/1] max-w-md mx-auto rounded-xl"
    //           >
    //             <CodeCardBack />
    //           </div>
    //         )}
    //       </>
    //     )}
    //   </div>

    //   <div className="min-h-screen py-10 w-[90%] mx-auto text-[#1B231F]">
    //     {/* ... header and card preview code remains the same ... */}

    //     <div className="flex justify-center mt-20 items-center w-full mx-auto max-w-[500px]">
    //       <button
    //         className={`relative flex items-center justify-center transition-all duration-500 ease-in-out h-16 rounded-2xl overflow-hidden border-none cursor-pointer group
    //         ${isLoading ? "w-full bg-[#1B231F]" : "w-64 bg-[#7269E3] hover:shadow-xl hover:-translate-y-1"}
    //         disabled:cursor-not-allowed`}
    //         onClick={captureAndNavigateToCheckout}
    //         disabled={isLoading}
    //       >
    //         {isLoading ? (
    //           <div className="w-full h-full flex flex-col items-center justify-center px-6 relative">
    //             {/* Progress Bar Background */}
    //             <div className="absolute inset-0 bg-white/5" />

    //             {/* Animated Scanning Beam */}
    //             <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#7269E3]/40 to-transparent skew-x-12 animate-scan" />

    //             <div className="z-10 flex items-center gap-4">
    //               {/* Spinning Shutter Icon */}
    //               <div className="relative w-6 h-6 animate-spin-slow">
    //                 <div className="absolute inset-0 border-2 border-dashed border-[#7269E3] rounded-full" />
    //                 <div className="absolute inset-1 border-2 border-[#7269E3] rounded-full border-t-transparent" />
    //               </div>

    //               <span className="text-white font-medium tracking-wide">
    //                 {switchCard ? "DIGITIZING FRONT..." : "DIGITIZING BACK..."}
    //               </span>
    //             </div>

    //             {/* Progress Percentage Visual */}
    //             <div
    //               className="absolute bottom-0 left-0 h-1 bg-[#7269E3] transition-all duration-1000 ease-linear"
    //               style={{ width: switchCard ? "40%" : "85%" }}
    //             />
    //           </div>
    //         ) : (
    //           <div className="flex items-center justify-center gap-x-3 text-white">
    //             <span className="text-lg font-semibold tracking-tight">
    //               Capture
    //             </span>
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               width="20"
    //               height="20"
    //               viewBox="0 0 24 24"
    //               fill="none"
    //               stroke="currentColor"
    //               strokeWidth="2.5"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               className="group-hover:translate-x-1 transition-transform"
    //             >
    //               <path d="M5 12h14m-7-7 7 7-7 7" />
    //             </svg>
    //           </div>
    //         )}
    //       </button>
    //     </div>

    //     {/* Add this to your Global CSS or Tailwind config for the custom animations */}
    //     <style jsx global>{`
    //       @keyframes scan {
    //         from {
    //           transform: translateX(-150%) skewX(-12deg);
    //         }
    //         to {
    //           transform: translateX(350%) skewX(-12deg);
    //         }
    //       }
    //       .animate-scan {
    //         animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    //       }
    //       @keyframes spin-slow {
    //         from {
    //           transform: rotate(0deg);
    //         }
    //         to {
    //           transform: rotate(360deg);
    //         }
    //       }
    //       .animate-spin-slow {
    //         animation: spin-slow 3s linear infinite;
    //       }
    //     `}</style>
    //   </div>
    // </div>

    <div className="min-h-screen relative w-full flex flex-col">
      <style>{animationStyles}</style>

      {/* --- Navbar --- */}
      <nav className="relative z-10 pt-8 flex justify-between items-center  w-full">
        <button
          onClick={handleGoBack}
          className="group flex items-center gap-3 text-sm font-medium text-[#1B231F]/60 hover:text-[#1B231F] transition-colors duration-300"
        >
          <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition-all">
            <ChevronLeft size={18} />
          </div>
          <span className="hidden sm:inline">Back to Editor</span>
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pb-20 max-w-7xl mx-auto w-full">
        {/* --- Header Section --- */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1B231F] mb-3">
            Your Masterpiece.
          </h1>
          <p className="text-[#1B231F]/60 max-w-md mx-auto text-center text-xs md:text-base">
            Review your design one last time.
            <br /> Click the card to flip it.
          </p>
        </div>

        {/* --- Card Display Area --- */}
        <div className="relative group perspective-1000">
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-[#7269E3]/20 blur-[90px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Card Container */}
          <div
            className="relative w-[340px] md:w-[430px] aspect-[1.6/1] transition-transform duration-500 ease-out hover:scale-[1.02] cursor-pointer"
            onClick={() => setSwitchCard(!switchCard)}
          >
            {cardType === "plain" && (
              <div
                className={`w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl transition-all duration-500`}
                id={switchCard ? "frontCard" : "backCard"} // ID for dom-to-image
              >
                {switchCard ? <PlainCardFront /> : <PlainCardBack />}
              </div>
            )}

            {cardType === "code" && (
              <div
                className={`w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl transition-all duration-500`}
                id={switchCard ? "frontCard" : "backCard"} // ID for dom-to-image
              >
                {switchCard ? <CodeCardFront /> : <CodeCardBack />}
              </div>
            )}
          </div>
        </div>

        {/* --- Action Button Section --- */}
        <div className="mt-16 w-full flex flex-col items-center">
          <button
            className={`relative flex items-center justify-center transition-all duration-500 ease-in-out h-16 rounded-2xl overflow-hidden border-none cursor-pointer group
              ${isLoading ? "w-full max-w-[340px] bg-[#1B231F] shadow-inner" : "w-72 bg-[#7269E3] hover:shadow-[0_0_30px_rgba(114,105,227,0.4)] hover:-translate-y-1"}
              disabled:cursor-not-allowed`}
            onClick={captureAndNavigateToCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center px-6 relative">
                {/* Progress Background */}
                <div className="absolute inset-0 bg-white/5" />
                {/* Scanning Beam */}
                <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#7269E3]/40 to-transparent skew-x-12 animate-scan" />

                <div className="z-10 flex items-center gap-3">
                  {/* Spinner */}
                  <div className="relative w-5 h-5 animate-spin-slow">
                    <div className="absolute inset-0 border-2 border-dashed border-[#7269E3] rounded-full" />
                    <div className="absolute inset-1 border-2 border-[#7269E3] rounded-full border-t-transparent" />
                  </div>
                  <span className="text-white text-xs font-mono tracking-widest uppercase">
                    {switchCard ? "DIGITIZING FRONT..." : "DIGITIZING BACK..."}
                  </span>
                </div>

                {/* Progress Bar Line */}
                <div
                  className="absolute bottom-0 left-0 h-1 bg-[#7269E3] transition-all duration-1000 ease-linear"
                  style={{ width: switchCard ? "40%" : "85%" }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-x-4 text-white relative z-10">
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[9px] uppercase tracking-[0.2em] opacity-80 mb-1 font-bold">
                    Ready to print?
                  </span>
                  <span className="text-lg font-bold tracking-tight">
                    Secure Your Design
                  </span>
                </div>

                {/* Icon Box */}
                <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}

            {/* Hover Shimmer */}
            {!isLoading && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
            )}
          </button>

          {/* Trust Badge */}
          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#1B231F]/40">
            <ShieldCheck size={14} />
            <span>Encrypted & Secure Checkout</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Capture;
