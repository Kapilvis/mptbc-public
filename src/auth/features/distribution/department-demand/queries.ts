import { useQuery } from "@tanstack/react-query";
import { getDepartmentDemands } from "./api";

export function useDepartmentDemandsQuery(
  filters?: Distribution.DepartmentDemandFilter,
) {
  return useQuery({
    queryKey: ["departmentDemands", filters],
    queryFn: () => getDepartmentDemands(filters),
  });
}
