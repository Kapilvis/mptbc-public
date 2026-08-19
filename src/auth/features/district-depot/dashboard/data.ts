import type { KpiMetric } from "auth/features/distribution/dashboard/data";

// Re-export the KpiMetric type for local use
export type { KpiMetric };

// ─── Depot Dashboard KPI Metrics ─────────────────────────────────────────────
export const depotKpiMetrics: KpiMetric[] = [
  {
    title: "Total Stock in Depot",
    value: "25,000",
    stats: [
      { label: "Received", value: "75,000" },
      { label: "Dispatched", value: "50,000" },
      { label: "Stock", value: "25,000" },
    ],
    subText: "",
    icon: "pi pi-book",
    theme: "indigo",
    type: "net-demand",
  },
  {
    title: "Printer-Wise Allotment",
    value: "75,000",
    stats: [
      { label: "Allotted", value: "85,000" },
      { label: "Received", value: "75,000" },
      { label: "Pending", value: "10,000" },
    ],
    subText: "",
    icon: "pi pi-print",
    theme: "blue",
    type: "dispatch-rate",
  },
  {
    title: "Dispatch to Blocks",
    value: "60,000",
    stats: [
      { label: "Demand", value: "60,000" },
      { label: "Dispatched", value: "50,000" },
      { label: "Pending", value: "10,000" },
    ],
    subText: "",
    icon: "pi pi-truck",
    theme: "emerald",
    type: "brc-rate",
  },
];

// ─── Printer-wise Receipt Chart Data ─────────────────────────────────────────
export interface PrinterReceiptData {
  printer: string;
  delivered: number;
  remaining: number;
}

export const printerReceiptChartData: PrinterReceiptData[] = [
  { printer: "Ajanta Packaging", delivered: 22000, remaining: 3000 },
  { printer: "G Tech Print Works", delivered: 15000, remaining: 2000 },
  { printer: "Jayesh Printers", delivered: 12000, remaining: 2000 },
  { printer: "Drishti Offset", delivered: 9000, remaining: 1000 },
  { printer: "M.K. Offset", delivered: 7000, remaining: 1000 },
  { printer: "Balaji Printers", delivered: 5000, remaining: 500 },
  { printer: "New Lakshmi", delivered: 3000, remaining: 300 },
  { printer: "Saraswati Press", delivered: 2000, remaining: 200 },
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
    receivedQty: 18000,
    issuedQty: 12000,
    balanceQty: 6000,
  },
  {
    id: 2,
    title: "गणित (Mathematics)",
    classGroup: "Class 5",
    medium: "Hindi",
    receivedQty: 15000,
    issuedQty: 10000,
    balanceQty: 5000,
  },
  {
    id: 3,
    title: "विज्ञान (Science)",
    classGroup: "Class 8",
    medium: "Hindi",
    receivedQty: 12000,
    issuedQty: 8000,
    balanceQty: 4000,
  },
  {
    id: 4,
    title: "English Reader",
    classGroup: "Class 1",
    medium: "English",
    receivedQty: 10000,
    issuedQty: 7000,
    balanceQty: 3000,
  },
  {
    id: 5,
    title: "सामाजिक विज्ञान",
    classGroup: "Class 7",
    medium: "Hindi",
    receivedQty: 9000,
    issuedQty: 6000,
    balanceQty: 3000,
  },
  {
    id: 6,
    title: "एटग्रेड अभ्यास पुस्तिका",
    classGroup: "Class 8",
    medium: "Hindi",
    receivedQty: 6000,
    issuedQty: 4000,
    balanceQty: 2000,
  },
  {
    id: 7,
    title: "अकाउंटेन्सी (Part-1)",
    classGroup: "Class 12",
    medium: "English",
    receivedQty: 5000,
    issuedQty: 3000,
    balanceQty: 2000,
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
    qty: 15000,
    status: "Acknowledged",
  },
  {
    id: 2,
    block: "Bairasiya",
    challanNo: "CHL/2026/0119",
    date: "16 Aug 2026",
    qty: 12000,
    status: "Dispatched",
  },
  {
    id: 3,
    block: "Sanver",
    challanNo: "CHL/2026/0120",
    date: "15 Aug 2026",
    qty: 10000,
    status: "Acknowledged",
  },
  {
    id: 4,
    block: "Depalpur",
    challanNo: "CHL/2026/0121",
    date: "15 Aug 2026",
    qty: 8000,
    status: "Pending",
  },
  {
    id: 5,
    block: "Chitrangi",
    challanNo: "CHL/2026/0122",
    date: "14 Aug 2026",
    qty: 5000,
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
