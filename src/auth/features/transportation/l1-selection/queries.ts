import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTendersForL1,
  getBidsForL1,
  getTransportersForL1,
  getVehiclesForL1,
  authorizePrimeBidder,
} from "./api";

const tendersKey = ["@transport/tenders"];
const bidsKey = ["@transport/bids"];
const transportersKey = ["@master/transporter-registration"];
const vehiclesKey = ["@master/vehicle-master"];

export function useTendersL1Query() {
  return useQuery({
    queryKey: tendersKey,
    queryFn: getTendersForL1,
  });
}

export function useBidsL1Query() {
  return useQuery({
    queryKey: bidsKey,
    queryFn: getBidsForL1,
  });
}

export function useTransportersL1Query() {
  return useQuery({
    queryKey: transportersKey,
    queryFn: getTransportersForL1,
  });
}

export function useVehiclesL1Query() {
  return useQuery({
    queryKey: vehiclesKey,
    queryFn: getVehiclesForL1,
  });
}

export function useAuthorizePrimeBidderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenderId,
      transporterId,
    }: {
      tenderId: string;
      transporterId: number;
    }) => authorizePrimeBidder(tenderId, transporterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tendersKey });
    },
  });
}
