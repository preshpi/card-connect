"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ChevronDown,
  Package,
  ShoppingBag,
  XCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { useGetOrders, useCancelOrder } from "@/app/services/orders";
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
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          This action cannot be undone. Your order will be permanently
          cancelled.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
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
  const router = useRouter();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

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
          className="w-full flex items-center gap-3 p-3 sm:p-4 text-left"
        >
          {/* Card thumbnail */}
          <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden bg-linear-to-br from-indigo-600 to-indigo-800 shrink-0">
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
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${statusCfg.color} ${statusCfg.bg}`}
              >
                <StatusIcon className="w-3 h-3 shrink-0" />
                <span className="hidden sm:inline">{statusCfg.label}</span>
                <span className="sm:hidden">
                  {statusCfg.label.split(" ")[0]}
                </span>
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

          {/* Chevron only */}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Bottom row: Total amount — always visible */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium">Total</span>
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ₦{order.total.toLocaleString()}
          </span>
        </div>

        {/* ── Expanded Details ── */}
        {isExpanded && (
          <div className="border-t border-gray-100 px-3 sm:px-4 pb-4 sm:pb-5 pt-4 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                  className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer bg-linear-to-br from-indigo-600 to-indigo-800"
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

              {/* Delivery info — better mobile spacing */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Delivery
                </p>
                <dl className="space-y-2 text-xs sm:text-sm">
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
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row sm:gap-2 sm:justify-between"
                    >
                      <dt className="text-gray-400 font-medium text-xs">
                        {label}
                      </dt>
                      <dd className="text-gray-800 font-semibold text-xs sm:text-right break-all">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Shipping Details — stack on mobile */}
            {order.delivery && (
              <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Shipping Details
                </p>
                <dl className="space-y-3 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2">
                    <dt className="text-gray-600 font-medium">Provider</dt>
                    <dd className="text-gray-900 font-semibold capitalize">
                      {order.delivery.provider}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2">
                    <dt className="text-gray-600 font-medium">Tracking #</dt>
                    <dd className="text-gray-900 font-mono text-xs break-all">
                      {order.delivery.orderNo}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2">
                    <dt className="text-gray-600 font-medium">Status</dt>
                    <dd className="text-blue-700 font-semibold">
                      {order.delivery.status}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2 border-t border-blue-200 pt-3 sm:pt-2">
                    <dt className="text-gray-600 font-medium">Weight</dt>
                    <dd className="text-gray-900 font-medium">
                      {order.delivery.weightKg} kg
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2">
                    <dt className="text-gray-600 font-medium">Delivery Cost</dt>
                    <dd className="text-gray-900 font-medium">
                      ₦{order.delivery.cost.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Pricing — stack on mobile */}
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Pricing
              </p>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₦{order.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    ₦{order.shippingCost?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2.5 mt-2">
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
                      month: "short",
                    },
                  )}
                </p>
              )}
            </div>

            {/* Actions — responsive buttons */}
            {showActions && (
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={handlePayNow}
                  className="flex-1 bg-[#7269E3] hover:bg-[#5a52c8] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Pay Now — ₦{(order.total / 1000).toFixed(1)}k
                </Button>
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  className="flex-1 text-red-600 hover:bg-red-50 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-colors border border-red-200"
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
    <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 flex items-center gap-3">
      <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-lg bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded animate-pulse w-2/5" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
      </div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
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
    <div className="w-full min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12 px-4 sm:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Orders
          </h1>
          {!isLoading && orders.length > 0 && (
            <span className="text-xs sm:text-sm text-gray-400">
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
          <div className="flex flex-col items-center py-20 sm:py-24 text-center">
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
