import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createState,
  getStateById,
  getStates,
  patchStateStatus,
  updateState,
} from "./api";

const queryKey = ["@master/state"];

export function useStatesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getStates,
    enabled,
  });
}

export function useActiveStatesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getStates,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useStateQuery(stateId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, stateId],
    queryFn: () => getStateById(stateId),
    enabled: enabled && !!stateId,
  });
}

export function useCreateStateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.StateForm) => createState(data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateStateMutation(stateId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.StateForm) => updateState(stateId, data),
    onSuccess(data) {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, stateId] });
    },
  });
}

export function useStateActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { stateId: number; isActive: boolean }) =>
      await patchStateStatus(data.stateId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.StateItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.stateId === variables.stateId,
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
