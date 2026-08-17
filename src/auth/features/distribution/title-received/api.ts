import { mockTitleReceivedData } from "./data";

let memoryTitleReceived = [...mockTitleReceivedData];

export const getTitleReceivedList = async (
  params?: Distribution.TitleReceivedFilter,
): Promise<Distribution.TitleReceivedItem[]> => {
  await new Promise((res) => setTimeout(res, 100));

  let data = [...memoryTitleReceived];

  if (params?.department && params.department !== "All") {
    data = data.filter((item) => item.department === params.department);
  }

  if (params?.receiptStatus && params.receiptStatus !== "All") {
    data = data.filter((item) => item.receiptStatus === params.receiptStatus);
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

export const updateTitleReceivedStatus = async (
  id: number,
  status: Distribution.ReceiptStatus,
  remarks?: string,
): Promise<void> => {
  await new Promise((res) => setTimeout(res, 100));
  const index = memoryTitleReceived.findIndex((item) => item.id === Number(id));
  if (index !== -1) {
    memoryTitleReceived[index] = {
      ...memoryTitleReceived[index],
      receiptStatus: status,
      receivedBy: status === "Received" ? "MPTBC Receiving Officer" : undefined,
      receiptDate:
        status === "Received"
          ? new Date().toISOString().split("T")[0]
          : undefined,
      remarks: remarks || memoryTitleReceived[index].remarks,
    };
  }
};

export const bulkUpdateTitleReceivedStatus = async (
  ids: number[],
  status: Distribution.ReceiptStatus,
): Promise<void> => {
  await new Promise((res) => setTimeout(res, 150));
  memoryTitleReceived = memoryTitleReceived.map((item) => {
    if (ids.includes(item.id)) {
      return {
        ...item,
        receiptStatus: status,
        receivedBy:
          status === "Received" ? "MPTBC Receiving Officer" : item.receivedBy,
        receiptDate:
          status === "Received"
            ? new Date().toISOString().split("T")[0]
            : item.receiptDate,
      };
    }
    return item;
  });
};
