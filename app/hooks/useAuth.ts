// Example usage of auth hooks in a component

import {
  useLogin,
  useSignUp,
  useLogout,
  useGetUser,
} from "@/app/services/auth";
import { TsignInSchema } from "@/app/types/auth/Login";
import { TsignupSchema } from "@/app/types/auth/Signup";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/app/utils/apiError";

/**
 * Example Login Component
 */
export function useAuthLogin() {
  const router = useRouter();
  const { mutate: login, isPending: isLoading, error } = useLogin();

  const handleLogin = async (data: TsignInSchema) => {
    login(data, {
      onSuccess: () => {
        toast.success("Login successful!");
        router.push("/dashboard");
      },
      onError: (err: unknown) => {
        const message = getApiErrorMessage(
          err,
          "Login failed. Please try again.",
        );
        toast.error(message);
      },
    });
  };

  return { handleLogin, isLoading, error };
}

/**
 * Example Signup Component
 */
export function useAuthSignup() {
  const router = useRouter();
  const { mutate: signup, isPending: isLoading, error } = useSignUp();

  const handleSignup = async (data: TsignupSchema) => {
    signup(
      {
        fullName: `${data.firstname} ${data.lastname}`.trim(),
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Signup successful! Redirecting...");
          router.push("/verify-email");
        },
        onError: (err: unknown) => {
          const message = getApiErrorMessage(
            err,
            "Signup failed. Please try again.",
          );
          toast.error(message);
        },
      },
    );
  };

  return { handleSignup, isLoading, error };
}

/**
 * Example Logout Component
 */
export function useAuthLogout() {
  const router = useRouter();
  const { mutate: logout, isPending: isLoading } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/login");
      },
      onError: (err: unknown) => {
        const message = getApiErrorMessage(
          err,
          "Logout failed. Please try again.",
        );
        toast.error(message);
      },
    });
  };

  return { handleLogout, isLoading };
}

/**
 * Example Get User Hook
 */
export function useAuthUser() {
  const { data, isLoading, error, isSuccess } = useGetUser();

  return {
    user: data?.data,
    isLoading,
    error,
    isSuccess,
  };
}

/**
 * Example Protected Route Hook
 */
export function useProtectedRoute() {
  const router = useRouter();
  const { user, isLoading } = useAuthUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return { isAuthenticated: !!user, isLoading };
}
