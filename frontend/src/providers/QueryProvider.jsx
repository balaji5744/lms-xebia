'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * QueryProvider wraps layout children to expose React Query (TanStack Query).
 * Designed specifically as a Client Component under Next.js App Router rules.
 * 
 * We initialize QueryClient inside a useState hook rather than in global scope.
 * This ensures that when Next.js does Server-Side Rendering (SSR), each user request
 * gets its own unique QueryClient instance, avoiding data leaks across requests.
 */
export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Adjust defaults as per business/LMS requirements
            staleTime: 60 * 1000, // 1 minute (stale-while-revalidate duration)
            refetchOnWindowFocus: false, // Prevent aggressive auto-refetching on tab switches
            retry: 1, // Number of automatic retry attempts on query failure
            refetchOnReconnect: 'always',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
