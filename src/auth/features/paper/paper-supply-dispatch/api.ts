import { MOCK_PAPER_DISPATCHES } from "./data";

let paperDispatchesState: PaperSupplyDispatch.PaperDispatchItem[] = [
  ...MOCK_PAPER_DISPATCHES,
];

function formatDate(val: unknown): string {
  if (!val) return "";
  if (val instanceof Date) {
    return val.toISOString().split("T")[0];
  }
  return String(val);
}

export async function getPaperDispatches(
  filter?: PaperSupplyDispatch.Filter,
): Promise<PaperSupplyDispatch.PaperDispatchItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  let list = [...paperDispatchesState];

  if (filter?.orderNo) {
    list = list.filter((d) => d.orderNo === filter.orderNo);
  }
  if (filter?.consigneeName) {
    list = list.filter((d) =>
      d.consigneeName
        .toLowerCase()
        .includes(filter.consigneeName!.toLowerCase()),
    );
  }
  if (filter?.status) {
    list = list.filter((d) => d.status === filter.status);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (d) =>
        d.challanNo.toLowerCase().includes(q) ||
        d.orderNo.toLowerCase().includes(q) ||
        d.paperMillName.toLowerCase().includes(q) ||
        d.paperType.toLowerCase().includes(q) ||
        d.truckNo.toLowerCase().includes(q) ||
        d.consigneeName.toLowerCase().includes(q),
    );
  }

  return list;
}

export async function getPaperDispatchById(
  id: number,
): Promise<PaperSupplyDispatch.PaperDispatchItem | undefined> {
  await new Promise((res) => setTimeout(res, 150));
  return paperDispatchesState.find((d) => d.dispatchId === id);
}

export async function createPaperDispatch(
  form: PaperSupplyDispatch.PaperDispatchForm,
): Promise<PaperSupplyDispatch.PaperDispatchItem> {
  await new Promise((res) => setTimeout(res, 300));
  const newId =
    Math.max(0, ...paperDispatchesState.map((d) => d.dispatchId)) + 1;
  const seqStr = String(newId).padStart(4, "0");

  const newDispatch: PaperSupplyDispatch.PaperDispatchItem = {
    dispatchId: newId,
    challanNo: form.challanNo || `CHL/2026/${seqStr}`,
    challanDate:
      formatDate(form.challanDate) || new Date().toISOString().split("T")[0],
    orderNo: form.orderNo || "WO/TBC/2026-27/0358",
    orderDate: formatDate(form.orderDate) || "2026-04-04",
    dispatchDate:
      formatDate(form.dispatchDate) || new Date().toISOString().split("T")[0],
    vendorId: Number(form.vendorId || 1),
    paperMillName: form.paperMillName || "A.B. Paper Mills",
    paperType: form.paperType || "170 GSM Art Card Sheet Paper",
    consigneeName: form.consigneeName || "Central Paper Depot, Bhopal",
    godownName: form.godownName || "Godown 1 - Central Paper Depot",
    reelCount: Number(form.reelCount || 0),
    totalWeightTon: Number(form.totalWeightTon || 0),
    truckNo: form.truckNo || "",
    driverName: form.driverName || "",
    driverMobile: form.driverMobile || "",
    grNo: form.grNo || "",
    grDate: formatDate(form.grDate) || formatDate(form.dispatchDate),
    remarks: form.remarks || "",
    challanCopyPath:
      form.challanCopyPath ||
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    isActive: true,
    status: "Approved",
    createdDate: new Date().toISOString().split("T")[0],
  };

  paperDispatchesState = [newDispatch, ...paperDispatchesState];
  return newDispatch;
}

export async function updatePaperDispatch(
  id: number,
  form: PaperSupplyDispatch.PaperDispatchForm,
): Promise<PaperSupplyDispatch.PaperDispatchItem> {
  await new Promise((res) => setTimeout(res, 300));
  const idx = paperDispatchesState.findIndex((d) => d.dispatchId === id);
  if (idx === -1) throw new Error("Paper Dispatch not found");

  const updated: PaperSupplyDispatch.PaperDispatchItem = {
    ...paperDispatchesState[idx],
    challanNo: form.challanNo || paperDispatchesState[idx].challanNo,
    challanDate:
      formatDate(form.challanDate) || paperDispatchesState[idx].challanDate,
    orderNo: form.orderNo || paperDispatchesState[idx].orderNo,
    orderDate:
      formatDate(form.orderDate) || paperDispatchesState[idx].orderDate,
    dispatchDate:
      formatDate(form.dispatchDate) || paperDispatchesState[idx].dispatchDate,
    vendorId: Number(form.vendorId || paperDispatchesState[idx].vendorId),
    paperMillName:
      form.paperMillName || paperDispatchesState[idx].paperMillName,
    paperType: form.paperType || paperDispatchesState[idx].paperType,
    consigneeName:
      form.consigneeName || paperDispatchesState[idx].consigneeName,
    godownName: form.godownName || paperDispatchesState[idx].godownName,
    reelCount: Number(form.reelCount || paperDispatchesState[idx].reelCount),
    totalWeightTon: Number(
      form.totalWeightTon || paperDispatchesState[idx].totalWeightTon,
    ),
    truckNo: form.truckNo || paperDispatchesState[idx].truckNo,
    driverName: form.driverName || paperDispatchesState[idx].driverName,
    driverMobile: form.driverMobile || paperDispatchesState[idx].driverMobile,
    grNo: form.grNo || paperDispatchesState[idx].grNo,
    grDate: formatDate(form.grDate) || paperDispatchesState[idx].grDate,
    remarks: form.remarks || paperDispatchesState[idx].remarks,
    challanCopyPath:
      form.challanCopyPath || paperDispatchesState[idx].challanCopyPath,
  };

  paperDispatchesState[idx] = updated;
  return updated;
}

export async function togglePaperDispatchStatus(
  id: number,
  isActive: boolean,
): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 150));
  const item = paperDispatchesState.find((d) => d.dispatchId === id);
  if (item) {
    item.isActive = isActive;
    item.status = isActive ? "Approved" : "Pending";
    return true;
  }
  return false;
}

export async function deletePaperDispatch(id: number): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 200));
  paperDispatchesState = paperDispatchesState.filter(
    (d) => d.dispatchId !== id,
  );
  return true;
}
