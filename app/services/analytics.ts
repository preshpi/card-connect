import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { AnalyticsResponse } from "@/app/types/analytics";

const ANALYTICS_QUERY_KEYS = {
  analytics: ["analytics"],
  all: ["analytics", "all"],
};

// Get Analytics Hook
export const useGetAnalytics = () => {
  return useQuery<AnalyticsResponse, Error>({
    queryKey: ANALYTICS_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await apiClient.getClient().get("/analytics");
      return response.data;
    },
  });
};

// Function to fetch analytics data directly
export const fetchAnalytics = async (): Promise<AnalyticsResponse> => {
  const response = await apiClient.getClient().get("/analytics");
  return response.data;
};
