"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PlainCardForm from "./components/PlainCardForm";
import PlainCardPreview from "./components/PlainCardPreview";
import {
  PlainCardSchema,
  PlainCardValues,
} from "@/app/types/customize/plainCard";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/app/store/useBuilderStore";

const PlainCard = () => {
  const [mobileStep, setMobileStep] = useState<"form" | "preview">("form");
  const { setPlainDetails } = useBuilderStore();

  const router = useRouter();
  const {
    trigger,
    getValues,
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PlainCardValues>({
    resolver: zodResolver(PlainCardSchema as any), // Type assertion to bypass zod type issues
    defaultValues: {
      pattern: "waves",
      patternOpacity: 32,
      hasLogo: "no",
      logoPosition: "center",
      logoSpacing: 0,
      bgColor: "#1d2f25",
      fontSize: "16 px",
      fontWidth: "400 (Normal)",
      fontFamily: "Arial",
      link: "",
      text: "",
      imageSize: 100,
      logoFile: null,
    },
  });

  const handleCheckout = async () => {
    const valid = await trigger();
    if (valid) {
      setPlainDetails(getValues());
      router.push("/dashboard/customize/capture");
    }
  };
  const onProceed = () => setMobileStep("preview");

  // Use useWatch to get the current form values
  const watchedValues = useWatch({ control });

  return (
    <div className="flex flex-col pt-8 lg:flex-row min-h-screen text-[#1B231F]">
      <div
        className={`flex-1 ${mobileStep === "preview" ? "hidden lg:block" : "block"} overflow-y-auto max-h-screen`}
      >
        <PlainCardForm
          methods={{
            trigger,
            getValues,
            control,
            register,
            watch,
            handleSubmit,
            setValue,
            formState: { errors },
          }}
          onProceed={onProceed}
        />
      </div>

      <div
        className={`flex-1 bg-[#F9FAFB] lg:p-12 min-h-screen ${mobileStep === "form" ? "hidden lg:flex" : "flex"}`}
      >
        <div className="w-full sticky top-0 self-start h-full">
          <PlainCardPreview
            values={watchedValues}
            onBack={() => setMobileStep("form")}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default PlainCard;
