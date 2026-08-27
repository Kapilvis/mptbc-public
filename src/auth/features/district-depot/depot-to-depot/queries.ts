import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDeficitDepots,
  getDepotTransferKpis,
  getSurplusDepots,
  getTransferLedger,
  sanctionInterDepotTransfer,
} from "./api";
import type { SanctionTransferPayload } from "./data";

const QUERY_KEY = ["depot-to-depot-transfer"];

export function useDepotTransferKpisQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, "kpis"],
    queryFn: getDepotTransferKpis,
  });
}

export function useDeficitDepotsQuery(academicYear?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, "deficit", academicYear],
    queryFn: () => getDeficitDepots(academicYear),
  });
}

export function useSurplusDepotsQuery(academicYear?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, "surplus", academicYear],
    queryFn: () => getSurplusDepots(academicYear),
  });
}

export function useTransferLedgerQuery(academicYear?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, "ledger", academicYear],
    queryFn: () => getTransferLedger(academicYear),
  });
}

export function useSanctionTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SanctionTransferPayload) =>
      sanctionInterDepotTransfer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
