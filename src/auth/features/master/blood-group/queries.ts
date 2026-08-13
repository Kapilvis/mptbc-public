import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBloodGroupById,
  getBloodGroups,
  patchBloodGroupStatus,
} from "./api";

const queryKey = ["@master/blood-group"];

export function useActiveBloodGroupsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getBloodGroups,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useBloodGroupsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getBloodGroups,
    enabled,
  });
}

export function useBloodGroupQuery(
  bloodGroupId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, bloodGroupId],
    queryFn: () => getBloodGroupById(bloodGroupId),
    enabled: enabled && !!bloodGroupId,
  });
}

export function useBloodGroupActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bloodGroupId: number; isActive: boolean }) =>
      await patchBloodGroupStatus(data.bloodGroupId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.BloodGroupItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.bloodGroupId === variables.bloodGroupId,
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
