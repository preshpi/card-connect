import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import { ProfileUpdateRequest, MessageResponse } from "@/app/types/auth";

const PROFILE_QUERY_KEYS = {
  user: ["auth", "user"],
};

// Update Profile Hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, Error, ProfileUpdateRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.getClient().patch("/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.user });
    },
  });
};
