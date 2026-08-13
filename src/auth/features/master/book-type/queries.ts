import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBookType,
  getBookTypeById,
  getBookTypes,
  patchBookTypeStatus,
  updateBookType,
} from "./api";

const queryKey = ["@master/book-type"];

export function useActiveBookTypesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getBookTypes,
    select: (data) => data.filter((item) => item.isActive),
    enabled,
  });
}

export function useBookTypesQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey,
    queryFn: getBookTypes,
    enabled,
  });
}

export function useBookTypeQuery(bookTypeId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: [...queryKey, bookTypeId],
    queryFn: () => getBookTypeById(bookTypeId),
    enabled: enabled && !!bookTypeId,
  });
}

export function useCreateBookTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.BookTypeForm) => createBookType(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateBookTypeMutation(bookTypeId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.BookTypeForm) => updateBookType(bookTypeId, data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, bookTypeId] });
    },
  });
}

export function useBookTypeActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bookTypeId: number; isActive: boolean }) =>
      await patchBookTypeStatus(data.bookTypeId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.BookTypeItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.bookTypeId === variables.bookTypeId,
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
