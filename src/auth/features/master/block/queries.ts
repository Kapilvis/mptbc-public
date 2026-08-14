import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlock,
  getActiveBlocks,
  getActiveBlocksByDistrict,
  getBlockById,
  getBlocks,
  patchBlockStatus,
  updateBlock,
} from "./api";

const BLOCK_QUERY_KEY = ["blocks"];

export function useBlocksQuery() {
  return useQuery({
    queryKey: BLOCK_QUERY_KEY,
    queryFn: getBlocks,
  });
}

export function useActiveBlocksQuery() {
  return useQuery({
    queryKey: [...BLOCK_QUERY_KEY, "active"],
    queryFn: getActiveBlocks,
  });
}

export function useActiveBlocksByDistrictQuery(districtId: number) {
  return useQuery({
    queryKey: [...BLOCK_QUERY_KEY, "activeByDistrict", districtId],
    queryFn: () => getActiveBlocksByDistrict(districtId),
    enabled: Boolean(districtId),
  });
}

export function useBlockQuery(id: number) {
  return useQuery({
    queryKey: [...BLOCK_QUERY_KEY, id],
    queryFn: () => getBlockById(id),
    enabled: Boolean(id),
  });
}

export function useCreateBlockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: Master.BlockForm) => createBlock(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOCK_QUERY_KEY });
    },
  });
}

export function useUpdateBlockMutation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: Master.BlockForm) => updateBlock(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOCK_QUERY_KEY });
    },
  });
}

export function useBlockActiveStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      blockId,
      isActive,
    }: {
      blockId: number;
      isActive: boolean;
    }) => patchBlockStatus(blockId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOCK_QUERY_KEY });
    },
  });
}
