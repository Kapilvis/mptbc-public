import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCaste,
  getCasteById,
  getCastes,
  patchCasteStatus,
  updateCaste,
} from "./api";

const queryKey = ["@master/caste"];

export function useActiveCastesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getCastes,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useCastesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getCastes,
    enabled,
  });
}

export function useCasteQuery(casteId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, casteId],
    queryFn: () => getCasteById(casteId),
    enabled: enabled && !!casteId,
  });
}

export function useCreateCasteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.CasteForm) => createCaste(data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateCasteMutation(casteId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.CasteForm) => updateCaste(casteId, data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, casteId] });
    },
  });
}

export function useCasteActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { casteId: number; isActive: boolean }) =>
      await patchCasteStatus(data.casteId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.CasteList[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.casteId === variables.casteId,
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
