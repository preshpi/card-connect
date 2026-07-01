import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { ApiResponse, CreateOrderPayload, OrderData } from "@/app/types/orders";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const orderKeys = {
  all: ["orders"] as const,
};

// ─── Shared cache updater ─────────────────────────────────────────────────────
// Patches a single order inside the list cache by ID.
// Used by cancel, verify, and regenerate so the UI updates immediately
// without a refetch round-trip.

function updateOrderInList(
  queryClient: ReturnType<typeof useQueryClient>,
  updatedOrder: OrderData,
) {
  queryClient.setQueryData<ApiResponse<OrderData[]>>(orderKeys.all, (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      data: prev.data.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    };
  });
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const response = await apiClient.getClient().post(
        "/orders",
        {
          cardImages: payload.cardImages,
          fullName: payload.fullName,
          emailAddress: payload.emailAddress,
          phoneNumber: payload.phoneNumber,
          streetAddress: payload.streetAddress,
          country: payload.country,
          city: payload.city,
          state: payload.state,
          zipCode: payload.zipCode,
        },
        {
          headers: {
            "idempotency-key": payload.idempotencyKey,
          },
        },
      );
      return response.data;
    },
  });
}

export function useGetOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: async () => {
      const response = await apiClient.getClient().get("/orders");
      return response.data;
    },
    staleTime: 30_000,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient
        .getClient()
        .delete(`/orders/${orderId}/cancel`);
      return response.data;
    },
    onSuccess: (response: ApiResponse<OrderData>) => {
      updateOrderInList(queryClient, response.data);
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient
        .getClient()
        .post(`/orders/${orderId}/verify-payment`);
      return response.data;
    },
    onSuccess: (response: ApiResponse<OrderData>) => {
      updateOrderInList(queryClient, response.data);
    },
  });
}

export function useRegeneratePaymentLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient
        .getClient()
        .post(`/orders/${orderId}/payment-link`);
      return response.data;
    },
    onSuccess: (response: ApiResponse<OrderData>) => {
      updateOrderInList(queryClient, response.data);
    },
  });
}
