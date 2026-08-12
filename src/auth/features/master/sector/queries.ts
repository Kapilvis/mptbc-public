import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSector,
  getSectorById,
  getSectors,
  getSectorsByProjectId,
  patchSectorStatus,
  updateSector,
} from "./api";

const queryKey = ["@master/sector"];

export function useSectorsQuery(enabled = true) {
  return useQuery({ queryKey: queryKey, queryFn: getSectors, enabled });
}

export function useSectorQuery(sectorId: number, enabled = true) {
  return useQuery({
    queryKey: [...queryKey, sectorId],
    queryFn: () => getSectorById(sectorId),
    enabled: enabled && !!sectorId,
  });
}

export function useCreateSectorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSector,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });
}

export function useUpdateSectorMutation(sectorId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Master.SectorForm) => updateSector(sectorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, sectorId] });
    },
  });
}

export function useActiveSectorsByProjectQuery(projectId: number | undefined) {
  return useQuery({
    queryKey: [...queryKey, "project", projectId],
    select: (data) => data.filter((item) => item.isActive),
    queryFn: () => getSectorsByProjectId(projectId!),
    enabled: !!projectId,
  });
}

export function useSectorActiveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sectorId: number; isActive: boolean }) =>
      await patchSectorStatus(data.sectorId),

    onSuccess(success, variables) {
      if (!success) return;

      const result =
        queryClient.getQueryData<Master.SectorItem[]>(queryKey) ?? [];

      const index = result.findIndex(
        (item) => item.sectorId === variables.sectorId,
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
