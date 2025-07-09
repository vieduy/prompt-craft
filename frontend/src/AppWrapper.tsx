import { RouterProvider } from "react-router-dom";
import { Head } from "./internal-components/Head";
import { OuterErrorBoundary } from "./prod-components/OuterErrorBoundary";
import { router } from "./router";
import { ThemeProvider } from "./internal-components/ThemeProvider";
import { DEFAULT_THEME } from "./constants/default-theme";
import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { stackClientApp } from "app/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const AppWrapper = () => {
  return (
    <OuterErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StackProvider app={stackClientApp}>
        <StackTheme>
        <ThemeProvider defaultTheme={DEFAULT_THEME}>
          <RouterProvider router={router} />
          <Head />
        </ThemeProvider>
        </StackTheme>
        </StackProvider>
      </QueryClientProvider>
    </OuterErrorBoundary>
  );
};