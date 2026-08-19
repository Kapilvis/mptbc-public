export interface ExecutiveKpiItem {
  id: string;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  badgeText: string;
  badgeType: "success" | "warning" | "info" | "danger";
  icon: string;
  accentColor: string;
}

export interface LifecycleStage {
  stepNumber: number;
  title: string;
  percentage: number;
  detailText: string;
  status: "completed" | "in-progress" | "pending";
}

export interface ExecutiveAlert {
  id: string;
  module: string;
  category: string;
  title: string;
  description?: string;
  severity: "danger" | "warning" | "info";
  actionLabel: string;
  actionRoute: string;
}

export interface ZoneProgressItem {
  zone: string;
  netDemand: number;
  printed: number;
  dispatched: number;
}

export interface SubPortalSummary {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  badge: string;
  stats: {
    label: string;
    value: string;
    isHighlight?: boolean;
    isDanger?: boolean;
  }[];
  accentColor: string;
}

export interface ActivityTrailItem {
  id: string;
  timestamp: string;
  module:
  | "Paper Vendor"
  | "Central Depot"
  | "Printer Section"
  | "District Depot"
  | "Distribution";
  event: string;
  entity: string;
  volume: string;
  status: "Confirmed" | "In-Transit" | "Issued" | "Verified" | "Pending";
}

/* ─── Mock Datasets ─── */

export const EXECUTIVE_KPIS: ExecutiveKpiItem[] = [
  {
    id: "demand",
    title: "1. State Demand",
    primaryValue: "4,50,000",
    secondaryValue: "Pending: 60,000 Books",
    badgeText: "86.7% Approved",
    badgeType: "success",
    icon: "pi pi-chart-bar",
    accentColor: "#0284c7",
  },
  {
    id: "paper",
    title: "2. Paper Procurement",
    primaryValue: "3,767 MT",
    secondaryValue: "Balance: 602 MT",
    badgeText: "84.0% Received",
    badgeType: "success",
    icon: "pi pi-file",
    accentColor: "#059669",
  },
  {
    id: "depot",
    title: "3. Central Depot Stock",
    primaryValue: "3,165 MT",
    secondaryValue: "Balance: 365 MT",
    badgeText: "Capacity: 1,000 MT",
    badgeType: "info",
    icon: "pi pi-box",
    accentColor: "#d97706",
  },
  {
    id: "printing",
    title: "4. Printer Production",
    primaryValue: "3,90,000 Books",
    secondaryValue: "Pending: 2,09,500 Books",
    badgeText: "52 Printers",
    badgeType: "info",
    icon: "pi pi-print",
    accentColor: "#2563eb",
  },
  {
    id: "district",
    title: "5. District Depots",
    primaryValue: "1,80,500",
    secondaryValue: "In Stock: 30,500 Books",
    badgeText: "8 Depots",
    badgeType: "success",
    icon: "pi pi-building",
    accentColor: "#7c3aed",
  },
];

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    stepNumber: 1,
    title: "Stage 1: Distribution",
    percentage: 86.7,
    detailText: "3,90,000 / 4,50,000 Books Approved",
    status: "in-progress",
  },
  {
    stepNumber: 2,
    title: "Stage 2: Paper Vendor",
    percentage: 84.0,
    detailText: "3,165 MT / 3,767 MT Received",
    status: "completed",
  },
  {
    stepNumber: 3,
    title: "Stage 3: Central Depot",
    percentage: 88.5,
    detailText: "2,800 MT / 3,165 MT Issued to Printers",
    status: "completed",
  },
  {
    stepNumber: 4,
    title: "Stage 4: Printers",
    percentage: 46.3,
    detailText: "1.80L / 3.90L Dispatched",
    status: "in-progress",
  },
  {
    stepNumber: 5,
    title: "Stage 5: District Depots",
    percentage: 83.1,
    detailText: "30,500 Books in Stock",
    status: "in-progress",
  },
];

export const EXECUTIVE_ALERTS: ExecutiveAlert[] = [
  {
    id: "alert-1",
    module: "CENTRAL DEPOT",
    category: "Short",
    title: "2 GSM Types Short",
    severity: "danger",
    actionLabel: "View",
    actionRoute: "/inventory/dashboard",
  },
  {
    id: "alert-2",
    module: "PRINTER SECTION",
    category: "DEADLINE BREACH",
    title: "5 Printer Orders Near Deadline",
    severity: "danger",
    actionLabel: "View",
    actionRoute: "/printing/orders/list",
  },
  {
    id: "alert-3",
    module: "DISTRIBUTION",
    category: "PENDING QUEUE",
    title: "Classes Demand Pending – 2",
    severity: "warning",
    actionLabel: "View",
    actionRoute: "/distribution/demand-approval",
  },
  {
    id: "alert-4",
    module: "DISTRICT DEPOT",
    category: "Logistics Hurdles",
    title: "Dispatch Pending – 4",
    severity: "info",
    actionLabel: "View",
    actionRoute: "/district-depot/dispatch/history",
  },
];

export const ZONE_PROGRESS_DATA: ZoneProgressItem[] = [
  { zone: "Indore", netDemand: 48500, printed: 39200, dispatched: 36400 },
  { zone: "Bhopal", netDemand: 45200, printed: 38000, dispatched: 34800 },
  {
    zone: "Jabalpur",
    netDemand: 42150,
    printed: 34500,
    dispatched: 31200,
  },
  { zone: "Khandwa", netDemand: 36800, printed: 29800, dispatched: 27000 },
  { zone: "Gwalior", netDemand: 32400, printed: 26000, dispatched: 22500 },
  { zone: "Ujjain", netDemand: 30200, printed: 24400, dispatched: 21600 },
  { zone: "Sagar", netDemand: 28600, printed: 23000, dispatched: 20200 },
  { zone: "Rewa", netDemand: 27000, printed: 21600, dispatched: 18800 },
];

export const FULFILLMENT_DONUT_DATA = [
  {
    label: "Approved & Sent",
    value: 86.7,
    units: 390000,
    color: "#059669",
  },
  {
    label: "In-Transit to Depots",
    value: 10.0,
    units: 45000,
    color: "#2563eb",
  },
  {
    label: "Pending Approval",
    value: 3.3,
    units: 15000,
    color: "#f59e0b",
  },
];

export const SUB_PORTAL_SUMMARIES: SubPortalSummary[] = [
  {
    id: "distribution",
    title: "Distribution",
    subtitle: "Demand ",
    route: "/distribution/dashboard",
    badge: "Departments",
    accentColor: "#0284c7",
    stats: [
      { label: "Total Demand:", value: "4,50,000" },
      { label: "Total Approved:", value: "3,90,000" },
      { label: "Pending Approval:", value: "60,000", isHighlight: true },
    ],
  },
  {
    id: "paper-vendor",
    title: "Paper Vendor",
    subtitle: "Procurement & Mills",
    route: "/paper/dashboard",
    badge: "6 Paper Mills",
    accentColor: "#059669",
    stats: [
      { label: "Work Orders:", value: "3,767 MT" },
      { label: "Delivered:", value: "3,165 MT", isHighlight: true },
    ],
  },
  {
    id: "central-depot",
    title: "Central Depot",
    subtitle: "Warehouse & Stock",
    route: "/inventory/dashboard",
    badge: "Inventory",
    accentColor: "#d97706",
    stats: [
      { label: "Total Received:", value: "3,165 MT" },
      { label: "Total Issued:", value: "2,800 MT" },
      { label: "Stock Balance:", value: "365 MT", isHighlight: true },
    ],
  },
  {
    id: "printer-section",
    title: "Printer Section",
    subtitle: "Press Production",
    route: "/printing/dashboard",
    badge: "52 Printers",
    accentColor: "#2563eb",
    stats: [
      { label: "Target Books:", value: "3,90,000" },
      { label: "Dispatched Books:", value: "1,80,500" },
      { label: "Pending Books:", value: "2,09,500", isHighlight: true },
    ],
  },
  {
    id: "district-depot",
    title: "District Depot",
    subtitle: "Depots & Blocks",
    route: "/district-depot/dashboard",
    badge: "8 Depots",
    accentColor: "#7c3aed",
    stats: [
      { label: "Total Received:", value: "1,80,500" },
      { label: "Block Dispatch:", value: "1,50,000" },
      { label: "Stock Remaining:", value: "30,500", isHighlight: true },
    ],
  },
];

export const UNIFIED_ACTIVITY_TRAIL: ActivityTrailItem[] = [
  {
    id: "act-1",
    timestamp: "11:30 AM",
    module: "District Depot",
    event: "Challan Received & Stock Updated",
    entity: "Ajanta Packaging",
    volume: "412 Bundles (65,591 Books)",
    status: "Confirmed",
  },
  {
    id: "act-2",
    timestamp: "10:15 AM",
    module: "Distribution",
    event: "Dispatched to Block Center",
    entity: "Huzur Block (CHL/2026/0118)",
    volume: "24,500 Copies",
    status: "In-Transit",
  },
  {
    id: "act-3",
    timestamp: "09:46 AM",
    module: "Central Depot",
    event: "Paper Stock Dispatched to Press",
    entity: "G Tech Print Works",
    volume: "1,000 MT (70 GSM Text)",
    status: "Issued",
  },
  {
    id: "act-4",
    timestamp: "09:00 AM",
    module: "Paper Vendor",
    event: "Tender Order Delivery Verification",
    entity: "Orient Paper Mills",
    volume: "500 MT (58 GSM)",
    status: "Verified",
  },
  {
    id: "act-5",
    timestamp: "Yesterday",
    module: "Printer Section",
    event: "Class 10 Mathematics Printing Batch",
    entity: "Drishti Offset",
    volume: "18,500 / 60,000 Copies",
    status: "Pending",
  },
];
