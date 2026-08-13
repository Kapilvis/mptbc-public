import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTitle,
  getTitleById,
  getTitles,
  patchTitleStatus,
  updateTitle,
} from "./api";

const queryKey = ["@master/title"];

export function useActiveTitlesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getTitles,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useTitlesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getTitles,
    enabled,
  });
}

export function useTitleQuery(titleId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, titleId],
    queryFn: () => getTitleById(titleId),
    enabled: enabled && !!titleId,
  });
}

export function useCreateTitleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.TitleForm) => createTitle(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateTitleMutation(titleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.TitleForm) => updateTitle(titleId, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, titleId] });
    },
  });
}

export function useTitleActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { titleId: number; isActive: boolean }) =>
      await patchTitleStatus(data.titleId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.TitleItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.titleId === variables.titleId,
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
