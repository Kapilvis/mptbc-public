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
    title: "Total Requirement",
    value: "3,767 MT",
    subValue: "",
    icon: "pi pi-file-check",
    badgeText: "6 Paper Mills",
    badgeType: "info",
  },
  {
    title: "Opening Stock",
    value: "60 MT",
    subValue: "",
    icon: "pi pi-box",
    badgeText: "In Depots",
    badgeType: "info",
  },
  {
    title: "Actual Demand",
    value: "3,707 MT",
    subValue: "",
    icon: "pi pi-shopping-bag",
    badgeText: "For Allocation",
    badgeType: "success",
  },
  {
    title: "Work Orders",
    value: "3,707 MT",
    subValue: "",
    icon: "pi pi-send",
    badgeText: "100% Allocated",
    badgeType: "success",
  },
  {
    title: "Received",
    value: "3,165 MT",
    subValue: "",
    icon: "pi pi-truck",
    badgeText: "85.4% Fulfilled",
    badgeType: "success",
  },
  {
    title: "Pending",
    value: "542 MT",
    subValue: "",
    icon: "pi pi-clock",
    badgeText: "14.6% Outstanding",
    badgeType: "warning",
  },
  {
    title: "Delivered to Printer",
    value: "2,850 MT",
    subValue: "",
    icon: "pi pi-building",
    badgeText: "76.9% Stocked",
    badgeType: "info",
  },
];

export const MOCK_SUPPLY_PIPELINE_STAGES: SupplyPipelineStage[] = [
  {
    stage: "Tender Allocation",
    quantityMT: 3767,
    percentage: 100,
    statusText: "3,767 MT Contracted",
    color: "bg-emerald-500",
  },
  {
    stage: "Purchase Orders Issued",
    quantityMT: 3707,
    percentage: 100,
    statusText: "3,707 MT Work Orders",
    color: "bg-teal-500",
  },
  {
    stage: "Mill Dispatch & Shipped",
    quantityMT: 3165,
    percentage: 85.4,
    statusText: "3,165 MT Shipped",
    color: "bg-blue-500",
  },
  {
    stage: "Central Stock Verified",
    quantityMT: 2850,
    percentage: 76.9,
    statusText: "2,850 MT In Stock",
    color: "bg-indigo-500",
  },
];

export const MOCK_GSM_SUPPLY_DATA: GsmSupplyMetric[] = [
  { gsmType: "58 GSM Reel", orderedMT: 1000, suppliedMT: 1000 },
  { gsmType: "70 GSM Reel", orderedMT: 1200, suppliedMT: 1200 },
  { gsmType: "120 GSM Reel", orderedMT: 300, suppliedMT: 200 },
  { gsmType: "170 GSM Card", orderedMT: 800, suppliedMT: 515 },
  { gsmType: "200 GSM Card", orderedMT: 467, suppliedMT: 250 },
];

export const MOCK_VENDOR_PERFORMANCE: VendorPerformanceItem[] = [
  {
    id: 1,
    paperMillName: "A.B. Paper Mills",
    vendorName: "A.B. Paper Mills Pvt Ltd",
    academicYear: "2026-2027",
    approvedTon: 1000,
    workOrderTon: 1000,
    suppliedTon: 894,
    balanceTon: 106,
    fulfillmentPercent: 89.4,
    status: "In Progress",
  },
  {
    id: 2,
    paperMillName: "Ballarpur Industries (BILT)",
    vendorName: "Ballarpur Industries Limited",
    academicYear: "2026-2027",
    approvedTon: 800,
    workOrderTon: 800,
    suppliedTon: 800,
    balanceTon: 0,
    fulfillmentPercent: 100.0,
    status: "Completed",
  },
  {
    id: 3,
    paperMillName: "Century Pulp & Paper",
    vendorName: "Century Pulp & Paper",
    academicYear: "2026-2027",
    approvedTon: 700,
    workOrderTon: 700,
    suppliedTon: 700,
    balanceTon: 0,
    fulfillmentPercent: 100.0,
    status: "Completed",
  },
  {
    id: 4,
    paperMillName: "Tamil Nadu Newsprint (TNPL)",
    vendorName: "Tamil Nadu Newsprint & Papers Ltd",
    academicYear: "2026-2027",
    approvedTon: 500,
    workOrderTon: 500,
    suppliedTon: 380,
    balanceTon: 120,
    fulfillmentPercent: 76.0,
    status: "In Progress",
  },
  {
    id: 5,
    paperMillName: "ITC Limited",
    vendorName: "ITC Limited - Paperboards & Specialty Papers",
    academicYear: "2026-2027",
    approvedTon: 450,
    workOrderTon: 450,
    suppliedTon: 250,
    balanceTon: 200,
    fulfillmentPercent: 55.6,
    status: "In Progress",
  },
  {
    id: 6,
    paperMillName: "J.K. Paper Mills",
    vendorName: "J.K. Paper Limited",
    academicYear: "2026-2027",
    approvedTon: 317,
    workOrderTon: 257,
    suppliedTon: 141,
    balanceTon: 116,
    fulfillmentPercent: 54.9,
    status: "In Progress",
  },
];
