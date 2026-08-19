import { dataManager } from "../../inventory/mockData";

export interface PrinterInfo {
  printerCode: string;
  printerName: string;
}

// Centralized resolver for authenticated printer
export const resolvePrinterDetails = (userId: string): PrinterInfo => {
  if (userId === "PRINTER ADMIN") {
    return {
      printerCode: "PRN-001",
      printerName: "ABC Printing Press",
    };
  }
  return {
    printerCode: "PRN-001",
    printerName: "ABC Printing Press",
  };
};

// Dynamic date calculator: calculates date difference dynamically relative to the execution day
export const getDaysRemaining = (dueDateStr: string): number => {
  const due = new Date(dueDateStr);
  const now = new Date();

  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Dynamically compute KPIs from the orders matching the resolved printer code
export const getPrinterDashboardStats = (printerCode: string) => {
  const orders = dataManager
    .getOrders()
    .filter((o) => o.printerCode === printerCode);
  const activeOrders = orders.filter(
    (o) => o.status !== "Cancelled" && o.status !== "Rejected",
  ).length;
  const inProgress = orders.filter(
    (o) => o.status === "Partially Supplied",
  ).length;

  const booksPrinted = orders.reduce((sum, o) => sum + o.suppliedQty, 0);
  const booksPending = orders.reduce((sum, o) => sum + o.pendingQty, 0);

  return {
    activeOrders,
    inProgress,
    booksPrinted,
    booksPending,
    paperAllocated: 126, // Metric Tonnes
    paperReceived: 98, // Metric Tonnes
    paperConsumed: 72, // Metric Tonnes
    supplyPending: 24500, // Quantities pending dispatch
  };
};

export interface GSMStatus {
  gsm: string;
  allocated: number;
  received: number;
  used: number;
  available: number;
}

// Paper & Material levels (reproduced from prompt specifications)
export const getPaperMaterialStatus = (printerCode: string) => {
  if (printerCode) {
    // Hook dynamic API/override logic here
  }
  return {
    allocated: 126,
    received: 98,
    consumed: 72,
    available: 26,
    gsmTable: [
      {
        gsm: "60 GSM",
        allocated: 40,
        received: 35,
        used: 25,
        available: 10,
      },
      {
        gsm: "70 GSM",
        allocated: 50,
        received: 40,
        used: 30,
        available: 10,
      },
      {
        gsm: "80 GSM",
        allocated: 36,
        received: 23,
        used: 17,
        available: 6,
      },
    ] as GSMStatus[],
  };
};

// Supply Status Bar items (for supply widgets)
export const getSupplyStatusItems = (printerCode: string) => {
  if (printerCode) {
    // Hook dynamic API/override logic here
  }
  return [
    {
      label: "Books Printed",
      value: 124500,
      total: 150000,
      color: "emerald",
      icon: "print",
    },
    {
      label: "Ready for Supply",
      value: 82000,
      total: 150000,
      color: "blue",
      icon: "box",
    },
    {
      label: "Dispatched",
      value: 65000,
      total: 150000,
      color: "purple",
      icon: "send",
    },
    {
      label: "Pending Dispatch",
      value: 17000,
      total: 150000,
      color: "amber",
      icon: "clock",
    },
  ];
};

// Monthly Printing Performance data (ordered vs printed vs supplied)
export const getMonthlyPrintingPerformance = (printerCode: string) => {
  if (printerCode) {
    // Hook dynamic API/override logic here
  }
  return [
    { month: "Mar", ordered: 100, printed: 75, supplied: 55 },
    { month: "Apr", ordered: 125, printed: 80, supplied: 60 },
    { month: "May", ordered: 150, printed: 105, supplied: 68 },
    { month: "Jun", ordered: 155, printed: 110, supplied: 75 },
    { month: "Jul", ordered: 165, printed: 112, supplied: 78 },
    { month: "Aug", ordered: 170, printed: 135, supplied: 65 },
  ];
};

// Payment Overview Donut Breakdown centered at ₹85.50 L
export const getPaymentOverviewData = (printerCode: string) => {
  if (printerCode) {
    // Hook dynamic API/override logic here
  }
  return {
    totalValue: 85.5, // Lakhs
    breakdown: [
      { label: "Paid", value: 53.7, percent: "63%", color: "#10B981" },
      { label: "Pending", value: 18.5, percent: "22%", color: "#F59E0B" },
      {
        label: "Under Processing",
        value: 13.3,
        percent: "15%",
        color: "#8B5CF6",
      },
    ],
  };
};

// Alerts & Notifications data
export const getPrinterAlerts = (printerCode: string) => {
  if (printerCode) {
    // Hook dynamic API/override logic here
  }
  return [
    {
      type: "warning",
      message: "Paper shortage",
      description: "PO-2026-003 requires 8 MT additional paper.",
      time: "10 min ago",
    },
    {
      type: "warning",
      message: "Order deadline approaching",
      description: "PO-2026-002 is due soon.",
      time: "30 min ago",
    },
    {
      type: "info",
      message: "Paper received",
      description: "12 MT paper received against PO-2026-001.",
      time: "1 hour ago",
    },
    {
      type: "success",
      message: "Payment processed",
      description: "₹5.20 L payment processed for Invoice INV-1024.",
      time: "2 hours ago",
    },
  ];
};

// Quick Action shortcuts linked to actual, resolved routes
export const printerQuickActions = [
  {
    label: "Register / Update Printer",
    icon: "id-card",
    path: "/printing/printer-registration",
  },
  {
    label: "View Printer Orders",
    icon: "print",
    path: "/printing/orders/list",
  },
  {
    label: "View Pending Orders",
    icon: "clock",
    path: "/printing/orders/pending",
  },
  {
    label: "Record Paper Receiving",
    icon: "download",
    path: "/paper-receiving",
  },
  { label: "View Tender", icon: "file", path: "/tender" },
  { label: "Manage Supply", icon: "send", path: "/supply-section" },
  { label: "Submit Invoice", icon: "wallet", path: "/payment" },
  { label: "View Payments", icon: "money-bill", path: "/payment" },
];
