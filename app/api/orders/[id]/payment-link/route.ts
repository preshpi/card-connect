import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const authorization = request.headers.get("authorization");

    const response = await fetch(
      `${API_BASE_URL}/api/orders/${id}/payment-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authorization && { Authorization: authorization }),
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Regenerate payment link proxy error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to reach server" },
      { status: 502 },
    );
  }
}
