import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  getVehicles,
  updateVehicle,
} from "./api";

const queryKey = ["@master/vehicle-master"];

export function useVehiclesQuery(enabled = true) {
  return useQuery({ queryKey: queryKey, queryFn: getVehicles, enabled });
}

export function useVehicleQuery(vehicleId: number, enabled = true) {
  return useQuery({
    queryKey: [...queryKey, vehicleId],
    queryFn: () => getVehicleById(vehicleId),
    enabled: enabled && !!vehicleId,
  });
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}

export function useUpdateVehicleMutation(vehicleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Transportation.Vehicle) =>
      updateVehicle(vehicleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, vehicleId] });
    },
  });
}

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehicleId: number) => deleteVehicle(vehicleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}
