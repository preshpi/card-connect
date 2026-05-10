import { NextRequest, NextResponse } from "next/server";
import { CreateOrderResponse, OrderData } from "@/app/types/orders";

// In-memory storage for orders (replace with database in production)
const orders = new Map<string, OrderData>();

// Helper function to verify JWT token
function verifyToken(authHeader: string | null): boolean {
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  if (!token) return false;

  // TODO: Implement actual JWT verification with your secret key
  return token.length > 0;
}

// Generate UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!verifyToken(authHeader)) {
      return NextResponse.json(
        {
          status: false,
          message: "Unauthorized: Missing or invalid token",
        },
        { status: 401 },
      );
    }

    // Check for idempotency key
    const idempotencyKey = request.headers.get("idempotency-key");
    if (!idempotencyKey) {
      return NextResponse.json(
        {
          status: false,
          message: "Idempotency key header is required",
        },
        { status: 400 },
      );
    }

    // Check if order with this idempotency key already exists
    const existingOrder = Array.from(orders.values()).find(
      (order) => order.id === idempotencyKey,
    );

    if (existingOrder) {
      return NextResponse.json(
        {
          status: true,
          message: "Order already exists",
          data: existingOrder,
        },
        { status: 200 },
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "cardImages",
      "fullName",
      "emailAddress",
      "phoneNumber",
      "streetAddress",
      "country",
      "city",
      "state",
      "zipCode",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            status: false,
            message: `Missing required field: ${field}`,
          },
          { status: 400 },
        );
      }
    }

    // Create new order
    const orderId = generateUUID();
    const newOrder: OrderData = {
      id: orderId,
      subtotal: 10000,
      total: 10000,
      ETA: null,
      status: "initiated",
      cardImages: body.cardImages,
      fullName: body.fullName,
      emailAddress: body.emailAddress,
      phoneNumber: body.phoneNumber,
      streetAddress: body.streetAddress,
      country: body.country,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      createdAt: new Date().toISOString(),
    };

    // Store order (in production, save to database)
    orders.set(orderId, newOrder);

    const response: CreateOrderResponse = {
      status: true,
      message: "Order created successfully",
      data: newOrder,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!verifyToken(authHeader)) {
      return NextResponse.json(
        {
          status: false,
          message: "Unauthorized: Missing or invalid token",
        },
        { status: 401 },
      );
    }

    // Get order ID from query params
    const orderId = request.nextUrl.searchParams.get("id");

    if (orderId) {
      const order = orders.get(orderId);
      if (!order) {
        return NextResponse.json(
          {
            status: false,
            message: "Order not found",
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          status: true,
          message: "Order retrieved successfully",
          data: order,
        },
        { status: 200 },
      );
    }

    // Return all orders
    const allOrders = Array.from(orders.values());
    return NextResponse.json(
      {
        status: true,
        message: "Orders retrieved successfully",
        data: allOrders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
