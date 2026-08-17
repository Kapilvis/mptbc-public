import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkUpdateTitleApprovalStatus,
  getTitleApprovals,
  updateTitleApprovalStatus,
} from "./api";

export const useTitleApprovalsQuery = (
  filter?: Distribution.TitleApprovalFilter,
) => {
  return useQuery({
    queryKey: ["title-approvals", filter],
    queryFn: () => getTitleApprovals(filter),
  });
};

export const useUpdateTitleApprovalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "Approved" | "Rejected" | "Hold" | "Pending";
    }) => updateTitleApprovalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["title-approvals"] });
    },
  });
};

export const useBulkUpdateTitleApprovalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: number[];
      status: "Approved" | "Rejected" | "Hold" | "Pending";
    }) => bulkUpdateTitleApprovalStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["title-approvals"] });
    },
  });
};
