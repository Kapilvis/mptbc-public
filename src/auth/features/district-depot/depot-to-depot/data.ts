export interface DeficitDepotNeedItem {
  id: string;
  depotId: string;
  depotName: string;
  division: string;
  titleId: string;
  titleName: string;
  classGroup: string;
  medium: string;
  currentStock: number;
  blockDemand: number;
  deficitQty: number;
  urgencyLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  contactPerson: string;
}

export interface SurplusDepotStockItem {
  id: string;
  depotId: string;
  depotName: string;
  division: string;
  titleId: string;
  titleName: string;
  classGroup: string;
  medium: string;
  deliveredQty: number;
  dispatchedQty: number;
  remainingStockQty: number; // Delivered - Dispatched
  warehouseBay: string;
  contactPerson: string;
}

export interface InterDepotTransferOrder {
  id: string;
  transferId: string;
  financialYear: string;
  sourceDepotId: string;
  sourceDepotName: string;
  targetDepotId: string;
  targetDepotName: string;
  titleName: string;
  classGroup: string;
  transferredQty: number;
  transferReason: string;
  status:
    | "APPROVED_SANCTIONED"
    | "DISPATCHED_IN_TRANSIT"
    | "RECEIVED_ACKNOWLEDGED"
    | "PENDING_SANCTION";
  transitVehicleNo: string;
  sanctionedBy: string;
  sanctionDate: string;
}

export interface DepotToDepotKpis {
  totalDeliveredQty: number;
  totalDispatchedQty: number;
  consolidatedRemainingStock: number;
  activeTransfersCount: number;
  totalDeficitQty: number;
  totalSurplusQty: number;
  savedProcurementCost: string;
}

export interface SanctionTransferPayload {
  academicYear: string;
  titleName: string;
  targetDepotId: string;
  sourceAllocations: { sourceDepotId: string; allocatedQty: number }[];
  transitVehicleNo: string;
  transferReason: string;
}

// ─── INITIAL MOCK DATASETS ──────────────────────────────────────────────────

export const INITIAL_KPIS: DepotToDepotKpis = {
  totalDeliveredQty: 180500,
  totalDispatchedQty: 150000,
  consolidatedRemainingStock: 30500, // 180,500 - 150,000
  activeTransfersCount: 8,
  totalDeficitQty: 14200,
  totalSurplusQty: 28500,
  savedProcurementCost: "₹ 48.50 Lakhs",
};

export const INITIAL_DEFICIT_DEPOTS: DeficitDepotNeedItem[] = [
  {
    id: "DEF-001",
    depotId: "DEP-BPL-01",
    depotName: "Bhopal Central Depot",
    division: "Bhopal",
    titleId: "TTL-MAT-08",
    titleName: "Class 8 Mathematics (Hindi)",
    classGroup: "Class 6 To 8",
    medium: "Hindi Medium",
    currentStock: 1200,
    blockDemand: 4700,
    deficitQty: 3500,
    urgencyLevel: "CRITICAL",
    contactPerson: "Alok Verma (+91 94250 11223)",
  },
  {
    id: "DEF-002",
    depotId: "DEP-IND-02",
    depotName: "Indore Regional Depot",
    division: "Indore",
    titleId: "TTL-SCI-09",
    titleName: "Class 9 Science (English)",
    classGroup: "Class 9 To 10",
    medium: "English Medium",
    currentStock: 800,
    blockDemand: 3600,
    deficitQty: 2800,
    urgencyLevel: "CRITICAL",
    contactPerson: "Ramesh Sharma (+91 98260 55432)",
  },
  {
    id: "DEF-003",
    depotId: "DEP-JBP-03",
    depotName: "Jabalpur Regional Depot",
    division: "Jabalpur",
    titleId: "TTL-HND-05",
    titleName: "Class 5 Bhasha Bharti (Hindi)",
    classGroup: "Class 1 To 5",
    medium: "Hindi Medium",
    currentStock: 1500,
    blockDemand: 3900,
    deficitQty: 2400,
    urgencyLevel: "HIGH",
    contactPerson: "Deepak Chouhan (+91 98930 44332)",
  },
  {
    id: "DEF-004",
    depotId: "DEP-GWL-04",
    depotName: "Gwalior Regional Depot",
    division: "Gwalior",
    titleId: "TTL-SST-10",
    titleName: "Class 10 Social Science (Hindi)",
    classGroup: "Class 9 To 10",
    medium: "Hindi Medium",
    currentStock: 950,
    blockDemand: 3150,
    deficitQty: 2200,
    urgencyLevel: "HIGH",
    contactPerson: "Mahesh Yadav (+91 94065 77665)",
  },
  {
    id: "DEF-005",
    depotId: "DEP-REW-05",
    depotName: "Rewa Regional Depot",
    division: "Rewa",
    titleId: "TTL-ENG-07",
    titleName: "Class 7 English Reader",
    classGroup: "Class 6 To 8",
    medium: "English Medium",
    currentStock: 1100,
    blockDemand: 2900,
    deficitQty: 1800,
    urgencyLevel: "MEDIUM",
    contactPerson: "Rajesh Meena (+91 98261 44556)",
  },
  {
    id: "DEF-006",
    depotId: "DEP-SGR-06",
    depotName: "Sagar Regional Depot",
    division: "Sagar",
    titleId: "TTL-SAN-06",
    titleName: "Class 6 Sanskrit Mitra",
    classGroup: "Class 6 To 8",
    medium: "Sanskrit",
    currentStock: 600,
    blockDemand: 2100,
    deficitQty: 1500,
    urgencyLevel: "MEDIUM",
    contactPerson: "Sunil Tiwari (+91 98263 11889)",
  },
];

export const INITIAL_SURPLUS_DEPOTS: SurplusDepotStockItem[] = [
  {
    id: "SUR-001",
    depotId: "DEP-UJJ-07",
    depotName: "Ujjain Regional Depot",
    division: "Ujjain",
    titleId: "TTL-MAT-08",
    titleName: "Class 8 Mathematics (Hindi)",
    classGroup: "Class 6 To 8",
    medium: "Hindi Medium",
    deliveredQty: 45000,
    dispatchedQty: 37500,
    remainingStockQty: 7500, // 45,000 - 37,500
    warehouseBay: "Bay B-04 (Ujjain Main)",
    contactPerson: "Suresh Gupta (+91 98270 99887)",
  },
  {
    id: "SUR-002",
    depotId: "DEP-SGR-06",
    depotName: "Sagar Regional Depot",
    division: "Sagar",
    titleId: "TTL-MAT-08",
    titleName: "Class 8 Mathematics (Hindi)",
    classGroup: "Class 6 To 8",
    medium: "Hindi Medium",
    deliveredQty: 30000,
    dispatchedQty: 25000,
    remainingStockQty: 5000, // 30,000 - 25,000
    warehouseBay: "Bay A-12 (Sagar North)",
    contactPerson: "Sunil Tiwari (+91 98263 11889)",
  },
  {
    id: "SUR-003",
    depotId: "DEP-SGR-06",
    depotName: "Sagar Regional Depot",
    division: "Sagar",
    titleId: "TTL-SCI-09",
    titleName: "Class 9 Science (English)",
    classGroup: "Class 9 To 10",
    medium: "English Medium",
    deliveredQty: 30000,
    dispatchedQty: 24000,
    remainingStockQty: 6000, // 30,000 - 24,000
    warehouseBay: "Bay A-12 (Sagar North)",
    contactPerson: "Sunil Tiwari (+91 98263 11889)",
  },
  {
    id: "SUR-004",
    depotId: "DEP-UJJ-07",
    depotName: "Ujjain Regional Depot",
    division: "Ujjain",
    titleId: "TTL-HND-05",
    titleName: "Class 5 Bhasha Bharti (Hindi)",
    classGroup: "Class 1 To 5",
    medium: "Hindi Medium",
    deliveredQty: 25000,
    dispatchedQty: 20000,
    remainingStockQty: 5000, // 25,000 - 20,000
    warehouseBay: "Bay C-01 (Ujjain South)",
    contactPerson: "Suresh Gupta (+91 98270 99887)",
  },
  {
    id: "SUR-005",
    depotId: "DEP-REW-05",
    depotName: "Rewa Regional Depot",
    division: "Rewa",
    titleId: "TTL-SST-10",
    titleName: "Class 10 Social Science (Hindi)",
    classGroup: "Class 9 To 10",
    medium: "Hindi Medium",
    deliveredQty: 20000,
    dispatchedQty: 15500,
    remainingStockQty: 4500, // 20,000 - 15,500
    warehouseBay: "Bay D-09 (Rewa Central)",
    contactPerson: "Rajesh Meena (+91 98261 44556)",
  },
  {
    id: "SUR-006",
    depotId: "DEP-JBP-03",
    depotName: "Jabalpur Regional Depot",
    division: "Jabalpur",
    titleId: "TTL-ENG-07",
    titleName: "Class 7 English Reader",
    classGroup: "Class 6 To 8",
    medium: "English Medium",
    deliveredQty: 18000,
    dispatchedQty: 14500,
    remainingStockQty: 3500, // 18,000 - 14,500
    warehouseBay: "Bay B-08 (Jabalpur East)",
    contactPerson: "Deepak Chouhan (+91 98930 44332)",
  },
];

export const INITIAL_TRANSFER_ORDERS: InterDepotTransferOrder[] = [
  {
    id: "TRSF-001",
    transferId: "DEP-TRSF-2026-8801-A",
    financialYear: "2026-2027",
    sourceDepotId: "DEP-UJJ-07",
    sourceDepotName: "Ujjain Regional Depot",
    targetDepotId: "DEP-BPL-01",
    targetDepotName: "Bhopal Central Depot",
    titleName: "Class 8 Mathematics (Hindi)",
    classGroup: "Class 6 To 8",
    transferredQty: 3500,
    transferReason:
      "HO Inventory Balancing: Surplus at Ujjain reallocated to Bhopal BRC Shortage",
    status: "DISPATCHED_IN_TRANSIT",
    transitVehicleNo: "MP-09-HH-4412",
    sanctionedBy: "General Manager (Operations) - HO",
    sanctionDate: "2026-08-24",
  },
  {
    id: "TRSF-002",
    transferId: "DEP-TRSF-2026-8802-A",
    financialYear: "2026-2027",
    sourceDepotId: "DEP-SGR-06",
    sourceDepotName: "Sagar Regional Depot",
    targetDepotId: "DEP-IND-02",
    targetDepotName: "Indore Regional Depot",
    titleName: "Class 9 Science (English)",
    classGroup: "Class 9 To 10",
    transferredQty: 2800,
    transferReason:
      "HO Inventory Balancing: Surplus at Sagar transferred to Indore Block Deficit",
    status: "RECEIVED_ACKNOWLEDGED",
    transitVehicleNo: "MP-15-ZC-5100",
    sanctionedBy: "Chief Nodal Officer - HO",
    sanctionDate: "2026-08-22",
  },
  {
    id: "TRSF-003",
    transferId: "DEP-TRSF-2026-8803-A",
    financialYear: "2026-2027",
    sourceDepotId: "DEP-UJJ-07",
    sourceDepotName: "Ujjain Regional Depot",
    targetDepotId: "DEP-JBP-03",
    targetDepotName: "Jabalpur Regional Depot",
    titleName: "Class 5 Bhasha Bharti (Hindi)",
    classGroup: "Class 1 To 5",
    transferredQty: 2400,
    transferReason: "Inter-Depot Stock Optimization without fresh printing PO",
    status: "APPROVED_SANCTIONED",
    transitVehicleNo: "MP-20-HB-9633",
    sanctionedBy: "HO Inventory Controlling Authority",
    sanctionDate: "2026-08-25",
  },
];
