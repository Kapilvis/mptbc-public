import { mockDepartmentDemands } from "../data/demandData";

export async function getDepartmentDemands(
  filters?: Distribution.DepartmentDemandFilter,
): Promise<Distribution.DepartmentDemandItem[]> {
  let list = [...mockDepartmentDemands];

  if (!filters) return Promise.resolve(list);

  if (filters.department && filters.department !== "All") {
    list = list.filter((item) =>
      item.agency.toLowerCase().includes(filters.department!.toLowerCase()),
    );
  }

  if (filters.district && filters.district !== "All") {
    list = list.filter(
      (item) => item.district.toLowerCase() === filters.district!.toLowerCase(),
    );
  }

  if (filters.medium && filters.medium !== "All") {
    list = list.filter(
      (item) => item.medium.toLowerCase() === filters.medium!.toLowerCase(),
    );
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.titleName.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.block.toLowerCase().includes(q) ||
        item.agency.toLowerCase().includes(q),
    );
  }

  return Promise.resolve(list);
}
