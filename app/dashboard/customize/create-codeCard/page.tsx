"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CodeCardSchema, CodeCardValues } from "@/app/types/customize/codeCard";
import { useBuilderStore } from "@/app/store/useBuilderStore";
import { CODE_THEMES } from "@/app/utils/general";
import CodeCardForm from "./components/CodeCardForm";
import CodeCardPreview from "./components/CodeCardPreview";

const DetailsPage = () => {
  const router = useRouter();
  const { setDetails, ...storedData } = useBuilderStore();

  const [mobileStep, setMobileStep] = useState<"form" | "preview">("form");
  const [cardView, setCardView] = useState<"front" | "back">("front");

  // Initialize Form
  const {
    register,
    handleSubmit,
    watch,
    setValue, // Needed to manually set the theme
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CodeCardValues>({
    resolver: zodResolver(CodeCardSchema),
    defaultValues: {
      fullName: "",
      role: "",
      email: "",
      link: "",
      availableForJob: "",
      theme: "vscode",
    },
  });

  // Watch for changes to update Zustand
  useEffect(() => {
    const subscription = watch((values) => {
      // @ts-ignore - partial update is fine
      setDetails(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, setDetails]);

  // Get current theme data for rendering
  const currentThemeKey = watch("theme") ?? "vscode";
  const activeTheme = CODE_THEMES[currentThemeKey];

  const onProceed = (data: CodeCardValues) => {
    setDetails(data);
    setMobileStep("preview");
  };

  const handleCheckout = async () => {
    const valid = await trigger();
    if (valid) {
      setDetails(getValues());
      router.push("/dashboard/customize/capture");
    }
  };

  const handleMobileBack = () => {
    setMobileStep("form");
  };

  return (
    <div className="flex flex-col pt-8 lg:flex-row min-h-screen text-[#1B231F]">
      {/* --- LEFT COLUMN: FORM --- */}
      <CodeCardForm
        onProceed={onProceed}
        currentThemeKey={currentThemeKey}
        mobileStep={mobileStep}
        methods={{
          trigger,
          getValues,
          register,
          handleSubmit,
          setValue,
          formState: { errors },
        }}
      />

      {/* --- RIGHT COLUMN: PREVIEW --- */}
      <CodeCardPreview
        handleMobileBack={handleMobileBack}
        handleCheckout={handleCheckout}
        mobileStep={mobileStep}
        cardView={cardView}
        setCardView={setCardView}
        activeTheme={activeTheme}
        storedData={storedData}
      />
    </div>
  );
};

export default DetailsPage;
