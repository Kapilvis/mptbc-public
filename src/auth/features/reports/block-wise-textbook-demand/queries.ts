import { useQuery } from "@tanstack/react-query";
import { fetchBlockWiseDemandReport } from "./api";
import type { DemandReportFilter } from "./data";

export const blockWiseDemandKeys = {
  all: ["blockWiseTextbookDemand"] as const,
  list: (filter: DemandReportFilter) =>
    [...blockWiseDemandKeys.all, filter] as const,
};

export function useBlockWiseDemandQuery(filter: DemandReportFilter) {
  return useQuery({
    queryKey: blockWiseDemandKeys.list(filter),
    queryFn: () => fetchBlockWiseDemandReport(filter),
    staleTime: 5 * 60 * 1000,
  });
}
