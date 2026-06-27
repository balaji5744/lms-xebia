import axios from 'axios';
import { getSession } from 'next-auth/react';

// Spring Boot Backend Base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Centrally configured Axios Client with request and response interceptors.
 * Designed for standard Next.js App Router/Pages Router enterprise patterns.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request Interceptor: Inject bearer tokens retrieved from NextAuth session
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // getSession retrieves the active NextAuth session from the browser client
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      } else if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    } catch (error) {
      console.warn('[apiClient] Unable to retrieve NextAuth session. Outgoing request will be unauthenticated:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error classification and transformation
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const responseStatus = error.response ? error.response.status : null;
    const responseData = error.response ? error.response.data : null;

    // Standard Next.js error classification for debugging or global logging
    if (responseStatus === 401) {
      console.error('[apiClient] Unauthorized - JWT is invalid or expired.');
    } else if (responseStatus === 403) {
      console.error('[apiClient] Forbidden - You do not have permissions for this action.');
    } else if (responseStatus === 404) {
      console.error('[apiClient] Resource Not Found:', responseData?.message || error.message);
    } else if (responseStatus >= 500) {
      console.error('[apiClient] Server Error:', responseData?.message || 'Internal Server Error');
    }

    // Build unified error payload structure to simplify use in React components / React Query
    const normalizedError = {
      status: responseStatus,
      message: responseData?.message || error.message || 'An unexpected error occurred',
      details: responseData || null,
      isNetworkError: !error.response,
      originalError: error,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
