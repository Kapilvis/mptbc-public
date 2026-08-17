// ─── 8 MPTBC District Depots ────────────────────────────────────────────────
export interface Depot {
  code: string;
  name: string;
  status: "Active" | "Inactive";
}

export const DEPOT_LIST: Depot[] = [
  { code: "BPL", name: "BHOPAL", status: "Active" },
  { code: "IND", name: "INDORE", status: "Active" },
  { code: "GWL", name: "GWALIOR", status: "Active" },
  { code: "JBP", name: "JABALPUR", status: "Active" },
  { code: "RWA", name: "REWA", status: "Active" },
  { code: "SGR", name: "SAGAR", status: "Active" },
  { code: "UJJ", name: "UJJAIN", status: "Active" },
  { code: "KHD", name: "KHANDWA", status: "Active" },
];

export const depotDropdownItems = DEPOT_LIST.map((d) => ({
  id: d.code,
  text: `${d.name} (${d.code})`,
}));

// ─── Academic Years ──────────────────────────────────────────────────────────
export const academicYears = [
  { id: "2026-2027", text: "2026-2027" },
  { id: "2025-2026", text: "2025-2026" },
  { id: "2024-2025", text: "2024-2025" },
];

// ─── Class Groups ────────────────────────────────────────────────────────────
export const classGroups = [
  { id: "Class 1 To 8", text: "Class 1 To 8" },
  { id: "Class 9 To 12", text: "Class 9 To 12" },
];

// ─── Printer List ─────────────────────────────────────────────────────────────
export const printerList = [
  { id: "PR001", text: "Messrs Ajanta Packaging, Bhopal" },
  { id: "PR002", text: "G Tech Print Works, Indore" },
  { id: "PR003", text: "Drishti Offset Printers, Gwalior" },
  { id: "PR004", text: "M.K. Offset Press, Jabalpur" },
  { id: "PR005", text: "New Lakshmi Printers, Rewa" },
  { id: "PR006", text: "Balaji Printers, Sagar" },
  { id: "PR007", text: "Jayesh Printers & Publishers, Ujjain" },
  { id: "PR008", text: "Saraswati Press, Khandwa" },
];

// ─── Titles ───────────────────────────────────────────────────────────────────
export const titleList = [
  { id: "T001", text: "भाषा भारती (Hindi) - Class 1" },
  { id: "T002", text: "गणित (Mathematics) - Class 5" },
  { id: "T003", text: "विज्ञान (Science) - Class 8" },
  { id: "T004", text: "English Reader - Class 1" },
  { id: "T005", text: "सामाजिक विज्ञान - Class 7" },
  { id: "T006", text: "एटग्रेड अभ्यास पुस्तिका - Class 8" },
  { id: "T007", text: "अकाउंटेन्सी - Class 12" },
];

// ─── Warehouse List ───────────────────────────────────────────────────────────
export const warehouseList = [
  { id: "WH1", text: "Warehouse 1 (Main Godown)" },
  { id: "WH2", text: "Warehouse 2 (Annex Godown)" },
  { id: "WH3", text: "Warehouse 3 (Temporary Store)" },
];

// ─── MP Blocks (sample) ───────────────────────────────────────────────────────
export const blockList = [
  { id: "B001", text: "Huzur" },
  { id: "B002", text: "Bairasiya" },
  { id: "B003", text: "Sanver" },
  { id: "B004", text: "Depalpur" },
  { id: "B005", text: "Chitrangi" },
  { id: "B006", text: "Devsar" },
  { id: "B007", text: "Damoh" },
  { id: "B008", text: "Bhandar" },
  { id: "B009", text: "Datia" },
  { id: "B010", text: "Shivpuri" },
];
