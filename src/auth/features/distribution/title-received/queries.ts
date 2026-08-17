import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkUpdateTitleReceivedStatus,
  getTitleReceivedList,
  updateTitleReceivedStatus,
} from "./api";

export const useTitleReceivedQuery = (
  filter?: Distribution.TitleReceivedFilter,
) => {
  return useQuery({
    queryKey: ["title-received", filter],
    queryFn: () => getTitleReceivedList(filter),
  });
};

export const useUpdateTitleReceivedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      remarks,
    }: {
      id: number;
      status: Distribution.ReceiptStatus;
      remarks?: string;
    }) => updateTitleReceivedStatus(id, status, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["title-received"] });
    },
  });
};

export const useBulkUpdateTitleReceivedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: number[];
      status: Distribution.ReceiptStatus;
    }) => bulkUpdateTitleReceivedStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["title-received"] });
    },
  });
};
