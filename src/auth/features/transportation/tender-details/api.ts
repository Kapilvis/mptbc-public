import { mockTendersList } from "./data";
import type { TenderRecord, DistrictTransporterAllocation } from "./data";

let tendersData: TenderRecord[] = [...mockTendersList];

export async function fetchTenders(): Promise<TenderRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...tendersData];
}

export async function fetchTenderById(
  tenderId: string,
): Promise<TenderRecord | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return tendersData.find((t) => t.tenderId === tenderId);
}

export async function createTender(
  payload: Omit<TenderRecord, "tenderId">,
): Promise<TenderRecord> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newTender: TenderRecord = {
    ...payload,
    tenderId: `TND-${new Date().getFullYear()}-${String(tendersData.length + 1).padStart(3, "0")}`,
  };
  tendersData = [newTender, ...tendersData];
  return newTender;
}

export async function updateTender(
  payload: TenderRecord,
): Promise<TenderRecord> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  tendersData = tendersData.map((t) =>
    t.tenderId === payload.tenderId ? { ...payload } : t,
  );
  return payload;
}

export async function deleteTender(tenderId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  tendersData = tendersData.filter((t) => t.tenderId !== tenderId);
}

/**
 * Returns all active authorized transporter allocations for a given district.
 * If district is omitted, returns all allocations from active tenders.
 */
export function getActiveDistrictTransporters(
  district?: string,
): DistrictTransporterAllocation[] {
  const activeTenders = tendersData.filter((t) => t.status === "Active");
  const allAllocations = activeTenders.flatMap((t) => t.allocations);

  if (!district) return allAllocations;
  return allAllocations.filter(
    (a) => a.district.toLowerCase() === district.toLowerCase(),
  );
}
