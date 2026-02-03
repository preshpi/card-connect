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

const PlainCard = () => {
  const [mobileStep, setMobileStep] = useState<"form" | "preview">("form");

  const formMethods = useForm<PlainCardValues>({
    resolver: zodResolver(PlainCardSchema),
    defaultValues: {
      pattern: "waves",
      patternOpacity: 32,
      hasLogo: "no",
      bgColor: "#1d2f25",
      fontSize: "16 px",
      fontWidth: "400 (Normal)",
      fontFamily: "Arial",
      link: "",
      logoFile: null,
    },
  });

  const onProceed = () => setMobileStep("preview");

  // Use useWatch to get the current form values
  const watchedValues = useWatch({ control: formMethods.control });

  return (
    <div className="flex flex-col pt-8 lg:flex-row min-h-screen text-[#1B231F]">
      <div
        className={`flex-1 ${mobileStep === "preview" ? "hidden lg:block" : "block"}`}
      >
        <PlainCardForm methods={formMethods} onProceed={onProceed} />
      </div>

      <div
        className={`flex-1 bg-[#F9FAFB] lg:p-12 ${mobileStep === "form" ? "hidden lg:flex" : "flex"}`}
      >
        <PlainCardPreview
          values={watchedValues}
          onBack={() => setMobileStep("form")}
        />
      </div>
    </div>
  );
};

export default PlainCard;
