import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createClass,
  getClassById,
  getClasses,
  patchClassStatus,
  updateClass,
} from "./api";

const queryKey = ["@master/class"];

export function useActiveClassesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getClasses,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useClassesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getClasses,
    enabled,
  });
}

export function useClassQuery(classId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, classId],
    queryFn: () => getClassById(classId),
    enabled: enabled && !!classId,
  });
}

export function useCreateClassMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.ClassForm) => createClass(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateClassMutation(classId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.ClassForm) => updateClass(classId, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, classId] });
    },
  });
}

export function useClassActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { classId: number; isActive: boolean }) =>
      await patchClassStatus(data.classId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.ClassItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.classId === variables.classId,
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
