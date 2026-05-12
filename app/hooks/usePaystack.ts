"use client";

import { useCallback, useRef } from "react";

declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number;
  ref: string;
  currency: string;
  onClose: () => void;
  callback: (response: PaystackCallbackResponse) => void;
}

export interface PaystackCallbackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
}

export interface InitPaymentOptions {
  email: string;
  /** Amount in Naira — converted to kobo internally */
  amountNaira: number;
  reference: string;
  onSuccess: (response: PaystackCallbackResponse) => Promise<void> | void;
  onDismiss: () => void;
}

function ensurePaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));
    if (window.PaystackPop) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="paystack"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Paystack script failed to load")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Paystack script failed to load"));
    document.head.appendChild(script);
  });
}

export function usePaystack() {
  const paymentCompletedRef = useRef(false);

  const initializePayment = useCallback(async (options: InitPaymentOptions) => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey)
      throw new Error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set");

    await ensurePaystackScript();

    // Reset for this payment attempt
    paymentCompletedRef.current = false;

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: options.email,
      amount: options.amountNaira * 100, // kobo
      ref: options.reference,
      currency: "NGN",
      callback: async (response) => {
        paymentCompletedRef.current = true;
        await options.onSuccess(response);
      },
      onClose: () => {
        // Only fire dismiss if user actually closed without paying
        if (!paymentCompletedRef.current) {
          options.onDismiss();
        }
      },
    });

    handler.openIframe();
  }, []);

  return { initializePayment };
}
