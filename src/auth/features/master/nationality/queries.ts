import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNationality,
  getNationalities,
  getNationalityById,
  patchNationalityStatus,
  updateNationality,
} from "./api";

const queryKey = ["@master/nationality"];

export function useActiveNationalitiesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getNationalities,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useNationalitiesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getNationalities,
    enabled,
  });
}

export function useNationalityQuery(
  nationalityId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: [...queryKey, nationalityId],
    queryFn: () => getNationalityById(nationalityId),
    enabled: enabled && !!nationalityId,
  });
}

export function useCreateNationalityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.NationalityForm) => createNationality(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateNationalityMutation(nationalityId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.NationalityForm) =>
      updateNationality(nationalityId, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, nationalityId] });
    },
  });
}

export function useNationalityActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { nationalityId: number; isActive: boolean }) =>
      await patchNationalityStatus(data.nationalityId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.NationalityItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.nationalityId === variables.nationalityId,
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
