import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTenders,
  getBids,
  checkTransporterQualification,
  submitBid,
} from "./api";

const queryKey = ["@transport/commercial-bid"];

export function useTendersQuery() {
  return useQuery({
    queryKey: [...queryKey, "tenders"],
    queryFn: getTenders,
  });
}

export function useBidsQuery(transporterId?: number) {
  return useQuery({
    queryKey: [...queryKey, "bids", transporterId],
    queryFn: () => getBids(transporterId),
  });
}

export function useTransporterQualificationQuery(
  transporterId: number,
  enabled = true,
) {
  return useQuery({
    queryKey: [...queryKey, "qualification", transporterId],
    queryFn: () => checkTransporterQualification(transporterId),
    enabled: enabled && !!transporterId,
  });
}

export function useSubmitBidMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitBid,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKey, "bids", variables.transporterId],
      });
      queryClient.invalidateQueries({ queryKey: [...queryKey, "bids"] });
    },
  });
}
