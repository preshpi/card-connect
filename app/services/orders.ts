import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { CreateOrderRequest, CreateOrderResponse } from "@/app/types/orders";

export const useCreateOrder = () => {
  return useMutation<
    CreateOrderResponse,
    Error,
    CreateOrderRequest & { idempotencyKey: string }
  >({
    mutationFn: async (data) => {
      const { idempotencyKey, ...orderData } = data;
      const response = await apiClient.getClient().post("/orders", orderData, {
        headers: {
          "idempotency-key": idempotencyKey,
        },
      });
      return response.data;
    },
  });
};
