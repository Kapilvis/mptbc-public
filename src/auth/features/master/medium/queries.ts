import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMedium,
  getMediumById,
  getMediums,
  patchMediumStatus,
  updateMedium,
} from "./api";

const queryKey = ["@master/medium"];

export function useActiveMediumsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getMediums,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useMediumsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getMediums,
    enabled,
  });
}

export function useMediumQuery(mediumId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, mediumId],
    queryFn: () => getMediumById(mediumId),
    enabled: enabled && !!mediumId,
  });
}

export function useCreateMediumMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.MediumForm) => createMedium(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateMediumMutation(mediumId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.MediumForm) => updateMedium(mediumId, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, mediumId] });
    },
  });
}

export function useMediumActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { mediumId: number; isActive: boolean }) =>
      await patchMediumStatus(data.mediumId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.MediumItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.mediumId === variables.mediumId,
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
