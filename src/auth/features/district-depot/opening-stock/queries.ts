import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveAllOpeningStock,
  approveOpeningStock,
  getOpeningStockKpis,
  getOpeningStockList,
} from "./api";
import type { ApproveStockPayload } from "./data";

const QUERY_KEY = ["opening-stock"];

export function useOpeningStockKpisQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, "kpis"],
    queryFn: getOpeningStockKpis,
  });
}

export function useOpeningStockQuery(academicYear?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, "list", academicYear],
    queryFn: () => getOpeningStockList(academicYear),
  });
}

export function useApproveStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApproveStockPayload) => approveOpeningStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useApproveAllStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveAllOpeningStock(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
