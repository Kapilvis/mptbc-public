import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics, getDistrictMatrixData } from "./api";

export function useDashboardMetricsQuery() {
  return useQuery({
    queryKey: ["distributionDashboardMetrics"],
    queryFn: getDashboardMetrics,
  });
}

export function useDistrictMatrixQuery() {
  return useQuery({
    queryKey: ["districtMatrixData"],
    queryFn: getDistrictMatrixData,
  });
}
