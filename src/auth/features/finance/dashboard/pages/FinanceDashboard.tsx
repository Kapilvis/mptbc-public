import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { Modal } from "shared/components/popups";
import Grid from "shared/components/grid/Grid";
import { DropDownList } from "shared/components/forms";
import {
  initialFinanceKpis,
  expenditureOutlayData,
  initialPendingBills,
  type FinancialBillItem,
} from "../data";

type FinanceTabType = "EXECUTIVE" | "BILL_CLEARING";

const financialYearOptions = [
  { label: "2026 - 2027", value: "2026-2027" },
  { label: "2025 - 2026", value: "2025-2026" },
  { label: "2024 - 2025", value: "2024-2025" },
];

const categoryFilterOptions = [
  { label: "All Bill Categories", value: "ALL" },
  { label: "Printer Final Bills", value: "PRINTER_FINAL_BILL" },
  { label: "Paper Vendor Bills", value: "PAPER_VENDOR_BILL" },
  { label: "Depot Freight Bills", value: "DEPOT_FREIGHT_BILL" },
  { label: "HRMS Payroll Vouchers", value: "HRMS_PAYROLL_VOUCHER" },
  { label: "Scheme Grant Revenue", value: "SCHEME_GRANT_REVENUE" },
];

const statusFilterOptions = [
  { label: "All IFMIS Statuses", value: "ALL" },
  { label: "Disbursed / Passed", value: "VOUCHER_PASSED_DISBURSED" },
  { label: "Token Generated", value: "TOKEN_GENERATED" },
  { label: "Pending Audit", value: "PENDING_AUDIT" },
];

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState<FinanceTabType>("EXECUTIVE");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026-2027");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Interactive Bill Clearance State
  const [bills, setBills] = useState<FinancialBillItem[]>(initialPendingBills);
  const [selectedBillForAudit, setSelectedBillForAudit] =
    useState<FinancialBillItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filtered Bills List
  const filteredBills = useMemo(() => {
    return bills.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "ALL" ||
        item.approvalWorkflow.treasuryIfmisStatus === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.voucherReference.toLowerCase().includes(q) ||
        item.vendorDetails.vendorName.toLowerCase().includes(q) ||
        item.vendorDetails.gstin.toLowerCase().includes(q) ||
        item.vendorDetails.ifmisCode.toLowerCase().includes(q) ||
        item.linkedOperationalData.purchaseOrderNo.toLowerCase().includes(q);

      return matchesCategory && matchesStatus && matchesQuery;
    });
  }, [bills, selectedCategory, selectedStatus, searchQuery]);

  const handleBillDecision = (
    billId: string,
    status: "VOUCHER_PASSED_DISBURSED" | "HOLD",
    vendorName: string,
  ) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          return {
            ...b,
            approvalWorkflow: {
              ...b.approvalWorkflow,
              sanctionedByCfo: status === "VOUCHER_PASSED_DISBURSED",
              treasuryIfmisStatus: status,
            },
          };
        }
        return b;
      }),
    );

    setActionNotice(
      `Voucher ${billId} for ${vendorName} updated: ${
        status === "VOUCHER_PASSED_DISBURSED"
          ? "Passed & Disbursed to Treasury"
          : "Placed on Audit Hold"
      }`,
    );

    setTimeout(() => setActionNotice(null), 4500);
  };

  // Table Columns for Ledger Grid (Slightly larger font & darker secondary black text)
  const ledgerColumns: Controls.ColumnProps<FinancialBillItem>[] = useMemo(
    () => [
      {
        field: "voucherReference",
        header: "VOUCHER REF / DATE",
        width: "185px",
        cell: (item: FinancialBillItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-extrabold text-[#006A38] text-xs font-mono">
              {item.voucherReference}
            </span>
            <span className="text-xs text-slate-800 font-bold">
              Date: {item.voucherDate}
            </span>
          </div>
        ),
      },
      {
        field: "category",
        header: "CATEGORY",
        width: "160px",
        cell: (item: FinancialBillItem) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              item.category === "PRINTER_FINAL_BILL"
                ? "bg-blue-100 text-blue-900 border border-blue-300"
                : item.category === "PAPER_VENDOR_BILL"
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : item.category === "HRMS_PAYROLL_VOUCHER"
                    ? "bg-purple-100 text-purple-900 border border-purple-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            {item.categoryLabel}
          </span>
        ),
      },
      {
        field: "vendorDetails",
        header: "VENDOR / OPERATIONAL LINK",
        width: "240px",
        cell: (item: FinancialBillItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-extrabold text-slate-900 text-xs">
              {item.vendorDetails.vendorName}
            </span>
            <span className="text-xs font-bold text-slate-800">
              GSTIN: {item.vendorDetails.gstin} | PO:{" "}
              {item.linkedOperationalData.purchaseOrderNo}
            </span>
          </div>
        ),
      },
      {
        field: "grossBillAmount",
        header: "GROSS BILL",
        width: "135px",
        cell: (item: FinancialBillItem) => (
          <span className="font-bold text-slate-900 text-xs">
            ₹ {item.grossBillAmount.toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        field: "deductions",
        header: "DEDUCTIONS (TDS/LD)",
        width: "170px",
        cell: (item: FinancialBillItem) => {
          const totalDeductions =
            item.deductions.tdsIncomeTax2pc +
            item.deductions.tdsGst2pc +
            item.deductions.paperWastagePenalty +
            item.deductions.lateDeliveryPenaltyLd +
            item.deductions.securityDepositRetention;
          return (
            <div className="flex flex-col space-y-0.5">
              <span className="font-black text-rose-700 text-xs">
                - ₹ {totalDeductions.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-800 font-bold">
                (TDS 2% + LD + Retention)
              </span>
            </div>
          );
        },
      },
      {
        field: "netPayableAmount",
        header: "NET PAYABLE",
        width: "145px",
        cell: (item: FinancialBillItem) => (
          <span className="font-black text-[#006A38] text-xs">
            ₹ {item.netPayableAmount.toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        field: "approvalWorkflow",
        header: "IFMIS TOKEN STATUS",
        width: "170px",
        cell: (item: FinancialBillItem) => {
          const st = item.approvalWorkflow.treasuryIfmisStatus;
          return (
            <div className="flex flex-col items-start gap-0.5">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  st === "VOUCHER_PASSED_DISBURSED"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : st === "TOKEN_GENERATED"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : st === "HOLD"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                {st.replace(/_/g, " ")}
              </span>
              <span className="text-xs font-bold text-slate-800">
                Token: {item.approvalWorkflow.treasuryTokenNo}
              </span>
            </div>
          );
        },
      },
      {
        field: "id",
        header: "ACTION",
        width: "120px",
        cell: (item: FinancialBillItem) => (
          <Button
            label="View Audit"
            icon="pi pi-file"
            size="small"
            variant="outlined"
            onClick={() => setSelectedBillForAudit(item)}
            className="text-xs font-bold"
          />
        ),
      },
    ],
    [],
  );

  return (
    <Page
      header="Finance Dashboard"
      subHeader="Madhya Pradesh Textbook Corporation — Government Treasury IFMIS Sync, Vendor Bill Clearing & Expenditure Control Desk."
      showHeaderActions
    >
      {/* ─── TOP HEADER BAR (SEARCH, COMPACT TABS & FY DROPDOWN) ──────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Voucher, Vendor, GSTIN, PO..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#006A38]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          {/* Tab Switcher Pills */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab("EXECUTIVE")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === "EXECUTIVE"
                  ? "bg-[#006A38] text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("BILL_CLEARING")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === "BILL_CLEARING"
                  ? "bg-[#006A38] text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Bill Desk
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-900 text-white">
                {filteredBills.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <i className="pi pi-calendar text-[#006A38] text-sm" />
              FY:
            </label>
            <div className="w-36">
              <DropDownList
                data={financialYearOptions}
                value={selectedYear}
                onChange={(val: unknown) =>
                  setSelectedYear(String(val ?? "2026-2027"))
                }
                textField="label"
                optionValue="value"
                filter={false}
              />
            </div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <i className="pi pi-check-circle text-emerald-600 text-base" />
          {actionNotice}
        </div>
      )}

      {/* ─── 5 EXECUTIVE FINANCIAL KPI CARDS (NUMBERS & DATA FOCUS) ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* KPI 1: Total Sanctioned Budget */}
        <div className="bg-[#f0f7ff] border border-[#bcd7ff] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                1. TOTAL BUDGET
              </span>
              <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full border border-blue-300">
                ₹ 500 Cr
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {initialFinanceKpis.totalBudget}
            </div>

            <div className="grid grid-cols-3 gap-1 text-left mt-2.5 pt-2 border-t border-[#bfdbfe]">
              <div>
                <span className="text-[9.5px] font-bold text-blue-800 uppercase block">
                  RSK GRANT
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 310.0 Cr
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-emerald-800 uppercase block">
                  DPI GRANT
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 140.0 Cr
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-slate-700 uppercase block">
                  COMMERCIAL
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 50.0 Cr
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Sanctioned Budget:{" "}
            <strong className="text-slate-900 font-black">₹ 500.00 Cr</strong>
          </div>
        </div>

        {/* KPI 2: Budget Utilized (Expenditure) */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                2. BUDGET UTILIZED
              </span>
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300">
                64% Utilized
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {initialFinanceKpis.budgetUtilized}
            </div>

            <div className="grid grid-cols-4 gap-1 text-left mt-2.5 pt-2 border-t border-[#bbf7d0]">
              <div>
                <span className="text-[9px] font-bold text-emerald-900 uppercase block">
                  PAPER
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 160.0 Cr
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-blue-900 uppercase block">
                  PRINT
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 134.4 Cr
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-purple-900 uppercase block">
                  FREIGHT
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 23.2 Cr
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-amber-900 uppercase block">
                  PAYROLL
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 2.4 Cr
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Disbursed via Treasury:{" "}
            <strong className="text-emerald-900 font-black">₹ 320.00 Cr</strong>
          </div>
        </div>

        {/* KPI 3: Remaining Budget Balance */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                3. REMAINING BUDGET
              </span>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                36% Balance
              </span>
            </div>
            <div className="text-xl font-black text-amber-950 mt-1">
              {initialFinanceKpis.remainingBudget}
            </div>

            <div className="grid grid-cols-3 gap-1 text-left mt-2.5 pt-2 border-t border-[#fde68a]">
              <div>
                <span className="text-[9.5px] font-bold text-blue-900 uppercase block">
                  UNALLOCATED
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 110.0 Cr
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-emerald-900 uppercase block">
                  CONTINGENCY
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 50.0 Cr
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-purple-900 uppercase block">
                  RESERVE
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 20.0 Cr
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-amber-950 mt-2">
            Remaining Balance:{" "}
            <strong className="text-amber-900 font-black">₹ 180.00 Cr</strong>
          </div>
        </div>

        {/* KPI 4: Monthly Payroll Commitment */}
        <div className="bg-[#faf5ff] border border-[#e9d5ff] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                4. HRMS PAYROLL SYNC
              </span>
              <span className="text-xs font-extrabold bg-purple-100 text-purple-900 px-2.5 py-1 rounded-full border border-purple-300">
                85 Staff
              </span>
            </div>
            <div className="text-xl font-black text-purple-950 mt-1">
              ₹ 20.00 Lakhs / Mo
            </div>

            <div className="grid grid-cols-3 gap-1 text-left mt-2.5 pt-2 border-t border-[#e9d5ff]">
              <div>
                <span className="text-[9.5px] font-bold text-emerald-900 uppercase block">
                  PERMANENT
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 13.80 L
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-indigo-900 uppercase block">
                  SAMVIDA
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 4.60 L
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-slate-700 uppercase block">
                  OUTSOURCE
                </span>
                <div className="text-xs font-black text-slate-900">
                  ₹ 1.60 L
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Annualized Payroll:{" "}
            <strong className="text-purple-900 font-black">₹ 2.40 Cr</strong>
          </div>
        </div>

        {/* KPI 5: Pending Bills Queue */}
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                5. PENDING BILLS QUEUE
              </span>
              <span className="text-xs font-extrabold bg-sky-100 text-sky-900 px-2.5 py-1 rounded-full border border-sky-300">
                18 Pending
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              ₹ 12.45 Cr
            </div>

            <div className="grid grid-cols-3 gap-1 text-left mt-2.5 pt-2 border-t border-[#bae6fd]">
              <div>
                <span className="text-[9.5px] font-bold text-blue-900 uppercase block">
                  PRINTERS
                </span>
                <div className="text-xs font-black text-slate-900">
                  10 (₹ 7.25Cr)
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-emerald-900 uppercase block">
                  PAPER
                </span>
                <div className="text-xs font-black text-slate-900">
                  5 (₹ 3.80Cr)
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-purple-900 uppercase block">
                  FREIGHT
                </span>
                <div className="text-xs font-black text-slate-900">
                  3 (₹ 1.40Cr)
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Pending Sanction:{" "}
            <strong className="text-sky-900 font-black">18 Bills</strong>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: EXECUTIVE VIEW (PROJECT OPERATIONAL FLOW DISBURSEMENTS) ── */}
      {activeTab === "EXECUTIVE" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left 2 Cols: Operational Funds Inflow vs Sector Outflow Receipts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-receipt text-[#006A38]" />
                  Grant Inflow & Sector Outflows
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  State Treasury Inflow Grant Receipts mapped to Paper Mills,
                  Printers, Payroll & Depot Freight.
                </p>
              </div>
              <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                FY26 Total Outflow: ₹ 320.00 Cr
              </span>
            </div>

            {/* Operational Funds Flow Matrix (4-Column Metric Summary) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {/* Paper Procurement */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-900 uppercase">
                    <span>PAPER MILLS</span>
                    <span className="bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      50% Outlay
                    </span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ₹ 160.00 Cr
                  </div>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    10.0K MT Reels Delivered
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 text-[11px] font-extrabold text-emerald-950 flex justify-between">
                  <span>Orient & Star Paper</span>
                  <span>100% Paid</span>
                </div>
              </div>

              {/* Printing POs */}
              <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-blue-900 uppercase">
                    <span>PRINTER POS</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                      42% Outlay
                    </span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ₹ 134.40 Cr
                  </div>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    4.50 Cr Books Printed
                  </span>
                </div>
                <div className="pt-2 border-t border-blue-200 text-[11px] font-extrabold text-blue-950 flex justify-between">
                  <span>Class 1-12 Printers</span>
                  <span>100% Paid</span>
                </div>
              </div>

              {/* Depot Freight */}
              <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-purple-900 uppercase">
                    <span>DEPOT FREIGHT</span>
                    <span className="bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                      7.25% Outlay
                    </span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ₹ 23.20 Cr
                  </div>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    51 Regional Depots
                  </span>
                </div>
                <div className="pt-2 border-t border-purple-200 text-[11px] font-extrabold text-purple-950 flex justify-between">
                  <span>Transit Logistics</span>
                  <span>100% Paid</span>
                </div>
              </div>

              {/* HRMS Payroll */}
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-amber-900 uppercase">
                    <span>HRMS PAYROLL</span>
                    <span className="bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      0.75% Outlay
                    </span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ₹ 2.40 Cr
                  </div>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    85 Active Staff
                  </span>
                </div>
                <div className="pt-2 border-t border-amber-200 text-[11px] font-extrabold text-amber-950 flex justify-between">
                  <span>₹ 20.00 Lakhs / Month</span>
                  <span>100% Paid</span>
                </div>
              </div>
            </div>

            {/* Vertical Column Sector Disbursement Comparison Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Sector Expenditure vs Physical Deliverables
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Budget Disbursed (₹ Cr) mapped against verified physical
                    assets & services received.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                  FY26 Disbursed Outflow
                </span>
              </div>

              <div className="relative h-64 flex items-end justify-between gap-3 pt-8 pb-4 px-6 bg-white rounded-xl border border-slate-200/80">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-x-6 top-10 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-slate-400 bg-white pr-2">
                    ₹ 160 Cr
                  </span>
                </div>
                <div className="absolute inset-x-6 top-24 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-slate-400 bg-white pr-2">
                    ₹ 120 Cr
                  </span>
                </div>
                <div className="absolute inset-x-6 top-38 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-slate-400 bg-white pr-2">
                    ₹ 60 Cr
                  </span>
                </div>

                {[
                  {
                    name: "Paper Procurement",
                    val: "₹ 160.00 Cr",
                    height: "88%",
                    color: "#006A38",
                    sub: "10.0K MT Paper Reels",
                  },
                  {
                    name: "Textbook Printers",
                    val: "₹ 134.40 Cr",
                    height: "74%",
                    color: "#2563eb",
                    sub: "4.50 Cr Books Printed",
                  },
                  {
                    name: "Depot Freight",
                    val: "₹ 23.20 Cr",
                    height: "22%",
                    color: "#8b5cf6",
                    sub: "51 Regional Depots",
                  },
                  {
                    name: "HRMS Staff Payroll",
                    val: "₹ 2.40 Cr",
                    height: "12%",
                    color: "#f59e0b",
                    sub: "85 Active Staff",
                  },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end z-10"
                  >
                    <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {bar.val}
                    </span>
                    <div
                      className="w-14 max-w-[56px] rounded-t-xl transition-all duration-300 shadow-sm hover:brightness-105"
                      style={{
                        height: bar.height,
                        backgroundColor: bar.color,
                      }}
                    />
                    <div className="text-center space-y-0.5 mt-1">
                      <span className="text-xs font-extrabold text-slate-900 block truncate max-w-[130px]">
                        {bar.name}
                      </span>
                      <span className="inline-block text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {bar.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Expenditure Outlay Donut Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-chart-pie text-[#006A38]" />
                  Expenditure Outlay Breakdown
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ₹ 320.00 Cr Total
                </span>
              </div>

              {/* Donut Visual */}
              <div className="flex items-center justify-center my-4">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#f1f5f9"
                      strokeWidth="14"
                      fill="transparent"
                    />
                    {/* Paper 50.0% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#006A38"
                      strokeWidth="14"
                      strokeDasharray="119.38 238.76"
                      strokeDashoffset="0"
                      fill="transparent"
                    />
                    {/* Printing 42.0% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#2563eb"
                      strokeWidth="14"
                      strokeDasharray="100.28 238.76"
                      strokeDashoffset="-119.38"
                      fill="transparent"
                    />
                    {/* Depot Freight 7.25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#8b5cf6"
                      strokeWidth="14"
                      strokeDasharray="17.31 238.76"
                      strokeDashoffset="-219.66"
                      fill="transparent"
                    />
                    {/* Payroll 0.75% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeDasharray="1.79 238.76"
                      strokeDashoffset="-236.97"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute text-center pointer-events-none">
                    <span className="text-xl font-black text-slate-900 block">
                      100%
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">
                      4 Head Outlay
                    </span>
                  </div>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2 text-xs">
                {expenditureOutlayData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-bold text-slate-800">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      ₹ {item.amountCr.toFixed(2)} Cr ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 2: BILL CLEARING DESK & LEDGER GRID (BILL DESK TAB ONLY) ───── */}
      {activeTab === "BILL_CLEARING" && (
        <>
          <Card className="mb-6">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-check-square text-rose-600" />
                  Vendor Bill Clearance Desk ({filteredBills.length} Vouchers)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Printer PO settlements, Paper vendor reels, Freight vouchers &
                  LD penalty deductions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-44">
                  <DropDownList
                    data={categoryFilterOptions}
                    value={selectedCategory}
                    onChange={(val: unknown) =>
                      setSelectedCategory(String(val ?? "ALL"))
                    }
                    textField="label"
                    optionValue="value"
                    filter={false}
                  />
                </div>
                <div className="w-44">
                  <DropDownList
                    data={statusFilterOptions}
                    value={selectedStatus}
                    onChange={(val: unknown) =>
                      setSelectedStatus(String(val ?? "ALL"))
                    }
                    textField="label"
                    optionValue="value"
                    filter={false}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-2xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-[#006A38] text-xs font-mono">
                        {bill.voucherReference}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        Date: {bill.voucherDate}
                      </span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-300 uppercase">
                        {bill.categoryLabel}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900">
                      {bill.vendorDetails.vendorName} • GSTIN:{" "}
                      <span className="font-mono text-slate-800">
                        {bill.vendorDetails.gstin}
                      </span>{" "}
                      • IFMIS Code:{" "}
                      <span className="font-mono text-[#006A38]">
                        {bill.vendorDetails.ifmisCode}
                      </span>
                    </div>

                    {/* Billing Breakdown Pills */}
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-800">
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                        Gross Bill:{" "}
                        <strong className="text-slate-900 font-extrabold">
                          ₹ {bill.grossBillAmount.toLocaleString("en-IN")}
                        </strong>
                      </span>
                      <span className="bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg text-rose-900">
                        TDS (2% IT + 2% GST): ₹{" "}
                        {(
                          bill.deductions.tdsIncomeTax2pc +
                          bill.deductions.tdsGst2pc
                        ).toLocaleString("en-IN")}
                      </span>
                      {bill.deductions.lateDeliveryPenaltyLd > 0 && (
                        <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-900">
                          LD Penalty: ₹{" "}
                          {bill.deductions.lateDeliveryPenaltyLd.toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      )}
                      {bill.deductions.paperWastagePenalty > 0 && (
                        <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-900">
                          Paper Wastage: ₹{" "}
                          {bill.deductions.paperWastagePenalty.toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      )}
                      <span className="bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg text-emerald-950 font-extrabold">
                        Net Payable: ₹{" "}
                        {bill.netPayableAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200">
                    <Button
                      label="View Audit"
                      icon="pi pi-file"
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedBillForAudit(bill)}
                      className="text-xs font-bold"
                    />

                    {bill.approvalWorkflow.treasuryIfmisStatus !==
                    "VOUCHER_PASSED_DISBURSED" ? (
                      <>
                        <Button
                          label="Hold Audit"
                          icon="pi pi-times"
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleBillDecision(
                              bill.id,
                              "HOLD",
                              bill.vendorDetails.vendorName,
                            )
                          }
                          className="text-xs font-bold"
                        />
                        <Button
                          label="Approve & Pass"
                          icon="pi pi-check"
                          size="small"
                          variant="primary"
                          onClick={() =>
                            handleBillDecision(
                              bill.id,
                              "VOUCHER_PASSED_DISBURSED",
                              bill.vendorDetails.vendorName,
                            )
                          }
                          className="text-xs font-bold bg-[#006A38] border-[#006A38] hover:bg-[#00522b]"
                        />
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                        Disbursed to Treasury
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ─── SEARCHABLE FINANCIAL LEDGER TABLE ───────────────────────────── */}
          <Card className="mb-6">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-list text-[#006A38]" />
                  Financial Ledger & Disbursal Register
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Filterable transaction ledger synced with State Treasury
                  e-Voucher Portal.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                {filteredBills.length} Vouchers Listed
              </span>
            </div>

            <div className="p-2">
              <Grid
                data={filteredBills}
                columns={ledgerColumns}
                paginator={false}
              />
            </div>
          </Card>
        </>
      )}

      {/* ─── AUDIT VIEW MODAL (SHARED COMPONENT POPUP) ───────────────────────── */}
      {selectedBillForAudit && (
        <Modal
          visible={!!selectedBillForAudit}
          onHide={() => setSelectedBillForAudit(null)}
          header={`Financial Audit Note — ${selectedBillForAudit.voucherReference}`}
          size="medium"
        >
          <div className="space-y-4 text-xs p-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {selectedBillForAudit.vendorDetails.vendorName}
                </span>
                <span className="text-xs text-slate-800 font-bold font-mono block mt-0.5">
                  GSTIN: {selectedBillForAudit.vendorDetails.gstin} | IFMIS:{" "}
                  {selectedBillForAudit.vendorDetails.ifmisCode}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300 uppercase">
                {selectedBillForAudit.categoryLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-700 block uppercase">
                  GROSS BILL AMOUNT
                </span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">
                  ₹{" "}
                  {selectedBillForAudit.grossBillAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                <span className="text-[10px] font-extrabold text-emerald-900 block uppercase">
                  NET PAYABLE DISBURSAL
                </span>
                <span className="text-base font-black text-emerald-950 mt-0.5 block">
                  ₹{" "}
                  {selectedBillForAudit.netPayableAmount.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1.5">
              <strong className="text-blue-950 font-extrabold text-xs block">
                Treasury Audit Verification & Deductions Checklist:
              </strong>
              <ul className="list-disc pl-4 space-y-1 text-blue-950 text-xs font-medium">
                <li>
                  Depot Receipt Challan (
                  {selectedBillForAudit.linkedOperationalData
                    .depotReceiptChallan || "Verified"}
                  ) verified against PO quantity.
                </li>
                <li>
                  TDS Income Tax (2%): ₹{" "}
                  {selectedBillForAudit.deductions.tdsIncomeTax2pc.toLocaleString(
                    "en-IN",
                  )}{" "}
                  | TDS GST (2%): ₹{" "}
                  {selectedBillForAudit.deductions.tdsGst2pc.toLocaleString(
                    "en-IN",
                  )}
                </li>
                {selectedBillForAudit.deductions.lateDeliveryPenaltyLd > 0 && (
                  <li className="text-rose-900 font-bold">
                    Late Delivery Penalty (LD): ₹{" "}
                    {selectedBillForAudit.deductions.lateDeliveryPenaltyLd.toLocaleString(
                      "en-IN",
                    )}
                  </li>
                )}
                <li>
                  IFMIS Token:{" "}
                  <strong className="font-mono text-slate-900">
                    {selectedBillForAudit.approvalWorkflow.treasuryTokenNo}
                  </strong>{" "}
                  ({selectedBillForAudit.approvalWorkflow.treasuryIfmisStatus})
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                label="Close Audit"
                variant="outlined"
                onClick={() => setSelectedBillForAudit(null)}
                className="text-xs font-bold"
              />
              <Button
                label="Pass Voucher"
                variant="primary"
                onClick={() => {
                  handleBillDecision(
                    selectedBillForAudit.id,
                    "VOUCHER_PASSED_DISBURSED",
                    selectedBillForAudit.vendorDetails.vendorName,
                  );
                  setSelectedBillForAudit(null);
                }}
                className="text-xs font-bold bg-[#006A38] border-[#006A38] hover:bg-[#00522b]"
              />
            </div>
          </div>
        </Modal>
      )}
    </Page>
  );
}
