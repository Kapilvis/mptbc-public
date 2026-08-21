import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaperLabTesting,
  deletePaperLabTesting,
  getPaperLabTestingById,
  getPaperLabTestingList,
  updatePaperLabTesting,
} from "./api";
import type { PaperLabTestingRecord } from "./data";

const queryKey = ["@paper/lab-testing"];

export function usePaperLabTestingsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey,
    queryFn: getPaperLabTestingList,
    enabled,
  });
}

export function usePaperLabTestingQuery(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => getPaperLabTestingById(id),
    enabled: enabled && !!id,
  });
}

export function useCreatePaperLabTestingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PaperLabTestingRecord>) =>
      createPaperLabTesting(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdatePaperLabTestingMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PaperLabTestingRecord>) =>
      updatePaperLabTesting(id, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, id] });
    },
  });
}

export function useDeletePaperLabTestingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePaperLabTesting(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
