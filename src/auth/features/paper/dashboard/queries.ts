import { useQuery } from "@tanstack/react-query";
import {
  getGsmSupplyData,
  getPaperDashboardMetrics,
  getSupplyPipelineStages,
  getVendorPerformanceMatrix,
} from "./api";

const QUERY_KEY = ["paper-dashboard"];

export function usePaperDashboardMetricsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, "metrics"],
    queryFn: getPaperDashboardMetrics,
  });
}

export function useSupplyPipelineStagesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, "pipeline"],
    queryFn: getSupplyPipelineStages,
  });
}

export function useVendorPerformanceMatrixQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, "vendor-matrix"],
    queryFn: getVendorPerformanceMatrix,
  });
}

export function useGsmSupplyDataQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, "gsm-supply"],
    queryFn: getGsmSupplyData,
  });
}
