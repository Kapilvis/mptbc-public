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
  description: string;
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
    id: "paper",
    title: "1. Paper Procurement",
    primaryValue: "3,767 MT",
    secondaryValue: "Balance Pending: 611 MT",
    badgeText: "83.8% Delivered to Central",
    badgeType: "success",
    icon: "pi pi-copy",
    accentColor: "#059669",
  },
  {
    id: "depot",
    title: "2. Central Stock",
    primaryValue: "6,000 MT Issued",
    secondaryValue: "Active Orders: 8 Active POs",
    badgeText: "2 GSM Low Alerts",
    badgeType: "danger",
    icon: "pi pi-box",
    accentColor: "#d97706",
  },
  {
    id: "printing",
    title: "3. Print Production",
    primaryValue: "1,80,500 Books",
    secondaryValue: "2,09,500 Books Pending",
    badgeText: "11 Orders / 3 Presses",
    badgeType: "info",
    icon: "pi pi-print",
    accentColor: "#2563eb",
  },
  {
    id: "district",
    title: "4. District Depots",
    primaryValue: "25,000 In Stock",
    secondaryValue: "Pending Dispatches: 580 Block Orders",
    badgeText: "60 Challans Dispatched",
    badgeType: "success",
    icon: "pi pi-building",
    accentColor: "#7c3aed",
  },
  {
    id: "demand",
    title: "5. State Demand",
    primaryValue: "2,90,850 Units",
    secondaryValue: "School Distribution: 48.2% Completed",
    badgeText: "85.4% TBC Dispatch Rate",
    badgeType: "success",
    icon: "pi pi-file-edit",
    accentColor: "#0284c7",
  },
];

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    stepNumber: 1,
    title: "Stage 1: Paper Vendor",
    percentage: 83.8,
    detailText: "3,165 MT / 3,767 MT Received",
    status: "completed",
  },
  {
    stepNumber: 2,
    title: "Stage 2: Central Depot",
    percentage: 72.4,
    detailText: "6,000 MT Issued to Printers",
    status: "completed",
  },
  {
    stepNumber: 3,
    title: "Stage 3: Printers",
    percentage: 46.3,
    detailText: "1.80L / 3.90L Printed",
    status: "in-progress",
  },
  {
    stepNumber: 4,
    title: "Stage 4: District Depots",
    percentage: 80.0,
    detailText: "25,000 Copies in Stock",
    status: "in-progress",
  },
  {
    stepNumber: 5,
    title: "Stage 5: Distribution",
    percentage: 48.2,
    detailText: "38 Schools Reached",
    status: "pending",
  },
];

export const EXECUTIVE_ALERTS: ExecutiveAlert[] = [
  {
    id: "alert-1",
    module: "CENTRAL DEPOT",
    category: "STOCK DEFICIT",
    title: "70 GSM Text Paper Low",
    description:
      "Deficit of -32,000 MT vs safety threshold in Central Warehouse.",
    severity: "danger",
    actionLabel: "Reallocate Stock Memo",
    actionRoute: "/inventory/dashboard",
  },
  {
    id: "alert-2",
    module: "PRINTER SECTION",
    category: "DEADLINE BREACH",
    title: "Ajanta Packaging PO-7826",
    description: "60,000 Class 10 Math books delivery due Aug 20.",
    severity: "danger",
    actionLabel: "Draft Warning Notice",
    actionRoute: "/printing/orders/list",
  },
  {
    id: "alert-3",
    module: "DISTRIBUTION",
    category: "PENDING QUEUE",
    title: "RSK / CPI Agency Demand",
    description: "58,000 Units awaiting executive sign-off for release.",
    severity: "warning",
    actionLabel: "Executive Order Sign-off",
    actionRoute: "/distribution/demand-approval",
  },
  {
    id: "alert-4",
    module: "DISTRICT DEPOT",
    category: "LOGISTICS BOTTLENECK",
    title: "Huzur & Bairasiya Blocks",
    description: "580 pending challans awaiting transport allocation.",
    severity: "info",
    actionLabel: "Draft Logistics Plan",
    actionRoute: "/district-depot/dispatch/history",
  },
];

export const ZONE_PROGRESS_DATA: ZoneProgressItem[] = [
  { zone: "Bhopal Zone", netDemand: 52000, printed: 42000, dispatched: 38000 },
  { zone: "Indore Zone", netDemand: 68000, printed: 55000, dispatched: 51000 },
  { zone: "Gwalior Zone", netDemand: 45000, printed: 36000, dispatched: 31000 },
  {
    zone: "Jabalpur Zone",
    netDemand: 58000,
    printed: 48000,
    dispatched: 43000,
  },
  { zone: "Ujjain Zone", netDemand: 42000, printed: 34000, dispatched: 30000 },
  { zone: "Sagar Zone", netDemand: 38000, printed: 31000, dispatched: 27000 },
];

export const FULFILLMENT_DONUT_DATA = [
  {
    label: "Approved & Sent",
    value: 65,
    color: "var(--primary-color, #008a45)",
  },
  { label: "In-Transit", value: 20, color: "#2563eb" },
  { label: "Pending Dispatch", value: 10, color: "#f59e0b" },
  { label: "Other / Shortage", value: 5, color: "#ef4444" },
];

export const SUB_PORTAL_SUMMARIES: SubPortalSummary[] = [
  {
    id: "paper-vendor",
    title: "Paper Vendor",
    subtitle: "Procurement & Mills",
    route: "/paper/dashboard",
    badge: "6 Paper Mills",
    accentColor: "#059669",
    stats: [
      { label: "Work Orders:", value: "3,776 MT" },
      { label: "Central Receipt:", value: "2,463 MT" },
      { label: "Contract Val:", value: "₹19.34 Cr", isHighlight: true },
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
      { label: "Text Paper 58 GSM:", value: "4,000 MT" },
      { label: "Cover Paper 80 GSM:", value: "-40,200 MT", isDanger: true },
      { label: "Total Issued:", value: "6,000 MT", isHighlight: true },
    ],
  },
  {
    id: "printer-section",
    title: "Printer Section",
    subtitle: "Press Production",
    route: "/printing/dashboard",
    badge: "8 Vendors",
    accentColor: "#2563eb",
    stats: [
      { label: "Ajanta Packaging:", value: "80% Done" },
      { label: "G Tech Print:", value: "78% Done" },
      { label: "Paper Consumed:", value: "72 MT", isHighlight: true },
    ],
  },
  {
    id: "district-depot",
    title: "District Depot",
    subtitle: "Depots & Blocks",
    route: "/district-depot/dashboard",
    badge: "51 Depots",
    accentColor: "#7c3aed",
    stats: [
      { label: "Bookseller Demand:", value: "10,000" },
      { label: "Block Dispatch:", value: "60 Challans" },
      { label: "Stock Remaining:", value: "7,000", isHighlight: true },
    ],
  },
  {
    id: "distribution",
    title: "Distribution",
    subtitle: "Demand & Agencies",
    route: "/distribution/dashboard",
    badge: "Agencies",
    accentColor: "#0284c7",
    stats: [
      { label: "RSK Agency:", value: "1,10,000 (75%)" },
      { label: "CPI Agency:", value: "22,000 (48%)" },
      { label: "Damaged Rate:", value: "0.2% Short", isDanger: true },
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
