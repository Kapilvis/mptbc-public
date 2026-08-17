import type { KpiMetric } from "auth/features/distribution/dashboard/data";

// Re-export the KpiMetric type for local use
export type { KpiMetric };

// ─── Depot Dashboard KPI Metrics ─────────────────────────────────────────────
export const depotKpiMetrics: KpiMetric[] = [
  {
    title: "TOTAL STOCK IN DEPOT",
    value: "25,000",
    subText: "Books available in depot",
    icon: "pi pi-book",
    theme: "indigo",
    type: "net-demand",
    badgeText: "7,000 Remaining",
    trend: "+2.1% vs last week",
  },
  {
    title: "PRINTER-WISE ALLOTMENT",
    value: "500",
    subText: "Bundles received from printers",
    icon: "pi pi-print",
    theme: "blue",
    type: "dispatch-rate",
    badgeText: "450 Remaining",
  },
  {
    title: "DISPATCH TO BLOCKS",
    value: "60",
    subText: "Challans dispatched to BRC/Blocks",
    icon: "pi pi-truck",
    theme: "amber",
    type: "brc-rate",
    badgeText: "580 Pending",
  },
  {
    title: "TODAY'S BOOKSELLER DEMAND",
    value: "10,000",
    subText: "Copies demanded today",
    icon: "pi pi-shopping-bag",
    theme: "emerald",
    type: "student-progress",
    badgeText: "8,000 Remaining",
  },
];

// ─── Printer-wise Receipt Chart Data ─────────────────────────────────────────
export interface PrinterReceiptData {
  printer: string;
  delivered: number;
  remaining: number;
}

export const printerReceiptChartData: PrinterReceiptData[] = [
  { printer: "Ajanta Packaging", delivered: 4320, remaining: 1080 },
  { printer: "G Tech Print Works", delivered: 1960, remaining: 540 },
  { printer: "Jayesh Printers", delivered: 1890, remaining: 610 },
  { printer: "Drishti Offset", delivered: 1380, remaining: 420 },
  { printer: "M.K. Offset", delivered: 1210, remaining: 390 },
  { printer: "Balaji Printers", delivered: 1160, remaining: 340 },
  { printer: "New Lakshmi", delivered: 1040, remaining: 260 },
  { printer: "Saraswati Press", delivered: 560, remaining: 140 },
];

// ─── Title-wise Stock Data ────────────────────────────────────────────────────
export interface TitleStockItem {
  id: number;
  title: string;
  classGroup: string;
  medium: string;
  receivedQty: number;
  issuedQty: number;
  balanceQty: number;
}

export const titleStockData: TitleStockItem[] = [
  {
    id: 1,
    title: "भाषा भारती (Hindi)",
    classGroup: "Class 1",
    medium: "Hindi",
    receivedQty: 45000,
    issuedQty: 38000,
    balanceQty: 7000,
  },
  {
    id: 2,
    title: "गणित (Mathematics)",
    classGroup: "Class 5",
    medium: "Hindi",
    receivedQty: 38500,
    issuedQty: 32000,
    balanceQty: 6500,
  },
  {
    id: 3,
    title: "विज्ञान (Science)",
    classGroup: "Class 8",
    medium: "Hindi",
    receivedQty: 29000,
    issuedQty: 24500,
    balanceQty: 4500,
  },
  {
    id: 4,
    title: "English Reader",
    classGroup: "Class 1",
    medium: "English",
    receivedQty: 22000,
    issuedQty: 18000,
    balanceQty: 4000,
  },
  {
    id: 5,
    title: "सामाजिक विज्ञान",
    classGroup: "Class 7",
    medium: "Hindi",
    receivedQty: 31000,
    issuedQty: 27500,
    balanceQty: 3500,
  },
  {
    id: 6,
    title: "एटग्रेड अभ्यास पुस्तिका",
    classGroup: "Class 8",
    medium: "Hindi",
    receivedQty: 18500,
    issuedQty: 15000,
    balanceQty: 3500,
  },
  {
    id: 7,
    title: "अकाउंटेन्सी (Part-1)",
    classGroup: "Class 12",
    medium: "English",
    receivedQty: 12000,
    issuedQty: 9800,
    balanceQty: 2200,
  },
];

// ─── Block-wise Supply Status ─────────────────────────────────────────────────
export interface BlockSupplyItem {
  id: number;
  block: string;
  challanNo: string;
  date: string;
  qty: number;
  status: "Pending" | "Dispatched" | "Acknowledged";
}

export const blockSupplyData: BlockSupplyItem[] = [
  {
    id: 1,
    block: "Huzur",
    challanNo: "CHL/2026/0118",
    date: "16 Aug 2026",
    qty: 24500,
    status: "Acknowledged",
  },
  {
    id: 2,
    block: "Bairasiya",
    challanNo: "CHL/2026/0119",
    date: "16 Aug 2026",
    qty: 18200,
    status: "Dispatched",
  },
  {
    id: 3,
    block: "Sanver",
    challanNo: "CHL/2026/0120",
    date: "15 Aug 2026",
    qty: 21000,
    status: "Acknowledged",
  },
  {
    id: 4,
    block: "Depalpur",
    challanNo: "CHL/2026/0121",
    date: "15 Aug 2026",
    qty: 16800,
    status: "Pending",
  },
  {
    id: 5,
    block: "Chitrangi",
    challanNo: "CHL/2026/0122",
    date: "14 Aug 2026",
    qty: 19200,
    status: "Acknowledged",
  },
];

// ─── Recent Activities ────────────────────────────────────────────────────────
export interface ActivityItem {
  id: number;
  time: string;
  action: string;
  detail: string;
  icon: string;
  color: string;
}

export const recentActivities: ActivityItem[] = [
  {
    id: 1,
    time: "11:30 AM",
    action: "Challan Received",
    detail: "Ajanta Packaging → 412 bundles, 65,591 books",
    icon: "pi pi-inbox",
    color: "text-blue-600",
  },
  {
    id: 2,
    time: "10:15 AM",
    action: "Dispatched to Block",
    detail: "Huzur Block ← 24,500 copies (CHL/2026/0118)",
    icon: "pi pi-send",
    color: "text-emerald-600",
  },
  {
    id: 3,
    time: "09:45 AM",
    action: "Receipt Acknowledged",
    detail: "Bairasiya Block confirmed 18,200 copies",
    icon: "pi pi-check-circle",
    color: "text-green-600",
  },
  {
    id: 4,
    time: "09:00 AM",
    action: "Challan Received",
    detail: "G Tech Print Works → 113 bundles, 17,540 books",
    icon: "pi pi-inbox",
    color: "text-blue-600",
  },
  {
    id: 5,
    time: "Yesterday",
    action: "Stock Updated",
    detail: "Physical verification completed — Warehouse 1",
    icon: "pi pi-database",
    color: "text-indigo-600",
  },
];
