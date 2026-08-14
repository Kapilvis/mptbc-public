import { mockDemandApprovals } from "./data";

let memoryApprovals = [...mockDemandApprovals];

export async function getDemandApprovals(
  filters?: Distribution.DemandApprovalFilter,
): Promise<Distribution.DemandApprovalItem[]> {
  let list = [...memoryApprovals];

  if (!filters) return Promise.resolve(list);

  if (filters.agency && filters.agency !== "All") {
    list = list.filter((item) =>
      item.district.toLowerCase().includes(filters.agency!.toLowerCase()),
    );
  }

  if (filters.bookType && filters.bookType !== "All") {
    list = list.filter(
      (item) => item.bookType.toLowerCase() === filters.bookType!.toLowerCase(),
    );
  }

  if (filters.classGroup && filters.classGroup !== "All") {
    list = list.filter(
      (item) =>
        item.classGroup.toLowerCase() === filters.classGroup!.toLowerCase(),
    );
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.titleName.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.agencyName.toLowerCase().includes(q),
    );
  }

  return Promise.resolve(list);
}

export async function updateDemandApprovalStatus(
  id: number,
  status: Distribution.DemandStatus,
): Promise<Distribution.DemandApprovalItem | undefined> {
  const index = memoryApprovals.findIndex((item) => item.id === Number(id));
  if (index === -1) return Promise.resolve(undefined);

  memoryApprovals[index] = {
    ...memoryApprovals[index],
    status,
  };

  return Promise.resolve(memoryApprovals[index]);
}

export async function bulkUpdateDemandApprovalStatus(
  ids: number[],
  status: Distribution.DemandStatus,
): Promise<boolean> {
  memoryApprovals = memoryApprovals.map((item) => {
    if (ids.includes(item.id)) {
      return { ...item, status };
    }
    return item;
  });

  return Promise.resolve(true);
}
