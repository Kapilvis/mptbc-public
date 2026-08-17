import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWorkOrders,
  createWorkOrder,
  importAppendixData,
  addDispatchToWorkOrder,
  submitPodForDispatch,
  claimRunningBillAdvance,
  approvePaymentClaim,
  claimFinalSettlement,
  resetAllBillingStatuses,
} from "./api";
import { getTransporters } from "../../master/transporter-registration/api";

const queryKey = ["@transport/work-orders"];

export function useWorkOrdersQuery() {
  return useQuery({
    queryKey: queryKey,
    queryFn: getWorkOrders,
  });
}

export function useCreateWorkOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useImportAppendixMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importAppendixData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

const transportersKey = ["@master/transporter-registration"];

export function useTransportersL1Query() {
  return useQuery({
    queryKey: transportersKey,
    queryFn: getTransporters,
  });
}

export function useAddDispatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workOrderId,
      dispatchData,
    }: {
      workOrderId: string;
      dispatchData: Omit<
        Transportation.Dispatch,
        "dispatchId" | "status" | "podUploaded"
      >;
    }) => addDispatchToWorkOrder(workOrderId, dispatchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useSubmitPodMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workOrderId,
      dispatchId,
      actualDeliveryDate,
      podFilePath,
    }: {
      workOrderId: string;
      dispatchId: string;
      actualDeliveryDate: string;
      podFilePath: string;
    }) =>
      submitPodForDispatch(
        workOrderId,
        dispatchId,
        actualDeliveryDate,
        podFilePath,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useClaimAdvanceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (claims: { workOrderId: string; dispatchId: string }[]) =>
      claimRunningBillAdvance(claims),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useClaimFinalSettlementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (claims: { workOrderId: string; dispatchId: string }[]) =>
      claimFinalSettlement(claims),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useApprovePaymentClaimMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      claims,
      action,
    }: {
      claims: { workOrderId: string; dispatchId: string }[];
      action: "ApproveAdvance" | "ApproveFinal";
    }) => approvePaymentClaim(claims, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useResetBillingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetAllBillingStatuses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}
