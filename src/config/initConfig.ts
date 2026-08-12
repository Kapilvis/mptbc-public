import { QueryClient } from "@tanstack/react-query";
import { ApiService } from "../services";

export function initConfig() {
  ApiService.setApiRoot(import.meta.env.VITE_API_BASE);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return {
    queryClient,
  };
}
