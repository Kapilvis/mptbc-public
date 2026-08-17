export const depotOptions = [
  { label: "INDORE", value: 1 },
  { label: "UJJAIN", value: 2 },
  { label: "KHANDWA", value: 3 },
  { label: "BHOPAL", value: 4 },
  { label: "JABALPUR", value: 5 },
  { label: "GWALIOR", value: 6 },
  { label: "SAGAR", value: 7 },
  { label: "REWA", value: 8 },
];

const defaultSubDepots: Master.SubDepot[] = [
  {
    subDepotId: 1,
    depotId: 3,
    depotName: "KHANDWA",
    name: "BURHANPUR",
    code: "BRN",
    isActive: true,
  },
  {
    subDepotId: 2,
    depotId: 4,
    depotName: "BHOPAL",
    name: "HOSHANGABAD",
    code: "HSG",
    isActive: true,
  },
  {
    subDepotId: 3,
    depotId: 5,
    depotName: "JABALPUR",
    name: "SEONI",
    code: "SNI",
    isActive: true,
  },
  {
    subDepotId: 4,
    depotId: 6,
    depotName: "GWALIOR",
    name: "GUNA",
    code: "GNA",
    isActive: true,
  },
  {
    subDepotId: 5,
    depotId: 7,
    depotName: "SAGAR",
    name: "PANNA",
    code: "PNN",
    isActive: true,
  },
  {
    subDepotId: 6,
    depotId: 8,
    depotName: "REWA",
    name: "SIDHI",
    code: "SDH",
    isActive: true,
  },
  {
    subDepotId: 7,
    depotId: 8,
    depotName: "REWA",
    name: "SHAHDOL",
    code: "SHD",
    isActive: true,
  },
];

const STORAGE_KEY = "mptbc_sub_depot_master_data_v2";

export function getSubDepots(): Master.SubDepot[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSubDepots));
    return defaultSubDepots;
  }
  try {
    return JSON.parse(data);
  } catch {
    return defaultSubDepots;
  }
}

export function saveSubDepots(subDepots: Master.SubDepot[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subDepots));
}
