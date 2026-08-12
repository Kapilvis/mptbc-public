import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOfficeLevel,
  getOfficeLevelById,
  getOfficeLevels,
  patchOfficeLevelStatus,
  updateOfficeLevel,
} from "./api";

const queryKey = ["@master/office-level"];

export function useOfficeLevelsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getOfficeLevels,
    enabled,
  });
}

export function useActiveOfficeLevelsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getOfficeLevels,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useOfficeLevelQuery(
  officeLevelId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, officeLevelId],
    queryFn: () => getOfficeLevelById(officeLevelId),
    enabled: enabled && !!officeLevelId,
  });
}

export function useCreateOfficeLevelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.OfficeLevelForm) => createOfficeLevel(data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateOfficeLevelMutation(officeLevelId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.OfficeLevelForm) =>
      updateOfficeLevel(officeLevelId, data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, officeLevelId] });
    },
  });
}
export function useOfficeLevelActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { officeLevelId: number; isActive: boolean }) =>
      await patchOfficeLevelStatus(data.officeLevelId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.OfficeLevelList[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.officeLevelId === variables.officeLevelId,
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
