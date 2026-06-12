import { NextRequest, NextResponse } from "next/server";
import { AnalyticsResponse } from "@/app/types/analytics";

// CORS headers for allowing frontend requests
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

// Helper function to verify JWT token
function verifyToken(authHeader: string | null): boolean {
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  if (!token) return false;

  // TODO: Implement actual JWT verification with your secret key
  // For now, we'll just check if token exists and is not empty
  return token.length > 0;
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
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
        { status: 401, headers: CORS_HEADERS },
      );
    }

    // Extract range parameter from query string
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "monthly"; // Default to monthly

    // Validate range parameter
    const validRanges = ["daily", "weekly", "monthly", "yearly"];
    if (!validRanges.includes(range.toLowerCase())) {
      return NextResponse.json(
        {
          status: false,
          message:
            "Invalid range parameter. Must be: daily, weekly, monthly, or yearly",
        },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    // TODO: Fetch actual analytics data from your database based on range
    // This is a mock response - replace with real data fetching logic
    const analyticsData: AnalyticsResponse = {
      status: true,
      data: {
        totalProfileViews: 0,
        totalLinkClicks: 0,
        topPerformingLink: {
          linkId: "string",
          title: "string",
          url: "string",
          count: 0,
        },
        mostSharedLink: {
          linkId: "string",
          title: "string",
          url: "string",
          count: 0,
        },
      },
    };

    return NextResponse.json(analyticsData, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Analytics endpoint error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
