import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransporter,
  deleteTransporter,
  getTransporterById,
  getTransporters,
  updateTransporter,
} from "./api";

const queryKey = ["@master/transporter-registration"];

export function useTransportersQuery(enabled = true) {
  return useQuery({ queryKey: queryKey, queryFn: getTransporters, enabled });
}

export function useTransporterQuery(transporterId: number, enabled = true) {
  return useQuery({
    queryKey: [...queryKey, transporterId],
    queryFn: () => getTransporterById(transporterId),
    enabled: enabled && !!transporterId,
  });
}

export function useCreateTransporterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransporter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}

export function useUpdateTransporterMutation(transporterId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Transportation.TransporterRegistration) =>
      updateTransporter(transporterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, transporterId] });
    },
  });
}

export function useDeleteTransporterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transporterId: number) => deleteTransporter(transporterId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}
