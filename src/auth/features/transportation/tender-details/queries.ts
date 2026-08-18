import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTenders,
  fetchTenderById,
  createTender,
  updateTender,
  deleteTender,
} from "./api";
import type { TenderRecord } from "./data";

export const TENDER_DETAILS_KEY = ["@transport/tender-details"];

export function useTendersQuery() {
  return useQuery({
    queryKey: TENDER_DETAILS_KEY,
    queryFn: fetchTenders,
  });
}

export function useTenderByIdQuery(tenderId: string) {
  return useQuery({
    queryKey: [...TENDER_DETAILS_KEY, tenderId],
    queryFn: () => fetchTenderById(tenderId),
    enabled: Boolean(tenderId),
  });
}

export function useCreateTenderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<TenderRecord, "tenderId">) =>
      createTender(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENDER_DETAILS_KEY });
    },
  });
}

export function useUpdateTenderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TenderRecord) => updateTender(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENDER_DETAILS_KEY });
    },
  });
}

export function useDeleteTenderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenderId: string) => deleteTender(tenderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENDER_DETAILS_KEY });
    },
  });
}
