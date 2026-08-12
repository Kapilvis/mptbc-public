import { useQuery } from "@tanstack/react-query";
import { getDomainDetails } from "./api";

const key = ["@user-management/domains"];

export function useDomainsQuery() {
  return useQuery({
    queryKey: key,
    queryFn: getDomainDetails,
  });
}
