"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/Button";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  fetchNigerianStates,
  fetchCitiesForState,
  type GeoNamePlace,
} from "@/app/services/geoname";
import { useCreateOrder, useVerifyPayment } from "@/app/services/orders";
import { usePaystack } from "@/app/hooks/usePaystack";
import { getAccessToken } from "@/app/lib/auth";

interface CheckoutForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CardImages {
  frontCardUrl: string;
  backCardUrl: string;
}

interface TemplateSnapshot {
  id: string;
  name: string;
  createdAt: string;
  source: "builder-storage";
  builderState: unknown;
}

interface TemplateStore {
  order: string[];
  byId: Record<string, TemplateSnapshot>;
}

const TEMPLATE_STORAGE_KEY = "card-connect-templates";

const readBuilderSnapshot = () => {
  const stored = localStorage.getItem("builder-storage");

  if (!stored) {
    throw new Error("Builder design not found");
  }

  const parsed = JSON.parse(stored) as { state?: unknown };

  if (!parsed.state) {
    throw new Error("Builder design not found");
  }

  return parsed.state;
};

const saveTemplateSnapshot = () => {
  const builderState = readBuilderSnapshot();
  const existing = localStorage.getItem(TEMPLATE_STORAGE_KEY);
  const templateStore: TemplateStore = existing
    ? JSON.parse(existing)
    : { order: [], byId: {} };

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const name = `Template ${new Date(createdAt).toLocaleString()}`;

  templateStore.byId[id] = {
    id,
    name,
    createdAt,
    source: "builder-storage",
    builderState,
  };
  templateStore.order = [
    id,
    ...templateStore.order.filter((templateId) => templateId !== id),
  ];

  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templateStore));

  return name;
};

const Checkout = () => {
  const [cardImages, setCardImages] = useState<CardImages | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [states, setStates] = useState<GeoNamePlace[]>([]);
  const [cities, setCities] = useState<GeoNamePlace[]>([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [isOpeningPayment, setIsOpeningPayment] = useState(false);
  const [showTemplatePrompt, setShowTemplatePrompt] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CheckoutForm | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const router = useRouter();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const { mutateAsync: verifyPayment } = useVerifyPayment();
  const { initializePayment } = usePaystack();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutForm>({
    defaultValues: { country: "Nigeria" },
  });

  const watchedState = watch("state");

  // Load card images from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cardImages");
      if (stored) {
        setCardImages(JSON.parse(stored));
      } else {
        toast.error("Card design not found. Redirecting to preview...");
        setTimeout(() => router.push("/preview"), 1500);
      }
    } catch {
      toast.error("Failed to load card design. Please go back and try again.");
      setTimeout(() => router.push("/preview"), 1500);
    }
  }, [router]);

  // Load Nigerian states
  useEffect(() => {
    fetchNigerianStates()
      .then(setStates)
      .catch(() => toast.error("Failed to load states. Please refresh."))
      .finally(() => setStatesLoading(false));
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!watchedState) {
      setCities([]);
      return;
    }
    const selected = states.find((s) => s.name === watchedState);
    if (!selected) return;

    setCitiesLoading(true);
    fetchCitiesForState(selected.geonameId)
      .then(setCities)
      .catch(() => {
        toast.error("Failed to load cities");
        setCities([]);
      })
      .finally(() => setCitiesLoading(false));
  }, [watchedState, states]);

  const onSubmit = async (data: CheckoutForm) => {
    setPendingOrder(data);
    setShowTemplatePrompt(true);
  };

  const proceedWithOrder = async (data: CheckoutForm) => {
    if (!cardImages) {
      toast.error("Card design not found");
      return;
    }
    if (!getAccessToken()) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      setIsOpeningPayment(true);

      const result = await createOrder({
        idempotencyKey: crypto.randomUUID(),
        cardImages: {
          front: cardImages.frontCardUrl,
          back: cardImages.backCardUrl,
        },
        fullName: data.fullName,
        emailAddress: data.email,
        phoneNumber: data.phoneNumber,
        streetAddress: data.streetAddress,
        country: data.country,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      });

      // The backend returns { status, data: { order, paymentLink, paymentReference }, meta }
      const apiBody = result;
      const order = apiBody?.data?.order ?? apiBody?.data ?? null;
      const paymentLink =
        apiBody?.data?.paymentLink ??
        apiBody?.data?.payment?.authorizationUrl ??
        null;
      const paymentReference =
        apiBody?.data?.paymentReference ??
        apiBody?.data?.payment?.reference ??
        order?.paymentReference ??
        null;

      if (!order) {
        toast.error("Order creation failed. Please try again.");
        router.push("/orders");
        return;
      }

      // Already paid (idempotent replay) — just go to orders
      if (order.status === "paid") {
        toast.success("This order is already paid!");
        router.push("/orders");
        return;
      }

      // If backend provided a payment link, redirect user there
      if (paymentLink) {
        toast.success("Redirecting to payment...");
        // Use full redirect to external payment page
        window.location.href = paymentLink;
        return;
      }

      // Fallback: if we have a reference and price, open inline paystack flow
      if (paymentReference) {
        await initializePayment({
          email: order.emailAddress,
          amountNaira: order.total,
          reference: paymentReference,
          onDismiss: () => {
            toast.info(
              "Payment cancelled. You can complete it from your orders page.",
            );
            router.push("/orders");
          },
          onSuccess: async () => {
            try {
              await verifyPayment(order.id);
              toast.success("Payment confirmed! Your order is on its way.");
            } catch {
              toast.warning(
                "Payment received but verification is pending. Check your orders for status.",
              );
            } finally {
              router.push("/orders");
            }
          },
        });
        return;
      }

      // Backend hasn't provided a payment mechanism yet
      toast.success("Order created! Complete payment from your orders page.");
      router.push("/orders");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handleTemplateChoice = async (shouldSaveTemplate: boolean) => {
    if (!pendingOrder) {
      setShowTemplatePrompt(false);
      return;
    }

    try {
      if (shouldSaveTemplate) {
        setIsSavingTemplate(true);
        const templateName = saveTemplateSnapshot();
        toast.success(`Saved ${templateName} to templates.`);
      }

      setShowTemplatePrompt(false);
      await proceedWithOrder(pendingOrder);
    } finally {
      setIsSavingTemplate(false);
      setPendingOrder(null);
    }
  };

  const isSubmitting = isPending || isOpeningPayment;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Form ── */}
          <div>
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Delivery Information
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div>
                  <input
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                    placeholder="Full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Email address"
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                      })}
                      placeholder="Phone number"
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <input
                    {...register("streetAddress", {
                      required: "Street address is required",
                    })}
                    placeholder="Street address"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                  />
                  {errors.streetAddress && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.streetAddress.message}
                    </p>
                  )}
                </div>

                {/* Country + State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    {...register("country")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 bg-white text-sm text-gray-900"
                  >
                    <option value="Nigeria">Nigeria</option>
                  </select>

                  <div>
                    <select
                      {...register("state", { required: "State is required" })}
                      disabled={statesLoading}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 bg-white text-sm text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {statesLoading ? "Loading states…" : "Select state"}
                      </option>
                      {states.map((s) => (
                        <option key={s.geonameId} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* City + Zip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      {...register("city", { required: "City is required" })}
                      disabled={citiesLoading || !watchedState}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 bg-white text-sm text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {citiesLoading
                          ? "Loading cities…"
                          : !watchedState
                            ? "Select state first"
                            : "Select city"}
                      </option>
                      {cities.map((c) => (
                        <option key={c.geonameId} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("zipCode", {
                        required: "Zip code is required",
                      })}
                      placeholder="Zip code"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? "Creating order…"
                    : isOpeningPayment
                      ? "Opening payment…"
                      : "Pay now"}
                </Button>
              </form>
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div>
            <div className="bg-white rounded-2xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₦10,000</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">₦3,500</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-gray-900">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">₦13,500</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Arrives Wed, Jun 25 – Mon, Jun 30
              </p>

              {/* Card Preview */}
              <div className="mb-6">
                <div
                  onClick={() => setIsCardFlipped((f) => !f)}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer bg-linear-to-br from-indigo-600 to-indigo-800"
                >
                  {cardImages ? (
                    <Image
                      src={
                        isCardFlipped
                          ? cardImages.backCardUrl
                          : cardImages.frontCardUrl
                      }
                      alt={isCardFlipped ? "Card Back" : "Card Front"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm">
                      No card design found
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                    Click to flip
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-2">
                  Eco-Friendly Smart Card
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  Dimensions: 3.5″ × 2″
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  Style: Eco-Friendly
                </p>
                <p className="text-gray-900 font-semibold">Qty: 1</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTemplatePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Save this design as a template?
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Saving a copy will store the current builder state so you can
              reuse it later.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                disabled={isOpeningPayment || isSavingTemplate}
                onClick={() => handleTemplateChoice(true)}
                className="flex-1 bg-[#7269E3] hover:bg-[#5a52c8] text-white py-3 disabled:opacity-50"
              >
                {isSavingTemplate ? "Saving template…" : "Save and continue"}
              </Button>
              <Button
                type="button"
                disabled={isOpeningPayment || isSavingTemplate}
                onClick={() => handleTemplateChoice(false)}
                className="flex-1 border border-gray-200 bg-white py-4 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Continue without saving
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
