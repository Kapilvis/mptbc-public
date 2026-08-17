import { mockGsmPaperDemandData } from "./data";

let memoryGsmDemands = [...mockGsmPaperDemandData];

export const getGsmPaperDemands = async (
  params?: Paper.GsmPaperDemandFilter,
): Promise<Paper.GsmPaperDemandItem[]> => {
  await new Promise((res) => setTimeout(res, 100));

  let data = [...memoryGsmDemands];

  if (params?.paperCategory && params.paperCategory !== "All") {
    data = data.filter((item) => item.paperCategory === params.paperCategory);
  }

  if (params?.status && params.status !== "All") {
    data = data.filter((item) => item.status === params.status);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    data = data.filter(
      (item) =>
        item.gsmCode.toLowerCase().includes(q) ||
        item.gsmName.toLowerCase().includes(q) ||
        item.usageType.toLowerCase().includes(q),
    );
  }

  return data;
};

export const lockGsmDemand = async (
  id: number,
  status: Paper.DemandLockStatus,
): Promise<void> => {
  await new Promise((res) => setTimeout(res, 100));
  const index = memoryGsmDemands.findIndex((item) => item.id === Number(id));
  if (index !== -1) {
    memoryGsmDemands[index] = {
      ...memoryGsmDemands[index],
      status,
      lockedBy:
        status === "Locked" ? "MPTBC Paper Procurement Officer" : undefined,
      lockedDate:
        status === "Locked"
          ? new Date().toISOString().split("T")[0]
          : undefined,
    };
  }
};

export const bulkLockGsmDemands = async (
  ids: number[],
  status: Paper.DemandLockStatus,
): Promise<void> => {
  await new Promise((res) => setTimeout(res, 150));
  memoryGsmDemands = memoryGsmDemands.map((item) => {
    if (ids.includes(item.id)) {
      return {
        ...item,
        status,
        lockedBy:
          status === "Locked"
            ? "MPTBC Paper Procurement Officer"
            : item.lockedBy,
        lockedDate:
          status === "Locked"
            ? new Date().toISOString().split("T")[0]
            : item.lockedDate,
      };
    }
    return item;
  });
};
