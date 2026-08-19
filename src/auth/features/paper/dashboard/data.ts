export interface PaperKpiMetric {
  title: string;
  value: string;
  subValue: string;
  icon: string;
  badgeText: string;
  badgeType: "success" | "warning" | "info" | "danger";
}

export interface SupplyPipelineStage {
  stage: string;
  quantityMT: number;
  percentage: number;
  statusText: string;
  color: string;
}

export interface GsmSupplyMetric {
  gsmType: string;
  orderedMT: number;
  suppliedMT: number;
}

export interface VendorPerformanceItem {
  id: number;
  paperMillName: string;
  vendorName: string;
  academicYear: string;
  approvedTon: number;
  workOrderTon: number;
  suppliedTon: number;
  balanceTon: number;
  fulfillmentPercent: number;
  status: "Active" | "Completed" | "In Progress";
}

export const MOCK_PAPER_KPI_METRICS: PaperKpiMetric[] = [
  {
    title: "Total Tender Allocation",
    value: "3,767 MT",
    subValue: "₹ 19.34 Cr Agreement Value",
    icon: "pi pi-file-check",
    badgeText: "6 Paper Mills",
    badgeType: "info",
  },
  {
    title: "Work Orders Issued",
    value: "3,776 MT",
    subValue: "5 Active Purchase Orders",
    icon: "pi pi-shopping-bag",
    badgeText: "100.2% Allocated",
    badgeType: "success",
  },
  {
    title: "Dispatched & Delivered",
    value: "3,165 MT",
    subValue: "Supplied to Central Depot",
    icon: "pi pi-truck",
    badgeText: "83.8% Fulfilled",
    badgeType: "success",
  },
  {
    title: "Balance Pending Supply",
    value: "611 MT",
    subValue: "₹ 3.12 Cr Outstanding",
    icon: "pi pi-clock",
    badgeText: "16.2% Outstanding",
    badgeType: "warning",
  },
];

export const MOCK_SUPPLY_PIPELINE_STAGES: SupplyPipelineStage[] = [
  {
    stage: "Tender Awarded",
    quantityMT: 3767,
    percentage: 100,
    statusText: "3,767 MT Total Contracted",
    color: "bg-emerald-500",
  },
  {
    stage: "Work Orders Placed",
    quantityMT: 3776.65,
    percentage: 100,
    statusText: "3,776 MT Purchase Orders",
    color: "bg-teal-500",
  },
  {
    stage: "Dispatched / In-Transit",
    quantityMT: 3165.45,
    percentage: 83.8,
    statusText: "3,165 MT Shipped",
    color: "bg-blue-500",
  },
  {
    stage: "Central Depot Received",
    quantityMT: 2463.75,
    percentage: 65.2,
    statusText: "2,463 MT Verified in Stock",
    color: "bg-indigo-500",
  },
];

export const MOCK_GSM_SUPPLY_DATA: GsmSupplyMetric[] = [
  { gsmType: "58 GSM Reel", orderedMT: 809, suppliedMT: 809 },
  { gsmType: "70 GSM Reel", orderedMT: 1541, suppliedMT: 1541 },
  { gsmType: "120 GSM Reel", orderedMT: 202, suppliedMT: 150 },
  { gsmType: "170 GSM Card", orderedMT: 894, suppliedMT: 809 },
  { gsmType: "200 GSM Card", orderedMT: 617, suppliedMT: 450 },
];

export const MOCK_VENDOR_PERFORMANCE: VendorPerformanceItem[] = [
  {
    id: 1,
    paperMillName: "A.B. Paper Mills",
    vendorName: "A.B. Paper Mills Pvt Ltd",
    academicYear: "2026-2027",
    approvedTon: 500,
    workOrderTon: 894,
    suppliedTon: 809,
    balanceTon: 85,
    fulfillmentPercent: 90,
    status: "In Progress",
  },
  {
    id: 2,
    paperMillName: "T.N.P.L.",
    vendorName: "Tamil Nadu Newsprint & Papers Ltd",
    academicYear: "2025-2026",
    approvedTon: 475,
    workOrderTon: 202,
    suppliedTon: 150,
    balanceTon: 52,
    fulfillmentPercent: 74,
    status: "In Progress",
  },
  {
    id: 3,
    paperMillName: "Ballarpur Industries (BILT)",
    vendorName: "Ballarpur Industries Limited",
    academicYear: "2026-2027",
    approvedTon: 585,
    workOrderTon: 701,
    suppliedTon: 701,
    balanceTon: 0,
    fulfillmentPercent: 100,
    status: "Completed",
  },
  {
    id: 4,
    paperMillName: "ITC Limited",
    vendorName: "ITC Limited - Paperboards & Specialty Papers",
    academicYear: "2024-2025",
    approvedTon: 580,
    workOrderTon: 810,
    suppliedTon: 810,
    balanceTon: 0,
    fulfillmentPercent: 100,
    status: "Completed",
  },
  {
    id: 5,
    paperMillName: "J.K. Paper Mills",
    vendorName: "J.K. Paper Limited",
    academicYear: "2025-2026",
    approvedTon: 617,
    workOrderTon: 617,
    suppliedTon: 450,
    balanceTon: 167,
    fulfillmentPercent: 73,
    status: "In Progress",
  },
  {
    id: 6,
    paperMillName: "Century Pulp & Paper",
    vendorName: "Century Pulp & Paper",
    academicYear: "2026-2027",
    approvedTon: 656,
    workOrderTon: 656,
    suppliedTon: 656,
    balanceTon: 0,
    fulfillmentPercent: 100,
    status: "Completed",
  },
];
