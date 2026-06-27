import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Spring Boot Backend Base URL
const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export interface ApiError {
  status: number | null;
  message: string;
  details: any;
  isNetworkError: boolean;
  originalError: AxiosError;
}

/**
 * Centrally configured Axios Client with request and response interceptors.
 * Tailored for modern Vite + React single page applications.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

// Request Interceptor: Inject standard JWT bearer tokens retrieved from localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn(
        '[apiClient] Unable to read localStorage "token" for auth header injection:',
        error,
      );
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Centralized error classification and transformation
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const responseStatus = error.response ? error.response.status : null;
    const responseData = error.response ? error.response.data : null;

    // Standard client error classification for global logging/debugging
    if (responseStatus === 401) {
      console.error(
        "[apiClient] Unauthorized - JWT token is invalid or expired.",
      );
    } else if (responseStatus === 403) {
      console.error("[apiClient] Forbidden - Insufficient permissions.");
    } else if (responseStatus === 404) {
      console.error(
        "[apiClient] Resource Not Found:",
        responseData?.message || error.message,
      );
    } else if (responseStatus && responseStatus >= 500) {
      console.error(
        "[apiClient] Server Error:",
        responseData?.message || "Internal Server Error",
      );
    }

    // Build unified error payload structure to simplify use in React components / React Query hooks
    const normalizedError: ApiError = {
      status: responseStatus,
      message:
        responseData?.message ||
        error.message ||
        "An unexpected error occurred",
      details: responseData || null,
      isNetworkError: !error.response,
      originalError: error,
    };

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
