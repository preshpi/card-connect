"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ChevronDown,
  Package,
  ShoppingBag,
  RotateCcw,
  XCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import {
  useGetOrders,
  useCancelOrder,
  useVerifyPayment,
  useRegeneratePaymentLink,
} from "@/app/services/orders";
import { usePaystack } from "@/app/hooks/usePaystack";
import { OrderData, OrderStatus } from "@/app/types/orders";
import { useRouter } from "next/navigation";

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; Icon: React.ElementType }
> = {
  initiated: {
    label: "Awaiting Payment",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    Icon: Clock,
  },
  paid: {
    label: "Payment Confirmed",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    Icon: CheckCircle,
  },
  processing: {
    label: "Processing",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    Icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    Icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    Icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    Icon: XCircle,
  },
};

// ─── Cancel Dialog ────────────────────────────────────────────────────────────

function CancelDialog({
  onConfirm,
  onClose,
  isPending,
}: {
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          This action cannot be undone. Your order will be permanently
          cancelled.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-colors"
          >
            Keep It
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {isPending ? "Cancelling…" : "Yes, Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: OrderData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const router = useRouter();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const { mutateAsync: verifyPayment } = useVerifyPayment();
  const { mutateAsync: regenerateLink } = useRegeneratePaymentLink();
  const { initializePayment } = usePaystack();

  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.initiated;
  const StatusIcon = statusCfg.Icon;

  // Show action buttons for any status that isn't paid/delivered/cancelled
  const showActions = order.status === "initiated";

  const handleCancel = () => {
    cancelOrder(order.id, {
      onSuccess: () => {
        toast.success("Order cancelled");
        setShowCancelDialog(false);
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Failed to cancel order",
        ),
    });
  };

  const handlePayNow = async () => {
    if (!order.payment?.reference) {
      toast.error("No payment reference. Try regenerating a payment link.");
      return;
    }
    router.push(order.payment.authorizationUrl);
  };

  return (
    <>
      {showCancelDialog && (
        <CancelDialog
          onConfirm={handleCancel}
          onClose={() => setShowCancelDialog(false)}
          isPending={isCancelling}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
        {/* ── Summary Row (always visible) ── */}
        <button
          onClick={() => setIsExpanded((e) => !e)}
          className="w-full flex items-center gap-4 p-4 text-left"
        >
          {/* Card thumbnail */}
          <div className="w-16 h-11 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 flex-shrink-0">
            {order.cardImages?.front ? (
              <Image
                src={order.cardImages.front}
                alt="Card"
                width={64}
                height={44}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-4 h-4 text-white/60" />
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-sm font-semibold text-gray-900">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusCfg.color} ${statusCfg.bg}`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Total + chevron */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm font-bold text-gray-900">
              ₦{order.total.toLocaleString()}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* ── Expanded Details ── */}
        {isExpanded && (
          <div className="border-t border-gray-100 px-4 pb-5 pt-4 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card preview */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Card Design
                </p>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCardFlipped((f) => !f);
                  }}
                  className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br from-indigo-600 to-indigo-800"
                >
                  {order.cardImages?.front && order.cardImages?.back ? (
                    <Image
                      src={
                        isCardFlipped
                          ? order.cardImages.back
                          : order.cardImages.front
                      }
                      alt={isCardFlipped ? "Back" : "Front"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60 text-xs">
                      No design
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                    Click to flip
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Delivery
                </p>
                <dl className="space-y-1.5 text-sm">
                  {[
                    ["Name", order.fullName],
                    ["Email", order.emailAddress],
                    ["Phone", order.phoneNumber],
                    ["Address", order.streetAddress],
                    ["City", order.city],
                    ["State", order.state],
                    ["Country", order.country],
                    ["Zip", order.zipCode],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-2">
                      <dt className="text-gray-400 w-16 flex-shrink-0 text-xs pt-0.5">
                        {label}
                      </dt>
                      <dd className="text-gray-800 font-medium text-xs break-all">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Pricing
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₦{order.shippingCost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>₦{order.total.toLocaleString()}</span>
                </div>
              </div>
              {order.estimatedTimeOfArrival && order.status !== "cancelled" && (
                <p className="text-xs text-gray-400 mt-3">
                  ETA:{" "}
                  {new Date(order.estimatedTimeOfArrival).toLocaleDateString(
                    "en-NG",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              )}
            </div>

            {/* Actions — only when status is initiated */}
            {showActions && (
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  onClick={handlePayNow}
                  className="bg-[#7269E3] hover:bg-[#5a52c8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Pay Now — ₦{order.total.toLocaleString()}
                </Button>
                <Button
                  // onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <RotateCcw
                    className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`}
                  />
                  {isRegenerating ? "Generating…" : "Regenerate Link"}
                </Button>
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  className="text-red-600 hover:bg-red-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
      <div className="w-16 h-11 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded animate-pulse w-2/5" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
      </div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { data, isLoading, isError, refetch } = useGetOrders();

  const orders = [...(data?.data ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          {!isLoading && orders.length > 0 && (
            <span className="text-sm text-gray-400">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm mb-4">Failed to load orders.</p>
            <button
              onClick={() => refetch()}
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && orders.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-400 text-sm">
              Design your card and place your first order.
            </p>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && !isError && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
