import { MOCK_PAPER_ORDERS } from "./data";

let paperOrdersState: PaperOrder.PaperSupplyOrderItem[] = [
  ...MOCK_PAPER_ORDERS,
];

function formatDate(val: unknown): string {
  if (!val) return "";
  if (val instanceof Date) {
    return val.toISOString().split("T")[0];
  }
  return String(val);
}

export async function getPaperOrders(
  filter?: PaperOrder.Filter,
): Promise<PaperOrder.PaperSupplyOrderItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  let list = [...paperOrdersState];

  if (filter?.vendorId) {
    list = list.filter((o) => o.vendorId === Number(filter.vendorId));
  }
  if (filter?.status) {
    list = list.filter((o) => o.status === filter.status);
  }
  if (filter?.paperType) {
    list = list.filter((o) =>
      o.paperType.toLowerCase().includes(filter.paperType!.toLowerCase()),
    );
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (o) =>
        o.orderNo.toLowerCase().includes(q) ||
        o.paperMillName.toLowerCase().includes(q) ||
        o.vendorName.toLowerCase().includes(q) ||
        o.paperType.toLowerCase().includes(q),
    );
  }

  return list;
}

export async function getPaperOrderById(
  id: number,
): Promise<PaperOrder.PaperSupplyOrderItem | undefined> {
  await new Promise((res) => setTimeout(res, 150));
  return paperOrdersState.find((o) => o.orderId === id);
}

export async function createPaperOrder(
  form: PaperOrder.PaperSupplyOrderForm,
): Promise<PaperOrder.PaperSupplyOrderItem> {
  await new Promise((res) => setTimeout(res, 300));
  const newId = Math.max(0, ...paperOrdersState.map((o) => o.orderId)) + 1;
  const orderedQtyMT = Number(form.orderedQtyMT || 0);
  const ratePerMT = Number(form.ratePerMT || 0);
  const basicAmount = orderedQtyMT * ratePerMT;
  const gstPercent = Number(form.gstPercent || 18);
  const totalAmount = basicAmount * (1 + gstPercent / 100);

  const seqStr = String(newId).padStart(4, "0");
  const orderNo = form.orderNo || `WO/TBC/2026-27/${seqStr}`;

  const newOrder: PaperOrder.PaperSupplyOrderItem = {
    orderId: newId,
    orderNo,
    orderDate:
      formatDate(form.orderDate) || new Date().toISOString().split("T")[0],
    vendorId: Number(form.vendorId || 1),
    vendorName: form.vendorName || "A.B. Paper Mills Pvt Ltd",
    paperMillName: form.paperMillName || "A.B. Paper Mills",
    paperTypeId: form.paperTypeId || "P-58",
    paperType: form.paperType || "58 GSM Maplitho Reel Paper",
    orderedQtyMT,
    ratePerMT,
    basicAmount,
    gstPercent,
    totalAmount,
    deliveryLocation: form.deliveryLocation || "Central Paper Depot, Bhopal",
    deliveryDate: formatDate(form.deliveryDate) || "2026-09-30",
    millBillNo: form.millBillNo,
    billDate: formatDate(form.billDate),
    billCopyPath:
      form.billCopyPath ||
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    isActive: true,
    status: "Pending",
    createdDate: new Date().toISOString().split("T")[0],
  };

  paperOrdersState = [newOrder, ...paperOrdersState];
  return newOrder;
}

export async function updatePaperOrder(
  id: number,
  form: PaperOrder.PaperSupplyOrderForm,
): Promise<PaperOrder.PaperSupplyOrderItem> {
  await new Promise((res) => setTimeout(res, 300));
  const idx = paperOrdersState.findIndex((o) => o.orderId === id);
  if (idx === -1) throw new Error("Paper Order not found");

  const orderedQtyMT = Number(form.orderedQtyMT || 0);
  const ratePerMT = Number(form.ratePerMT || 0);
  const basicAmount = orderedQtyMT * ratePerMT;
  const gstPercent = Number(form.gstPercent || 18);
  const totalAmount = basicAmount * (1 + gstPercent / 100);

  const updated: PaperOrder.PaperSupplyOrderItem = {
    ...paperOrdersState[idx],
    orderNo: form.orderNo || paperOrdersState[idx].orderNo,
    orderDate: formatDate(form.orderDate) || paperOrdersState[idx].orderDate,
    vendorId: Number(form.vendorId || paperOrdersState[idx].vendorId),
    vendorName: form.vendorName || paperOrdersState[idx].vendorName,
    paperMillName: form.paperMillName || paperOrdersState[idx].paperMillName,
    paperTypeId: form.paperTypeId || paperOrdersState[idx].paperTypeId,
    paperType: form.paperType || paperOrdersState[idx].paperType,
    orderedQtyMT,
    ratePerMT,
    basicAmount,
    gstPercent,
    totalAmount,
    deliveryLocation:
      form.deliveryLocation || paperOrdersState[idx].deliveryLocation,
    deliveryDate:
      formatDate(form.deliveryDate) || paperOrdersState[idx].deliveryDate,
    millBillNo: form.millBillNo,
    billDate: formatDate(form.billDate),
    billCopyPath: form.billCopyPath || paperOrdersState[idx].billCopyPath,
  };

  paperOrdersState[idx] = updated;
  return updated;
}

export async function togglePaperOrderStatus(
  id: number,
  isActive: boolean,
): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 150));
  const item = paperOrdersState.find((o) => o.orderId === id);
  if (item) {
    item.isActive = isActive;
    item.status = isActive ? "Approved" : "Rejected";
    return true;
  }
  return false;
}

export async function deletePaperOrder(id: number): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 200));
  paperOrdersState = paperOrdersState.filter((o) => o.orderId !== id);
  return true;
}
