import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const idempotencyKey = request.headers.get("idempotency-key");
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization && { Authorization: authorization }),
        ...(idempotencyKey && { "idempotency-key": idempotencyKey }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Create order proxy error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to reach server" },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authorization = request.headers.get("authorization");

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authorization && { Authorization: authorization }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get orders proxy error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to reach server" },
      { status: 502 },
    );
  }
}
