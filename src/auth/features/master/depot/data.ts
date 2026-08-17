const defaultDepots: Master.Depot[] = [
  { depotId: 1, name: "INDORE", code: "IND", isActive: true },
  { depotId: 2, name: "UJJAIN", code: "UJJ", isActive: true },
  { depotId: 3, name: "KHANDWA", code: "KHD", isActive: true },
  { depotId: 4, name: "BHOPAL", code: "BPL", isActive: true },
  { depotId: 5, name: "JABALPUR", code: "JBP", isActive: true },
  { depotId: 6, name: "GWALIOR", code: "GWL", isActive: true },
  { depotId: 7, name: "SAGAR", code: "SGR", isActive: true },
  { depotId: 8, name: "REWA", code: "RWA", isActive: true },
];

const STORAGE_KEY = "mptbc_depot_master_data_v2";

export function getDepots(): Master.Depot[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDepots));
    return defaultDepots;
  }
  try {
    return JSON.parse(data);
  } catch {
    return defaultDepots;
  }
}

export function saveDepots(depots: Master.Depot[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(depots));
}
