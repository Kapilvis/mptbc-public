import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGsm,
  getGsmById,
  getGsms,
  patchGsmStatus,
  updateGsm,
} from "./api";

const queryKey = ["@master/gsm"];

export function useActiveGsmsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getGsms,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useGsmsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getGsms,
    enabled,
  });
}

export function useGsmQuery(gsmId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, gsmId],
    queryFn: () => getGsmById(gsmId),
    enabled: enabled && !!gsmId,
  });
}

export function useCreateGsmMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.GsmForm) => createGsm(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateGsmMutation(gsmId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.GsmForm) => updateGsm(gsmId, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, gsmId] });
    },
  });
}

export function useGsmActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { gsmId: number; isActive: boolean }) =>
      await patchGsmStatus(data.gsmId),

    onSuccess(success, variables) {
      if (!success) return;

      const result = queryClient.getQueryData<Master.GsmItem[]>(queryKey) ?? [];

      const index = result.findIndex((item) => item.gsmId === variables.gsmId);
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
