export interface FinanceKpis {
  totalBudget: string; // ₹ 500.00 Crore
  budgetUtilized: string; // ₹ 320.00 Crore
  remainingBudget: string; // ₹ 180.00 Crore
  utilizationRate: number; // 64.0%
  pendingBillsCount: number; // 18 Bills
  pendingBillsAmount: string; // ₹ 12.45 Crore
  monthlyPayroll: string; // ₹ 20.00 Lakhs
  ifmisGrantUtilization: number; // 64.0%
}

export interface BillDeductions {
  tdsIncomeTax2pc: number;
  tdsGst2pc: number;
  paperWastagePenalty: number;
  lateDeliveryPenaltyLd: number;
  securityDepositRetention: number;
}

export interface VendorDetails {
  vendorId: string;
  vendorName: string;
  gstin: string;
  ifmisCode: string;
  bankAccount: string;
}

export interface LinkedOperationalData {
  purchaseOrderNo: string;
  titlesPrinted?: string[];
  quantityDelivered?: number;
  depotReceiptChallan?: string;
  paperAllocationMt?: number;
  depotName?: string;
  schemeName?: string;
}

export interface ApprovalWorkflow {
  verifiedByAccountsOfficer: boolean;
  auditedByInternalAudit: boolean;
  sanctionedByCfo: boolean;
  treasuryIfmisStatus:
    | "VOUCHER_PASSED_DISBURSED"
    | "PENDING_AUDIT"
    | "TOKEN_GENERATED"
    | "HOLD";
  treasuryTokenNo: string;
}

export interface FinancialBillItem {
  id: string;
  financialYear: string;
  voucherReference: string;
  voucherDate: string;
  category:
    | "PRINTER_FINAL_BILL"
    | "PAPER_VENDOR_BILL"
    | "DEPOT_FREIGHT_BILL"
    | "SCHEME_GRANT_REVENUE"
    | "HRMS_PAYROLL_VOUCHER";
  categoryLabel: string;
  vendorDetails: VendorDetails;
  linkedOperationalData: LinkedOperationalData;
  grossBillAmount: number;
  deductions: BillDeductions;
  netPayableAmount: number;
  approvalWorkflow: ApprovalWorkflow;
}

export interface CashFlowMonthlyPoint {
  month: string;
  receiptsLakhs: number;
  expenditureLakhs: number;
}

export interface ExpenditureOutlayItem {
  category: string;
  amountCr: number;
  percentage: number;
  color: string;
}

// ─── MOCK DATASETS ─────────────────────────────────────────────────────────────

export const initialFinanceKpis: FinanceKpis = {
  totalBudget: "₹ 500.00 Cr",
  budgetUtilized: "₹ 320.00 Cr",
  remainingBudget: "₹ 180.00 Cr",
  utilizationRate: 64.0,
  pendingBillsCount: 18,
  pendingBillsAmount: "₹ 12.45 Cr",
  monthlyPayroll: "₹ 20.00 Lakhs",
  ifmisGrantUtilization: 64.0,
};

export const cashFlowTrendData: CashFlowMonthlyPoint[] = [
  { month: "Apr 2025", receiptsLakhs: 3800, expenditureLakhs: 2450 },
  { month: "May 2025", receiptsLakhs: 4100, expenditureLakhs: 2680 },
  { month: "Jun 2025", receiptsLakhs: 4500, expenditureLakhs: 2950 },
  { month: "Jul 2025", receiptsLakhs: 4200, expenditureLakhs: 2700 },
  { month: "Aug 2025", receiptsLakhs: 4600, expenditureLakhs: 2900 },
  { month: "Sep 2025", receiptsLakhs: 3900, expenditureLakhs: 2500 },
  { month: "Oct 2025", receiptsLakhs: 4300, expenditureLakhs: 2750 },
  { month: "Nov 2025", receiptsLakhs: 4150, expenditureLakhs: 2650 },
  { month: "Dec 2025", receiptsLakhs: 3950, expenditureLakhs: 2550 },
  { month: "Jan 2026", receiptsLakhs: 4400, expenditureLakhs: 2800 },
  { month: "Feb 2026", receiptsLakhs: 4000, expenditureLakhs: 2550 },
  { month: "Mar 2026", receiptsLakhs: 4100, expenditureLakhs: 2520 },
];

export const expenditureOutlayData: ExpenditureOutlayItem[] = [
  {
    category: "Paper Procurement (Paper Mills)",
    amountCr: 160.0,
    percentage: 50.0,
    color: "#006A38",
  },
  {
    category: "Printing & Binding POs (Printers)",
    amountCr: 134.4,
    percentage: 42.0,
    color: "#2563eb",
  },
  {
    category: "Depot Logistics & Freight",
    amountCr: 23.2,
    percentage: 7.25,
    color: "#8b5cf6",
  },
  {
    category: "HRMS Staff Payroll & EPF (85 Staff)",
    amountCr: 2.4,
    percentage: 0.75,
    color: "#f59e0b",
  },
];

export const initialPendingBills: FinancialBillItem[] = [
  {
    id: "VCH-2026-8821",
    financialYear: "2026-2027",
    voucherReference: "MPTBC/FIN/2026/VCH-8821",
    voucherDate: "2026-08-22",
    category: "PRINTER_FINAL_BILL",
    categoryLabel: "Printer Final Bill",
    vendorDetails: {
      vendorId: "PRN-GTECH-002",
      vendorName: "G Tech Print Works",
      gstin: "23AAACG1234F1Z2",
      ifmisCode: "MPVND99201",
      bankAccount: "SBI A/c ****9812 (Bhopal Main)",
    },
    linkedOperationalData: {
      purchaseOrderNo: "PO-2026-B02",
      titlesPrinted: ["Hindi Class 8", "Science Class 9"],
      quantityDelivered: 285000,
      depotReceiptChallan: "CHL-IND-2026-0118",
    },
    grossBillAmount: 4250000,
    deductions: {
      tdsIncomeTax2pc: 85000,
      tdsGst2pc: 85000,
      paperWastagePenalty: 12500,
      lateDeliveryPenaltyLd: 25000,
      securityDepositRetention: 212500,
    },
    netPayableAmount: 3830000,
    approvalWorkflow: {
      verifiedByAccountsOfficer: true,
      auditedByInternalAudit: true,
      sanctionedByCfo: false,
      treasuryIfmisStatus: "TOKEN_GENERATED",
      treasuryTokenNo: "TREAS-BPL-2026-99210",
    },
  },
  {
    id: "VCH-2026-8822",
    financialYear: "2026-2027",
    voucherReference: "MPTBC/FIN/2026/VCH-8822",
    voucherDate: "2026-08-21",
    category: "PAPER_VENDOR_BILL",
    categoryLabel: "Paper Reel Supply Bill",
    vendorDetails: {
      vendorId: "PPR-ORIENT-001",
      vendorName: "Orient Paper Mills Ltd.",
      gstin: "23AAACO4412K1Z9",
      ifmisCode: "MPVND77104",
      bankAccount: "HDFC A/c ****4410 (Amlai Branch)",
    },
    linkedOperationalData: {
      purchaseOrderNo: "PO-PPR-2026-04",
      paperAllocationMt: 1250,
      depotReceiptChallan: "CHL-CENTRAL-2026-99",
    },
    grossBillAmount: 18500000,
    deductions: {
      tdsIncomeTax2pc: 370000,
      tdsGst2pc: 370000,
      paperWastagePenalty: 0,
      lateDeliveryPenaltyLd: 0,
      securityDepositRetention: 925000,
    },
    netPayableAmount: 16835000,
    approvalWorkflow: {
      verifiedByAccountsOfficer: true,
      auditedByInternalAudit: true,
      sanctionedByCfo: true,
      treasuryIfmisStatus: "VOUCHER_PASSED_DISBURSED",
      treasuryTokenNo: "TREAS-BPL-2026-99211",
    },
  },
  {
    id: "VCH-2026-8823",
    financialYear: "2026-2027",
    voucherReference: "MPTBC/FIN/2026/VCH-8823",
    voucherDate: "2026-08-20",
    category: "DEPOT_FREIGHT_BILL",
    categoryLabel: "Inter-Depot Transit Freight",
    vendorDetails: {
      vendorId: "LOG-MPCARGO-009",
      vendorName: "MP Logistics & Freight Carrier",
      gstin: "23AABCM8821P1Z4",
      ifmisCode: "MPVND33190",
      bankAccount: "ICICI A/c ****1129 (Gwalior Branch)",
    },
    linkedOperationalData: {
      purchaseOrderNo: "TRN-2026-Z09",
      depotName: "Jabalpur Regional Depot (51 Depots Matrix)",
      depotReceiptChallan: "CHL-JBP-2026-084",
    },
    grossBillAmount: 1240000,
    deductions: {
      tdsIncomeTax2pc: 24800,
      tdsGst2pc: 24800,
      paperWastagePenalty: 0,
      lateDeliveryPenaltyLd: 15000,
      securityDepositRetention: 62000,
    },
    netPayableAmount: 1113400,
    approvalWorkflow: {
      verifiedByAccountsOfficer: true,
      auditedByInternalAudit: false,
      sanctionedByCfo: false,
      treasuryIfmisStatus: "PENDING_AUDIT",
      treasuryTokenNo: "TREAS-BPL-2026-99212",
    },
  },
  {
    id: "VCH-2026-8824",
    financialYear: "2026-2027",
    voucherReference: "MPTBC/FIN/2026/VCH-8824",
    voucherDate: "2026-08-19",
    category: "HRMS_PAYROLL_VOUCHER",
    categoryLabel: "HRMS Staff Salary Disbursal",
    vendorDetails: {
      vendorId: "HRMS-MP-001",
      vendorName: "MP TBC Treasury Salary Escrow",
      gstin: "23GOVMP00000001",
      ifmisCode: "MPTBCP001",
      bankAccount: "SBI Treasury Escrow A/c ****0012",
    },
    linkedOperationalData: {
      purchaseOrderNo: "HRMS-PAY-AUG-2026",
      schemeName: "85 Active Staff (Class I-IV & Contract)",
    },
    grossBillAmount: 2000000,
    deductions: {
      tdsIncomeTax2pc: 90000,
      tdsGst2pc: 0,
      paperWastagePenalty: 0,
      lateDeliveryPenaltyLd: 0,
      securityDepositRetention: 200000, // NPS / GPF remittance
    },
    netPayableAmount: 1710000,
    approvalWorkflow: {
      verifiedByAccountsOfficer: true,
      auditedByInternalAudit: true,
      sanctionedByCfo: true,
      treasuryIfmisStatus: "VOUCHER_PASSED_DISBURSED",
      treasuryTokenNo: "TREAS-BPL-2026-99213",
    },
  },
  {
    id: "VCH-2026-8825",
    financialYear: "2026-2027",
    voucherReference: "MPTBC/FIN/2026/VCH-8825",
    voucherDate: "2026-08-18",
    category: "SCHEME_GRANT_REVENUE",
    categoryLabel: "RSK / DPI Scheme Grant Transfer",
    vendorDetails: {
      vendorId: "SCH-RSK-MP-001",
      vendorName: "Rajya Shiksha Kendra (RSK Grant)",
      gstin: "23GOVRSK0000129",
      ifmisCode: "MPGRANT441",
      bankAccount: "MP Govt IFMIS Treasury Pool A/c",
    },
    linkedOperationalData: {
      purchaseOrderNo: "GRANT-RSK-2026-Q2",
      schemeName: "Free Textbook Supply Scheme (Elementary)",
    },
    grossBillAmount: 85000000,
    deductions: {
      tdsIncomeTax2pc: 0,
      tdsGst2pc: 0,
      paperWastagePenalty: 0,
      lateDeliveryPenaltyLd: 0,
      securityDepositRetention: 0,
    },
    netPayableAmount: 85000000,
    approvalWorkflow: {
      verifiedByAccountsOfficer: true,
      auditedByInternalAudit: true,
      sanctionedByCfo: true,
      treasuryIfmisStatus: "VOUCHER_PASSED_DISBURSED",
      treasuryTokenNo: "TREAS-BPL-2026-99214",
    },
  },
];
