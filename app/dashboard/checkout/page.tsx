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
import { CreateOrderResponse } from "@/app/types/orders";
import { useCreateOrder } from "@/app/services/orders";

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

interface CardImage {
  frontCardUrl: string;
  backCardUrl: string;
}

// Generate UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const Checkout = () => {
  const [cardImages, setCardImages] = useState<CardImage | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [states, setStates] = useState<GeoNamePlace[]>([]);
  const [cities, setCities] = useState<GeoNamePlace[]>([]);
  const [selectedStateGeonameId, setSelectedStateGeonameId] = useState<
    number | null
  >(null);
  const [statesLoading, setStatesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutForm>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      streetAddress: "",
      country: "Nigeria",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // Watch the state field to fetch cities when it changes
  const watchedState = watch("state");

  useEffect(() => {
    if (watchedState) {
      const selectedState = states.find((s) => s.name === watchedState);
      if (selectedState) {
        setSelectedStateGeonameId(selectedState.geonameId);
        setCitiesLoading(true);
        fetchCitiesForState(selectedState.geonameId)
          .then((citiesList) => {
            setCities(citiesList);
          })
          .catch((error) => {
            console.error("Error loading cities:", error);
            toast.error("Failed to load cities");
            setCities([]);
          })
          .finally(() => {
            setCitiesLoading(false);
          });
      }
    } else {
      setCities([]);
      setSelectedStateGeonameId(null);
    }
  }, [watchedState, states]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCardImages = localStorage.getItem("cardImages");
        if (storedCardImages) {
          setCardImages(JSON.parse(storedCardImages));
        } else {
          toast.error("Card images not found. Redirecting to preview....");
          setTimeout(() => router.push("/preview"), 1500);
        }
      } catch (error: any) {
        toast.error("Error parsing localStorage:", error.message);
      }
    }
  }, [router]);

  // Fetch Nigerian states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setStatesLoading(true);
      try {
        const nigStates = await fetchNigerianStates();
        setStates(nigStates);
      } catch (error) {
        console.error("Error loading states:", error);
        toast.error("Failed to load states");
      } finally {
        setStatesLoading(false);
      }
    };
    loadStates();
  }, []);

  const onSubmit = async (data: CheckoutForm) => {
    if (!cardImages) {
      toast.error("Card images not found");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Access token not found. Please login again.");
      router.push("/login");
      return;
    }

    const idempotencyKey = generateUUID();

    createOrder(
      {
        idempotencyKey,
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
      },
      {
        onSuccess: (result) => {
          toast.success("Order created successfully!");
          console.log("Order created:", result.data);
          // TODO: Redirect to order confirmation page
          // router.push(`/orders/${result.data.id}`);
        },
        onError: (error) => {
          console.error("Checkout error:", error);
          toast.error(
            error instanceof Error ? error.message : "Failed to create order",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="lg:col-span-1">
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
                    required
                    placeholder="Full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email and Phone */}
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
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
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
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
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
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 placeholder:text-gray-500 text-sm text-gray-900"
                  />
                  {errors.streetAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.streetAddress.message}
                    </p>
                  )}
                </div>

                {/* Country, State, City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      {...register("country")}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 bg-white placeholder:text-gray-500 text-sm text-gray-900"
                    >
                      <option value="Nigeria">Nigeria</option>
                    </select>
                  </div>
                  <div>
                    <select
                      {...register("state", {
                        required: "State is required",
                      })}
                      disabled={statesLoading || states.length === 0}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 bg-white placeholder:text-gray-500 text-sm text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {statesLoading ? "Loading states..." : "Select State"}
                      </option>
                      {states.map((state) => (
                        <option key={state.geonameId} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cities and Zip Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      {...register("city", {
                        required: "City is required",
                      })}
                      disabled={
                        citiesLoading ||
                        cities.length === 0 ||
                        !selectedStateGeonameId
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 bg-white placeholder:text-gray-500 text-sm text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {citiesLoading
                          ? "Loading cities..."
                          : !selectedStateGeonameId
                            ? "Select a state first"
                            : "Select City"}
                      </option>
                      {cities.map((city) => (
                        <option key={city.geonameId} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pay Now Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Pay now"}
                </Button>
              </form>
            </div>
          </div>

          {/* Right side - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>

              {/* Order Pricing */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₦10,000</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">₦3,500</span>
                </div>
                <div className="border-t border-gray-200 text-gray-900 pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">₦13,500</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Arrives Wed, Jun 25 – Mon, Jun 30
              </p>

              {/* Card Display */}
              <div className="mb-6">
                <div
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer transform transition-transform bg-gradient-to-br from-indigo-600 to-indigo-800"
                >
                  {cardImages &&
                  cardImages.frontCardUrl &&
                  cardImages.backCardUrl ? (
                    <Image
                      src={
                        isCardFlipped
                          ? cardImages.backCardUrl
                          : cardImages.frontCardUrl
                      }
                      alt={isCardFlipped ? "Card Back" : "Card Front"}
                      className="w-full h-full object-cover"
                      width={600}
                      height={400}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-center px-4">
                      <p className="text-sm">No card design found</p>
                    </div>
                  )}

                  {/* Flip Indicator */}
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                    Click to flip
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-2">
                  Eco-Friendly Smart Card
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  Dimensions: 3&quot;5&quot; x 2&quot;
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
    </div>
  );
};

export default Checkout;
