import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bulkLockGsmDemands, getGsmPaperDemands, lockGsmDemand } from "./api";

export const useGsmPaperDemandsQuery = (
  filter?: Paper.GsmPaperDemandFilter,
) => {
  return useQuery({
    queryKey: ["gsm-paper-demands", filter],
    queryFn: () => getGsmPaperDemands(filter),
  });
};

export const useLockGsmDemandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: Paper.DemandLockStatus;
    }) => lockGsmDemand(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsm-paper-demands"] });
    },
  });
};

export const useBulkLockGsmDemandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: number[];
      status: Paper.DemandLockStatus;
    }) => bulkLockGsmDemands(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsm-paper-demands"] });
    },
  });
};
