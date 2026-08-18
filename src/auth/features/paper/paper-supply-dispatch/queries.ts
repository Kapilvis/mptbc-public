import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaperDispatch,
  deletePaperDispatch,
  getPaperDispatchById,
  getPaperDispatches,
  togglePaperDispatchStatus,
  updatePaperDispatch,
} from "./api";

const QUERY_KEY = ["paper-dispatches"];

export function usePaperDispatchesQuery(filter?: PaperSupplyDispatch.Filter) {
  return useQuery({
    queryKey: [...QUERY_KEY, filter],
    queryFn: () => getPaperDispatches(filter),
  });
}

export function usePaperDispatchByIdQuery(id?: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, "detail", id],
    queryFn: () => (id ? getPaperDispatchById(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
}

export function useCreatePaperDispatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: PaperSupplyDispatch.PaperDispatchForm) =>
      createPaperDispatch(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdatePaperDispatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      form,
    }: {
      id: number;
      form: PaperSupplyDispatch.PaperDispatchForm;
    }) => updatePaperDispatch(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function usePaperDispatchActiveStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dispatchId,
      isActive,
    }: {
      dispatchId: number;
      isActive: boolean;
    }) => togglePaperDispatchStatus(dispatchId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeletePaperDispatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePaperDispatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
