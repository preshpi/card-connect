export type OrderStatus =
  | "initiated"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CardImages {
  front: string;
  back: string;
}

export interface OrderPayment {
  reference: string;
  authorizationUrl: string;
  accessCode: string;
  amountKobo: number;
  currency: string;
}

export interface OrderData {
  id: string;
  cardImages: CardImages;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  streetAddress: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  estimatedTimeOfArrival: string | null;
  status: OrderStatus;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  payment?: OrderPayment;
  // Payment fields returned from backend (Paystack)
  paymentReference?: string;
  paymentAuthorizationUrl?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

export interface CreateOrderResponse extends ApiResponse<OrderData> {
  meta: { idempotentReplay: boolean };
}

export interface CreateOrderPayload {
  idempotencyKey: string;
  cardImages: CardImages;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  streetAddress: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
}
