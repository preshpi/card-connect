import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { AnalyticsResponse } from "@/app/types/analytics";

const ANALYTICS_QUERY_KEYS = {
  analytics: ["analytics"],
  all: ["analytics", "all"],
};

// Get Analytics Hook
export const useGetAnalytics = (
  range: "daily" | "weekly" | "monthly" | "yearly" = "monthly",
) => {
  return useQuery<AnalyticsResponse, Error>({
    queryKey: [ANALYTICS_QUERY_KEYS.all, range],
    queryFn: async () => {
      const response = await apiClient.getClient().get("/analytics", {
        params: { range },
      });
      return response.data;
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

// Function to fetch analytics data directly
export const fetchAnalytics = async (
  range: "daily" | "weekly" | "monthly" | "yearly" = "monthly",
): Promise<AnalyticsResponse> => {
  const response = await apiClient.getClient().get("/analytics", {
    params: { range },
  });
  return response.data;
};
