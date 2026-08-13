import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReligion,
  getReligionById,
  getReligions,
  patchReligionStatus,
  updateReligion,
} from "./api";

const queryKey = ["@master/religion"];

export function useActiveReligionsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getReligions,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useReligionsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getReligions,
    enabled,
  });
}

export function useReligionQuery(religionId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, religionId],
    queryFn: () => getReligionById(religionId),
    enabled: enabled && !!religionId,
  });
}

export function useCreateReligionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.ReligionForm) => createReligion(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateReligionMutation(religionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.ReligionForm) => updateReligion(religionId, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, religionId] });
    },
  });
}

export function useReligionActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { religionId: number; isActive: boolean }) =>
      await patchReligionStatus(data.religionId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.ReligionItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.religionId === variables.religionId,
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
