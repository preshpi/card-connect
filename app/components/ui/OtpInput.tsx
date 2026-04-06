"use client";

import { useMemo, useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  name?: string;
  idPrefix?: string;
  disabled?: boolean;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  name = "otp",
  idPrefix = "otp",
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(() => {
    const sanitized = value.replace(/\D/g, "").slice(0, length);
    return Array.from({ length }, (_, index) => sanitized[index] || "");
  }, [value, length]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const updateDigit = (index: number, nextDigit: string) => {
    const next = [...digits];
    next[index] = nextDigit;
    onChange(next.join(""));
  };

  const handleInputChange = (index: number, rawValue: string) => {
    const cleaned = rawValue.replace(/\D/g, "");

    if (cleaned.length === 0) {
      updateDigit(index, "");
      return;
    }

    if (cleaned.length > 1) {
      const next = [...digits];
      const chars = cleaned.slice(0, length);

      chars.split("").forEach((char, offset) => {
        const targetIndex = index + offset;
        if (targetIndex < length) {
          next[targetIndex] = char;
        }
      });

      onChange(next.join(""));
      const nextFocusIndex = Math.min(index + chars.length, length - 1);
      focusInput(nextFocusIndex);
      return;
    }

    updateDigit(index, cleaned);
    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        updateDigit(index, "");
      } else if (index > 0) {
        updateDigit(index - 1, "");
        focusInput(index - 1);
      }
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
      event.preventDefault();
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) {
      return;
    }

    const next = [...digits];
    const chars = pasted.slice(0, length);

    chars.split("").forEach((char, offset) => {
      const targetIndex = index + offset;
      if (targetIndex < length) {
        next[targetIndex] = char;
      }
    });

    onChange(next.join(""));
    const nextFocusIndex = Math.min(index + chars.length, length - 1);
    focusInput(nextFocusIndex);
  };

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="OTP input"
    >
      {digits.map((digit, index) => (
        <input
          key={`${idPrefix}-${index}`}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          id={`${idPrefix}-${index}`}
          name={index === 0 ? name : undefined}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          onChange={(event) => handleInputChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          className="h-12 w-10 rounded-lg border border-gray-300 text-center text-lg font-medium text-gray-900 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
