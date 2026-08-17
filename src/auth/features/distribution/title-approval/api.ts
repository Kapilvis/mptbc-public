import { mockTitleApprovals } from "./data";

let memoryTitleApprovals = [...mockTitleApprovals];

export const getTitleApprovals = async (
  params?: Distribution.TitleApprovalFilter,
): Promise<Distribution.TitleApprovalItem[]> => {
  await new Promise((res) => setTimeout(res, 100));

  let data = [...memoryTitleApprovals];

  if (params?.department && params.department !== "All") {
    data = data.filter((item) => item.department === params.department);
  }

  if (params?.status && params.status !== "All") {
    data = data.filter((item) => item.status === params.status);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    data = data.filter(
      (item) =>
        item.titleCode.toLowerCase().includes(q) ||
        item.titleName.toLowerCase().includes(q) ||
        (item.localTitleName && item.localTitleName.toLowerCase().includes(q)),
    );
  }

  return data;
};

export const updateTitleApprovalStatus = async (
  id: number,
  status: "Approved" | "Rejected" | "Hold" | "Pending",
): Promise<void> => {
  await new Promise((res) => setTimeout(res, 100));
  const index = memoryTitleApprovals.findIndex(
    (item) => item.id === Number(id),
  );
  if (index !== -1) {
    memoryTitleApprovals[index] = {
      ...memoryTitleApprovals[index],
      status,
      approvedBy: status === "Approved" ? "MPTBC Technical Officer" : undefined,
      approvalDate:
        status === "Approved"
          ? new Date().toISOString().split("T")[0]
          : undefined,
    };
  }
};

export const bulkUpdateTitleApprovalStatus = async (
  ids: number[],
  status: "Approved" | "Rejected" | "Hold" | "Pending",
): Promise<void> => {
  await new Promise((res) => setTimeout(res, 150));
  memoryTitleApprovals = memoryTitleApprovals.map((item) => {
    if (ids.includes(item.id)) {
      return {
        ...item,
        status,
        approvedBy:
          status === "Approved" ? "MPTBC Technical Officer" : item.approvedBy,
        approvalDate:
          status === "Approved"
            ? new Date().toISOString().split("T")[0]
            : item.approvalDate,
      };
    }
    return item;
  });
};
