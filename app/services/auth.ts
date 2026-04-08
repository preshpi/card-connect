import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api-client";
import {
  SignUpRequest,
  LoginRequest,
  VerifyEmailRequest,
  ResendVerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  AuthResponse,
  UserResponse,
  MessageResponse,
  SessionsResponse,
} from "@/app/types/auth";
import { useAuthStore } from "@/app/store/useAuthStore";

const AUTH_QUERY_KEYS = {
  user: ["auth", "user"],
  sessions: ["auth", "sessions"],
};

// Sign Up Hook
export const useSignUp = () => {
  return useMutation<AuthResponse, Error, SignUpRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.getClient().post("/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.accessToken && data.data.refreshToken) {
        apiClient.setToken(data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }
    },
  });
};

// Verify Email Hook
export const useVerifyEmail = () => {
  return useMutation<MessageResponse, Error, VerifyEmailRequest>({
    mutationFn: async (data) => {
      const response = await apiClient
        .getClient()
        .post("/auth/verify-email", data);
      return response.data;
    },
  });
};

// Resend Verification OTP Hook (same endpoint)
export const useResendVerifyEmail = () => {
  return useMutation<MessageResponse, Error, ResendVerifyEmailRequest>({
    mutationFn: async (data) => {
      const response = await apiClient
        .getClient()
        .post("/auth/verify-email", data);
      return response.data;
    },
  });
};

// Login Hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.getClient().post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.accessToken && data.data.refreshToken) {
        apiClient.setToken(data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      }
    },
  });
};

// Get Current User Hook
export const useGetUser = () => {
  return useQuery<UserResponse, Error>({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      const response = await apiClient.getClient().get("/auth/me");
      return response.data;
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Forgot Password Hook
export const useForgotPassword = () => {
  return useMutation<MessageResponse, Error, ForgotPasswordRequest>({
    mutationFn: async (data) => {
      const response = await apiClient
        .getClient()
        .post("/auth/forgot-password", data);
      return response.data;
    },
  });
};

// Reset Password Hook
export const useResetPassword = () => {
  return useMutation<MessageResponse, Error, ResetPasswordRequest>({
    mutationFn: async (data) => {
      const response = await apiClient
        .getClient()
        .post("/auth/reset-password", data);
      return response.data;
    },
  });
};

// Change Password Hook
export const useChangePassword = () => {
  return useMutation<MessageResponse, Error, ChangePasswordRequest>({
    mutationFn: async (data) => {
      const response = await apiClient
        .getClient()
        .post("/settings/change-password", data);
      return response.data;
    },
  });
};

// Delete Account Hook
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation<MessageResponse, Error, DeleteAccountRequest>({
    mutationFn: async (data) => {
      const response = await apiClient
        .getClient()
        .delete("/settings/account", { data });
      return response.data;
    },
    onSuccess: () => {
      apiClient.clearToken();
      clearUser();
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });
};

// Logout Hook
export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation<MessageResponse, Error, void>({
    mutationFn: async () => {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;

      const response = await apiClient
        .getClient()
        .post("/auth/logout", { refreshToken });
      return response.data;
    },
    onSuccess: () => {
      apiClient.clearToken();
      clearUser();
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });
};

// Logout from All Devices Hook
export const useLogoutAll = () => {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation<MessageResponse, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.getClient().post("/auth/logout-all");
      return response.data;
    },
    onSuccess: () => {
      apiClient.clearToken();
      clearUser();
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });
};

// Get Sessions Hook
export const useGetSessions = () => {
  return useQuery<SessionsResponse, Error>({
    queryKey: AUTH_QUERY_KEYS.sessions,
    queryFn: async () => {
      const response = await apiClient.getClient().get("/auth/sessions");
      return response.data;
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
  });
};

// Revoke Session Hook
export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, Error, string>({
    mutationFn: async (sessionId) => {
      const response = await apiClient
        .getClient()
        .delete(`/auth/sessions/${sessionId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.sessions });
    },
  });
};

// Refresh Token Hook
export const useRefreshToken = () => {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: async (refreshToken) => {
      const response = await apiClient
        .getClient()
        .post("/auth/refresh-auth", { refreshToken });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.accessToken && data.data.refreshToken) {
        apiClient.setToken(data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }
    },
  });
};
