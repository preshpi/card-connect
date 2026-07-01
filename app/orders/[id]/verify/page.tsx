import { Suspense } from "react";
import PublicVerifyPaymentContent from "./verify-content";

export default function PublicVerifyPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-12">
          <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
            <div className="animate-spin inline-block mb-4">🔄</div>
            <h2 className="text-lg font-semibold">Loading…</h2>
          </div>
        </div>
      }
    >
      <PublicVerifyPaymentContent />
    </Suspense>
  );
}
