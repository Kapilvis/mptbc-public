import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDivision,
  getDivisionById,
  getDivisions,
  patchDivisionStatus,
  updateDivision,
} from "./api";

const QUERY_KEY = ["@master/division"];

export function useDivisionsQuery(enabled = true) {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getDivisions, enabled });
}

export function useActiveDivisionsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getDivisions,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useDivisionQuery(divisionId: number, enabled = true) {
  return useQuery({
    queryKey: [...QUERY_KEY, divisionId],
    queryFn: () => getDivisionById(divisionId),
    enabled: enabled && !!divisionId,
  });
}

export function useCreateDivisionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDivision,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateDivisionMutation(divisionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.DivisionForm) => updateDivision(divisionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, divisionId] });
    },
  });
}

export function useDivisionActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { divisionId: number; isActive: boolean }) =>
      await patchDivisionStatus(data.divisionId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.DivisionItem[]>(QUERY_KEY) ?? [];

      const index = result.findIndex(
        (item) => item.divisionId === variables.divisionId,
      );
      if (index === -1) return;

      const updatedItem = {
        ...result[index],
        isActive: variables.isActive,
      };

      queryClient.setQueryData(QUERY_KEY, [
        ...result.slice(0, index),
        updatedItem,
        ...result.slice(index + 1),
      ]);
    },
  });
}
