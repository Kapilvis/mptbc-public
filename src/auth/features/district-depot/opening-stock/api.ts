import { INITIAL_OPENING_STOCK_KPIS, INITIAL_OPENING_STOCK_LIST } from "./data";
import type {
  ApproveStockPayload,
  OpeningStockItem,
  OpeningStockKpis,
} from "./data";

let openingStockState: OpeningStockItem[] = [...INITIAL_OPENING_STOCK_LIST];

export async function getOpeningStockKpis(): Promise<OpeningStockKpis> {
  await new Promise((res) => setTimeout(res, 150));
  const approvedCount = openingStockState.filter(
    (s) => s.status === "HO_APPROVED",
  ).length;
  const pendingCount = openingStockState.filter(
    (s) => s.status === "PENDING_APPROVAL",
  ).length;
  const totalQty = openingStockState.reduce(
    (sum, s) => sum + s.calculatedOpeningStockQty,
    0,
  );
  const totalTon = openingStockState.reduce(
    (sum, s) => sum + s.equivalentPaperTon,
    0,
  );

  return {
    ...INITIAL_OPENING_STOCK_KPIS,
    totalCarriedOverStock: totalQty,
    approvedDepotsCount: approvedCount,
    pendingApprovalCount: pendingCount,
    totalSavedPaperTon: Number(totalTon.toFixed(2)),
  };
}

export async function getOpeningStockList(
  academicYear?: string,
): Promise<OpeningStockItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  if (!academicYear) return [...openingStockState];
  return [...openingStockState];
}

export async function approveOpeningStock(
  payload: ApproveStockPayload,
): Promise<OpeningStockItem> {
  await new Promise((res) => setTimeout(res, 300));
  const idx = openingStockState.findIndex((s) => s.id === payload.stockId);
  if (idx === -1) throw new Error("Opening Stock Record not found");

  const todayStr = new Date().toISOString().split("T")[0];
  const updated: OpeningStockItem = {
    ...openingStockState[idx],
    status: "HO_APPROVED",
    approvedBy: "General Manager (Operations) - HO",
    approvedDate: todayStr,
    remarks:
      payload.remarks ||
      "Verified & locked as official Opening Stock for FY 2027-2028",
  };

  openingStockState[idx] = updated;
  return updated;
}

export async function approveAllOpeningStock(): Promise<OpeningStockItem[]> {
  await new Promise((res) => setTimeout(res, 400));
  const todayStr = new Date().toISOString().split("T")[0];

  openingStockState = openingStockState.map((item) => ({
    ...item,
    status: "HO_APPROVED",
    approvedBy: "General Manager (Operations) - HO",
    approvedDate: todayStr,
    remarks:
      "Bulk HO Consolidation: All depot carried-over inventory locked as Opening Stock for FY 2027-2028",
  }));

  return [...openingStockState];
}
