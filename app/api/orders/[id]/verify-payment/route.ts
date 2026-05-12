import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const authorization = request.headers.get("authorization");

    const response = await fetch(
      `${API_BASE_URL}/api/orders/${params.id}/verify-payment`,
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
    console.error("Verify payment proxy error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to reach server" },
      { status: 502 },
    );
  }
}
