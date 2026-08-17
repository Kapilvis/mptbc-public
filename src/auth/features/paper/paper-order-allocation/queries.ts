import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaperOrder,
  deletePaperOrder,
  getPaperOrderById,
  getPaperOrders,
  togglePaperOrderStatus,
  updatePaperOrder,
} from "./api";

const QUERY_KEY = ["paper-orders"];

export function usePaperOrdersQuery(filter?: PaperOrder.Filter) {
  return useQuery({
    queryKey: [...QUERY_KEY, filter],
    queryFn: () => getPaperOrders(filter),
  });
}

export function usePaperOrderByIdQuery(id?: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, "detail", id],
    queryFn: () => (id ? getPaperOrderById(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
}

export function useCreatePaperOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: PaperOrder.PaperSupplyOrderForm) =>
      createPaperOrder(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdatePaperOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      form,
    }: {
      id: number;
      form: PaperOrder.PaperSupplyOrderForm;
    }) => updatePaperOrder(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function usePaperOrderActiveStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      isActive,
    }: {
      orderId: number;
      isActive: boolean;
    }) => togglePaperOrderStatus(orderId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeletePaperOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePaperOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
