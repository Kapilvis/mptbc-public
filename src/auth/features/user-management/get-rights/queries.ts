import { useQuery } from "@tanstack/react-query";
import { getRightDetails } from "./api";

const key = ["@user-management/rights"];

export function useRightsQuery() {
  return useQuery({
    queryKey: key,
    queryFn: getRightDetails,
  });
}
