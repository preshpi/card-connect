import axios, { AxiosInstance, AxiosError } from "axios";

type RetryableRequestConfig = NonNullable<AxiosError["config"]> & {
  _retry?: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://cardconnect-api.collinsadi.xyz/api";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Load token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.token || localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          typeof window !== "undefined"
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const response = await this.client.post("/auth/refresh-auth", {
              refreshToken,
            });

            const { accessToken } = response.data.data;
            this.token = accessToken;
            localStorage.setItem("accessToken", accessToken);

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${accessToken}`,
            };
            return this.client(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("accessToken", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  getClient() {
    return this.client;
  }
}

export const apiClient = new ApiClient();
