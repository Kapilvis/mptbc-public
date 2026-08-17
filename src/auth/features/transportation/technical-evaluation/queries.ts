import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTransportersForEvaluation,
  getVehiclesForEvaluation,
  evaluateTransporter,
} from "./api";

const transportersQueryKey = ["@master/transporter-registration"];
const vehiclesQueryKey = ["@master/vehicle-master"];

export function useTransportersEvaluationQuery(enabled = true) {
  return useQuery({
    queryKey: transportersQueryKey,
    queryFn: getTransportersForEvaluation,
    enabled,
  });
}

export function useVehiclesEvaluationQuery(enabled = true) {
  return useQuery({
    queryKey: vehiclesQueryKey,
    queryFn: getVehiclesForEvaluation,
    enabled,
  });
}

export function useEvaluateTransporterMutation(transporterId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "Qualified" | "NotQualified") =>
      evaluateTransporter(transporterId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportersQueryKey });
      queryClient.invalidateQueries({
        queryKey: [...transportersQueryKey, transporterId],
      });
      // Invalidate qualification query if any
      queryClient.invalidateQueries({
        queryKey: ["@transport/qualification", transporterId],
      });
    },
  });
}
