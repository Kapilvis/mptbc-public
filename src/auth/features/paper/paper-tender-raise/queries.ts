import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPaperTenderDetails,
  publishPaperTender,
  savePaperTenderDraft,
} from "./api";

export const usePaperTenderQuery = () => {
  return useQuery({
    queryKey: ["paper-tender-details"],
    queryFn: getPaperTenderDetails,
  });
};

export const useSavePaperTenderDraftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PaperTender.Item>) =>
      savePaperTenderDraft(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paper-tender-details"] });
    },
  });
};

export const usePublishPaperTenderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PaperTender.Item>) =>
      publishPaperTender(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paper-tender-details"] });
    },
  });
};
