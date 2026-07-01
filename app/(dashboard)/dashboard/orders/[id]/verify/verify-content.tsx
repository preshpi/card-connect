"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useVerifyPayment } from "@/app/services/orders";

export default function VerifyPaymentContent() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const orderId = params?.id as string | undefined;
  const trxref = search?.get("trxref") || search?.get("reference");

  const { mutateAsync: verifyPayment } = useVerifyPayment();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const verify = async () => {
      setStatus("loading");
      try {
        await verifyPayment(orderId);
        setStatus("success");
        setMessage("Payment verified successfully.");
        setTimeout(() => router.push("/dashboard/orders"), 1500);
      } catch (err: unknown) {
        setStatus("error");
        const msg = err instanceof Error ? err.message : "Verification failed";
        setMessage(msg);
        toast.error(msg);
      }
    };

    verify();
  }, [orderId, verifyPayment, router, trxref]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
        {status === "loading" && (
          <div>
            <div className="animate-spin inline-block mb-4">🔄</div>
            <h2 className="text-lg font-semibold">Verifying payment…</h2>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we confirm your payment.
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
            <h2 className="text-lg font-semibold">Payment Successful</h2>
            <p className="text-sm text-gray-500 mt-2">{message}</p>
            <p className="text-sm text-gray-400 mt-4">
              Redirecting to your orders…
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <XCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
            <h2 className="text-lg font-semibold">Verification Failed</h2>
            <p className="text-sm text-gray-500 mt-2">{message}</p>
            <div className="mt-6 flex gap-2 justify-center">
              <button
                onClick={() => router.push("/dashboard/orders")}
                className="px-4 py-2 rounded-lg bg-[#7269E3] text-white"
              >
                Back to orders
              </button>
              <button
                onClick={() => {
                  setStatus("loading");
                  verifyPayment(orderId as string)
                    .then(() => {
                      setStatus("success");
                      setMessage("Payment verified successfully.");
                      setTimeout(() => router.push("/dashboard/orders"), 1200);
                    })
                    .catch((err: unknown) => {
                      setStatus("error");
                      setMessage(
                        err instanceof Error ? err.message : String(err),
                      );
                    });
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
