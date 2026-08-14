import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkUpdateDemandApprovalStatus,
  getDemandApprovals,
  updateDemandApprovalStatus,
} from "./api";

export function useDemandApprovalsQuery(
  filters?: Distribution.DemandApprovalFilter,
) {
  return useQuery({
    queryKey: ["demandApprovals", filters],
    queryFn: () => getDemandApprovals(filters),
  });
}

export function useUpdateApprovalStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: Distribution.DemandStatus;
    }) => updateDemandApprovalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demandApprovals"] });
    },
  });
}

export function useBulkApprovalStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: number[];
      status: Distribution.DemandStatus;
    }) => bulkUpdateDemandApprovalStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demandApprovals"] });
    },
  });
}
