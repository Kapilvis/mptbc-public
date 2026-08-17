import { useQuery } from "@tanstack/react-query";
import { getAgencyDemandReport } from "./api";

export const useAgencyDemandReportQuery = (
  filter: Reports.AgencyDemandReportFilter,
) => {
  return useQuery({
    queryKey: ["agency-demand-report", filter],
    queryFn: () => getAgencyDemandReport(filter),
  });
};
