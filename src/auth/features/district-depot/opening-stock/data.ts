export interface OpeningStockItem {
  id: string;
  depotId: string;
  depotName: string;
  division: string;
  titleId: string;
  titleName: string;
  classGroup: string;
  medium: string;
  totalDeliveredQty: number; // Printer Receipts
  totalDispatchedQty: number; // Sent to Blocks
  netInterDepotQty: number; // Net received (+) or transferred (-)
  calculatedOpeningStockQty: number; // Delivered - Dispatched + Net
  equivalentPaperTon: number; // In MT
  status: "PENDING_APPROVAL" | "HO_APPROVED";
  approvedBy?: string;
  approvedDate?: string;
  warehouseBay: string;
  remarks?: string;
}

export interface OpeningStockKpis {
  totalCarriedOverStock: number;
  approvedDepotsCount: number;
  pendingApprovalCount: number;
  totalSavedPaperTon: number; // MT
}

export interface ApproveStockPayload {
  stockId: string;
  remarks?: string;
}

// ─── INITIAL MOCK DATASET ────────────────────────────────────────────────────

export const INITIAL_OPENING_STOCK_KPIS: OpeningStockKpis = {
  totalCarriedOverStock: 30500,
  approvedDepotsCount: 4,
  pendingApprovalCount: 3,
  totalSavedPaperTon: 48.5,
};

export const INITIAL_OPENING_STOCK_LIST: OpeningStockItem[] = [
  {
    id: "OPS-2026-001",
    depotId: "DEP-BPL-01",
    depotName: "Bhopal Central Depot",
    division: "Bhopal",
    titleId: "TTL-MAT-08",
    titleName: "Class 8 Mathematics (Hindi)",
    classGroup: "Class 6 To 8",
    medium: "Hindi Medium",
    totalDeliveredQty: 45000,
    totalDispatchedQty: 40300,
    netInterDepotQty: 3500, // Received from Ujjain
    calculatedOpeningStockQty: 8200, // 45,000 - 40,300 + 3,500
    equivalentPaperTon: 13.12,
    status: "HO_APPROVED",
    approvedBy: "General Manager (Operations) - HO",
    approvedDate: "2026-08-25",
    warehouseBay: "Bay A-01 (Bhopal Main)",
    remarks: "Inventory verified & locked as Opening Stock for FY 2027-2028",
  },
  {
    id: "OPS-2026-002",
    depotId: "DEP-UJJ-07",
    depotName: "Ujjain Regional Depot",
    division: "Ujjain",
    titleId: "TTL-MAT-08",
    titleName: "Class 8 Mathematics (Hindi)",
    classGroup: "Class 6 To 8",
    medium: "Hindi Medium",
    totalDeliveredQty: 45000,
    totalDispatchedQty: 37500,
    netInterDepotQty: -3500, // Sent to Bhopal
    calculatedOpeningStockQty: 4000, // 45,000 - 37,500 - 3,500
    equivalentPaperTon: 6.4,
    status: "HO_APPROVED",
    approvedBy: "General Manager (Operations) - HO",
    approvedDate: "2026-08-25",
    warehouseBay: "Bay B-04 (Ujjain Main)",
    remarks: "Balancing transfer deducted; remaining stock approved",
  },
  {
    id: "OPS-2026-003",
    depotId: "DEP-SGR-06",
    depotName: "Sagar Regional Depot",
    division: "Sagar",
    titleId: "TTL-SCI-09",
    titleName: "Class 9 Science (English)",
    classGroup: "Class 9 To 10",
    medium: "English Medium",
    totalDeliveredQty: 30000,
    totalDispatchedQty: 24000,
    netInterDepotQty: -2800, // Sent to Indore
    calculatedOpeningStockQty: 3200, // 30,000 - 24,000 - 2,800
    equivalentPaperTon: 5.12,
    status: "PENDING_APPROVAL",
    warehouseBay: "Bay A-12 (Sagar North)",
    remarks: "Physical stock audit completed; pending HO final signoff",
  },
  {
    id: "OPS-2026-004",
    depotId: "DEP-IND-02",
    depotName: "Indore Regional Depot",
    division: "Indore",
    titleId: "TTL-SCI-09",
    titleName: "Class 9 Science (English)",
    classGroup: "Class 9 To 10",
    medium: "English Medium",
    totalDeliveredQty: 35000,
    totalDispatchedQty: 32200,
    netInterDepotQty: 2800, // Received from Sagar
    calculatedOpeningStockQty: 5600, // 35,000 - 32,200 + 2,800
    equivalentPaperTon: 8.96,
    status: "HO_APPROVED",
    approvedBy: "Chief Nodal Officer - HO",
    approvedDate: "2026-08-24",
    warehouseBay: "Bay C-08 (Indore West)",
    remarks: "Verified & carried over to FY 2027-2028 demand sheet",
  },
  {
    id: "OPS-2026-005",
    depotId: "DEP-JBP-03",
    depotName: "Jabalpur Regional Depot",
    division: "Jabalpur",
    titleId: "TTL-HND-05",
    titleName: "Class 5 Bhasha Bharti (Hindi)",
    classGroup: "Class 1 To 5",
    medium: "Hindi Medium",
    totalDeliveredQty: 28000,
    totalDispatchedQty: 23500,
    netInterDepotQty: 0,
    calculatedOpeningStockQty: 4500, // 28,000 - 23,500
    equivalentPaperTon: 7.2,
    status: "PENDING_APPROVAL",
    warehouseBay: "Bay B-08 (Jabalpur East)",
    remarks: "End of season surplus submitted for HO consolidation",
  },
  {
    id: "OPS-2026-006",
    depotId: "DEP-GWL-04",
    depotName: "Gwalior Regional Depot",
    division: "Gwalior",
    titleId: "TTL-SST-10",
    titleName: "Class 10 Social Science (Hindi)",
    classGroup: "Class 9 To 10",
    medium: "Hindi Medium",
    totalDeliveredQty: 22000,
    totalDispatchedQty: 18800,
    netInterDepotQty: 0,
    calculatedOpeningStockQty: 3200, // 22,000 - 18,800
    equivalentPaperTon: 5.12,
    status: "HO_APPROVED",
    approvedBy: "General Manager (Operations) - HO",
    approvedDate: "2026-08-23",
    warehouseBay: "Bay D-02 (Gwalior Fort)",
    remarks: "Approved opening stock",
  },
  {
    id: "OPS-2026-007",
    depotId: "DEP-REW-05",
    depotName: "Rewa Regional Depot",
    division: "Rewa",
    titleId: "TTL-ENG-07",
    titleName: "Class 7 English Reader",
    classGroup: "Class 6 To 8",
    medium: "English Medium",
    totalDeliveredQty: 18000,
    totalDispatchedQty: 16200,
    netInterDepotQty: 0,
    calculatedOpeningStockQty: 1800, // 18,000 - 16,200
    equivalentPaperTon: 2.88,
    status: "PENDING_APPROVAL",
    warehouseBay: "Bay D-09 (Rewa Central)",
    remarks: "Pending final HO approval signoff",
  },
];
