import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaperVendor,
  deletePaperVendor,
  getPaperVendorById,
  getPaperVendors,
  togglePaperVendorStatus,
  updatePaperVendor,
} from "./api";

const QUERY_KEY = ["paper-vendors"];

export function usePaperVendorsQuery(filter?: PaperVendor.Filter) {
  return useQuery({
    queryKey: [...QUERY_KEY, filter],
    queryFn: () => getPaperVendors(filter),
  });
}

export function usePaperVendorByIdQuery(id?: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, "detail", id],
    queryFn: () => (id ? getPaperVendorById(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
}

export function useCreatePaperVendorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: PaperVendor.VendorForm) => createPaperVendor(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdatePaperVendorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: PaperVendor.VendorForm }) =>
      updatePaperVendor(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function usePaperVendorActiveStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vendorId,
      isActive,
    }: {
      vendorId: number;
      isActive: boolean;
    }) => togglePaperVendorStatus(vendorId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeletePaperVendorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePaperVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
