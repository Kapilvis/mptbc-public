import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDistrict,
  getDistrictById,
  getDistricts,
  getDistrictsByDivisionId,
  patchDistrictStatus,
  updateDistrict,
} from "./api";

const queryKey = ["@master/district"];

export function useDistrictsQuery(enabled = true) {
  return useQuery({ queryKey: queryKey, queryFn: getDistricts, enabled });
}

export function useDistrictQuery(districtId: number, enabled = true) {
  return useQuery({
    queryKey: [...queryKey, districtId],
    queryFn: () => getDistrictById(districtId),
    enabled: enabled && !!districtId,
  });
}

export function useCreateDistrictMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDistrict,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}

export function useUpdateDistrictMutation(districtId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.DistrictForm) => updateDistrict(districtId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, districtId] });
    },
  });
}

export function useActiveDistrictsByDivisionQuery(divisionId: number) {
  return useQuery({
    queryKey: [...queryKey, "division", divisionId],
    queryFn: () => getDistrictsByDivisionId(divisionId!),
    select: (data) => data.filter((item) => item.isActive),
    enabled: !!divisionId,
  });
}

export function useDistrictActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { districtId: number; isActive: boolean }) =>
      await patchDistrictStatus(data.districtId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DistrictItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.districtId === variables.districtId,
      );
      if (index === -1) return;

      const updatedItem = {
        ...result[index],
        isActive: variables.isActive,
      };

      queryClient.setQueryData(queryKey, [
        ...result.slice(0, index),
        updatedItem,
        ...result.slice(index + 1),
      ]);
    },
  });
}
