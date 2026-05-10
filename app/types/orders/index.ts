export interface CardImages {
  front: string;
  back: string;
}

export interface CreateOrderRequest {
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

export interface OrderData {
  id: string;
  subtotal: number;
  total: number;
  ETA: string | null;
  status: "initiated" | "pending" | "completed" | "cancelled";
  cardImages: CardImages;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  streetAddress: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}

export interface CreateOrderResponse {
  status: boolean;
  message: string;
  data: OrderData;
}
