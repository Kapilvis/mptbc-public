import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { Modal } from "shared/components/popups";
import Grid from "shared/components/grid/Grid";
import { DropDownList } from "shared/components/forms";
import {
  initialLegalKpis,
  courtBenchDistributionData,
  caseTypeDistributionData,
  yearWiseBreakdownData,
  subjectMatrixData,
  initialLegalCases,
  type LegalCaseItem,
} from "../data";

type LegalTabType =
  | "HIGH_PRIORITY"
  | "UPCOMING_HEARING"
  | "PENDING"
  | "OWD_DISPOSED";

const benchFilterOptions = [
  { label: "All Court Benches", value: "ALL" },
  { label: "Principal Seat Jabalpur", value: "Principal Seat Jabalpur" },
  { label: "High Court Bench Gwalior", value: "Bench Gwalior" },
  { label: "High Court Bench Indore", value: "Bench Indore" },
];

const caseTypeFilterOptions = [
  { label: "All Case Types", value: "ALL" },
  { label: "WP (Writ Petition)", value: "WP" },
  { label: "WA (Writ Appeal)", value: "WA" },
  { label: "CONC (Contempt Case)", value: "CONC" },
  { label: "SLP (Special Leave Petition)", value: "SLP" },
  { label: "ARB (Arbitration)", value: "ARB" },
];

const subjectFilterOptions = [
  { label: "All Subjects", value: "ALL" },
  {
    label: "Printer LD & Penalty Dispute",
    value: "Printer LD & Penalty Dispute",
  },
  { label: "Paper Quality Dispute", value: "Paper Quality Dispute" },
  { label: "Employee Increment", value: "Employee Increment" },
  { label: "Retirement Benefits", value: "Retirement Benefits" },
  { label: "Transfer Matter", value: "Transfer Matter" },
  { label: "Service Salary Matter", value: "Service Salary Matter" },
];

export default function LegalDashboard() {
  const [activeTab, setActiveTab] = useState<LegalTabType>("HIGH_PRIORITY");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBench, setSelectedBench] = useState("ALL");
  const [selectedCaseType, setSelectedCaseType] = useState("ALL");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  const [cases, setCases] = useState<LegalCaseItem[]>(initialLegalCases);
  const [selectedCaseForView, setSelectedCaseForView] =
    useState<LegalCaseItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBench("ALL");
    setSelectedCaseType("ALL");
    setSelectedSubject("ALL");
  };

  // Filtered legal cases list
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesTab =
        activeTab === "HIGH_PRIORITY"
          ? c.priorityFlag === "HIGH_PRIORITY"
          : activeTab === "UPCOMING_HEARING"
            ? c.priorityFlag === "UPCOMING_HEARING"
            : activeTab === "PENDING"
              ? c.priorityFlag === "PENDING"
              : c.priorityFlag === "OWD_DISPOSED";

      const matchesBench =
        selectedBench === "ALL" || c.courtBench === selectedBench;
      const matchesType =
        selectedCaseType === "ALL" || c.caseType === selectedCaseType;
      const matchesSubject =
        selectedSubject === "ALL" || c.caseSubject === selectedSubject;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.caseId.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.petitioner.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.advocateDetails.standingCounsel.toLowerCase().includes(q);

      return (
        matchesTab &&
        matchesBench &&
        matchesType &&
        matchesSubject &&
        matchesQuery
      );
    });
  }, [
    cases,
    activeTab,
    selectedBench,
    selectedCaseType,
    selectedSubject,
    searchQuery,
  ]);

  const handleUpdateCaseStatus = (
    caseId: string,
    newStage: "COUNTER_AFFIDAVIT_FILED" | "ORDER_PASSED",
    caseNo: string,
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            statusStage: newStage,
          };
        }
        return c;
      }),
    );

    setActionNotice(
      `Legal Case ${caseNo} updated: ${
        newStage === "COUNTER_AFFIDAVIT_FILED"
          ? "Counter Affidavit Submitted to High Court"
          : "Court Order Compliance Processed"
      }`,
    );

    setTimeout(() => setActionNotice(null), 4000);
  };

  // Master Legal Case Grid Columns
  const caseColumns: Controls.ColumnProps<LegalCaseItem>[] = useMemo(
    () => [
      {
        field: "caseNumber",
        header: "CASE NO & BENCH",
        width: "200px",
        cell: (item: LegalCaseItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-extrabold text-[#006A38] text-xs font-mono">
              {item.caseNumber}
            </span>
            <span className="text-xs font-bold text-slate-800">
              {item.courtBench}
            </span>
          </div>
        ),
      },
      {
        field: "caseSubject",
        header: "SUBJECT & DISPUTE TYPE",
        width: "220px",
        cell: (item: LegalCaseItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
              {item.caseSubject}
            </span>
            <span className="text-xs font-bold text-blue-900">
              District: {item.district}
            </span>
          </div>
        ),
      },
      {
        field: "petitioner",
        header: "PETITIONER VS RESPONDENT",
        width: "260px",
        cell: (item: LegalCaseItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-extrabold text-slate-900 text-xs truncate max-w-[240px]">
              {item.petitioner}
            </span>
            <span className="text-xs text-slate-700 font-medium truncate max-w-[240px]">
              vs {item.respondent}
            </span>
          </div>
        ),
      },
      {
        field: "advocateDetails",
        header: "STANDING COUNSEL",
        width: "220px",
        cell: (item: LegalCaseItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
              {item.advocateDetails.standingCounsel}
            </span>
            <span className="text-xs text-slate-800 font-mono">
              {item.advocateDetails.contact}
            </span>
          </div>
        ),
      },
      {
        field: "nextHearingDate",
        header: "NEXT HEARING",
        width: "140px",
        cell: (item: LegalCaseItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-extrabold text-rose-900 text-xs font-mono">
              {item.nextHearingDate}
            </span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 uppercase">
              {item.statusStage.replace(/_/g, " ")}
            </span>
          </div>
        ),
      },
      {
        field: "financialStakeLakhs",
        header: "FINANCIAL STAKE",
        width: "140px",
        cell: (item: LegalCaseItem) => (
          <span className="font-black text-slate-900 text-xs">
            ₹ {item.financialStakeLakhs} Lakhs
          </span>
        ),
      },
      {
        field: "id",
        header: "ACTION",
        width: "120px",
        cell: (item: LegalCaseItem) => (
          <Button
            label="View Case"
            icon="pi pi-eye"
            size="small"
            variant="outlined"
            onClick={() => setSelectedCaseForView(item)}
            className="text-xs font-bold"
          />
        ),
      },
    ],
    [],
  );

  return (
    <Page
      header="Legal Dashboard"
      subHeader="Madhya Pradesh Textbook Corporation — High Court Benches (Jabalpur, Gwalior, Indore) & OwD Compliance Monitoring."
      showHeaderActions
    >
      {/* ─── 1. TOP FILTER CONTROLS BAR (WITH SEARCH INPUT) ───────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full lg:w-auto">
          <div className="w-48">
            <DropDownList
              data={benchFilterOptions}
              value={selectedBench}
              onChange={(val: unknown) =>
                setSelectedBench(String(val ?? "ALL"))
              }
              textField="label"
              optionValue="value"
              filter={false}
            />
          </div>
          <div className="w-44">
            <DropDownList
              data={caseTypeFilterOptions}
              value={selectedCaseType}
              onChange={(val: unknown) =>
                setSelectedCaseType(String(val ?? "ALL"))
              }
              textField="label"
              optionValue="value"
              filter={false}
            />
          </div>
          <div className="w-52">
            <DropDownList
              data={subjectFilterOptions}
              value={selectedSubject}
              onChange={(val: unknown) =>
                setSelectedSubject(String(val ?? "ALL"))
              }
              textField="label"
              optionValue="value"
              filter={false}
            />
          </div>
          <Button
            label="Reset Filters"
            icon="pi pi-refresh"
            size="small"
            variant="outlined"
            onClick={resetFilters}
            className="text-xs font-bold shrink-0"
          />
        </div>

        <div className="relative w-full lg:w-80 shrink-0">
          <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Case No, Petitioner..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#006A38]"
          />
        </div>
      </div>

      {actionNotice && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <i className="pi pi-check-circle text-emerald-600 text-base" />
          {actionNotice}
        </div>
      )}

      {/* ─── 2. TOP 5 METRIC CARDS ROW ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* KPI 1: Active Tab Case Counter */}
        <div className="bg-[#f0f7ff] border border-[#bcd7ff] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                1. TOTAL ACTIVE TAB
              </span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-300">
                Active View
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {filteredCases.length} Cases
            </div>

            <div className="grid grid-cols-2 gap-1 text-left mt-2.5 pt-2 border-t border-[#bfdbfe]">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase block">
                  JABALPUR
                </span>
                <div className="text-base font-black text-slate-900">55%</div>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase block">
                  GWALIOR/IND
                </span>
                <div className="text-base font-black text-slate-900">45%</div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Listed Cases:{" "}
            <strong className="text-blue-900 font-black">
              {filteredCases.length} Files
            </strong>
          </div>
        </div>

        {/* KPI 2: High Court Bench Breakdown */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                2. BENCH SPLIT
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                3 High Courts
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              6,840 Jabalpur
            </div>

            <div className="grid grid-cols-2 gap-1 text-left mt-2.5 pt-2 border-t border-[#bbf7d0]">
              <div>
                <span className="text-xs font-bold text-emerald-900 uppercase block">
                  GWALIOR
                </span>
                <div className="text-base font-black text-slate-900">3,230</div>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase block">
                  INDORE
                </span>
                <div className="text-base font-black text-slate-900">2,371</div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Principal Seat:{" "}
            <strong className="text-emerald-900 font-black">55% Share</strong>
          </div>
        </div>

        {/* KPI 3: Case Type Breakdown (WP, CONC, WA) */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                3. CASE TYPES
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                WP & CONC
              </span>
            </div>
            <div className="text-xl font-black text-amber-950 mt-1">
              7,420 WP Petitions
            </div>

            <div className="grid grid-cols-3 gap-1 text-left mt-2.5 pt-2 border-t border-[#fde68a]">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase block">
                  CONC
                </span>
                <div className="text-base font-black text-slate-900">2.8K</div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase block">
                  WA
                </span>
                <div className="text-base font-black text-slate-900">1.2K</div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase block">
                  SLP/ARB
                </span>
                <div className="text-base font-black text-slate-900">971</div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-amber-950 mt-2">
            Writ Petitions:{" "}
            <strong className="text-amber-900 font-black">60% Total</strong>
          </div>
        </div>

        {/* KPI 4: Total Financial Stake at Risk */}
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                4. FINANCIAL STAKE
              </span>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full border border-rose-300">
                Risk
              </span>
            </div>
            <div className="text-xl font-black text-rose-950 mt-1">
              {initialLegalKpis.totalFinancialStakeCr}
            </div>

            <div className="grid grid-cols-2 gap-1 text-left mt-2.5 pt-2 border-t border-[#fecaca]">
              <div>
                <span className="text-xs font-bold text-rose-900 uppercase block">
                  PRINTER DISPUTES
                </span>
                <div className="text-base font-black text-slate-900">
                  ₹ 18.4 Cr
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-rose-900 uppercase block">
                  PAPER MILLS
                </span>
                <div className="text-base font-black text-slate-900">
                  ₹ 14.2 Cr
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-rose-950 mt-2">
            High Financial Value:{" "}
            <strong className="text-rose-900 font-black">77% Vendor</strong>
          </div>
        </div>

        {/* KPI 5: OwD Compliance Disposed Status */}
        <div className="bg-[#faf5ff] border border-[#e9d5ff] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                5. OwD COMPLIANCE
              </span>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full border border-purple-300">
                Disposed
              </span>
            </div>
            <div className="text-xl font-black text-purple-950 mt-1">
              11,121 Orders
            </div>

            <div className="grid grid-cols-2 gap-1 text-left mt-2.5 pt-2 border-t border-[#e9d5ff]">
              <div>
                <span className="text-xs font-bold text-purple-900 uppercase block">
                  COMPLIED
                </span>
                <div className="text-base font-black text-slate-900">98%</div>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-900 uppercase block">
                  PENDING OwD
                </span>
                <div className="text-base font-black text-slate-900">224</div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Order Compliance:{" "}
            <strong className="text-purple-900 font-black">98% On-Time</strong>
          </div>
        </div>
      </div>

      {/* ─── 3. REVIEW NAVIGATION TABS (BELOW KPIS - NO COUNT BADGES) ────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab("HIGH_PRIORITY")}
          className={`px-4.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "HIGH_PRIORITY"
              ? "bg-[#006A38] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          High Priority Cases
        </button>

        <button
          onClick={() => setActiveTab("UPCOMING_HEARING")}
          className={`px-4.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "UPCOMING_HEARING"
              ? "bg-[#006A38] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Upcoming Hearings
        </button>

        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-4.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "PENDING"
              ? "bg-[#006A38] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Pending Cases
        </button>

        <button
          onClick={() => setActiveTab("OWD_DISPOSED")}
          className={`px-4.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "OWD_DISPOSED"
              ? "bg-[#006A38] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          OwD Disposed Cases
        </button>
      </div>

      {/* ─── VISUAL ANALYTICS ROW (4-COLUMN GRID MATCHING MP LEGAL PORTAL) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Col 1: Bench Distribution Bar Visual */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Court & Bench Distribution
            </h4>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              High Court Benches split across MP state.
            </p>
          </div>

          <div className="space-y-3">
            {courtBenchDistributionData.map((b, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm font-bold text-slate-900">
                  <span className="truncate max-w-[140px]">{b.bench}</span>
                  <span>
                    {b.casesCount} ({b.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${b.percentage}%`,
                      backgroundColor: b.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs font-bold text-slate-600 border-t border-slate-100 pt-2">
            Total Benches Tracked:{" "}
            <strong className="text-slate-900">3 Seats</strong>
          </div>
        </div>

        {/* Col 2: Filing Year Breakdown Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Year-wise Filing Breakdown
            </h4>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Litigation filings from 2010 to 2026.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            {yearWiseBreakdownData.map((y, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100"
              >
                <span className="font-bold text-slate-900">{y.year}</span>
                <div className="flex gap-2 text-xs font-bold">
                  <span className="text-blue-900">Active: {y.activeCount}</span>
                  <span className="text-emerald-900">
                    Closed: {y.resolvedCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs font-bold text-slate-600 border-t border-slate-100 pt-2">
            Historical Data:{" "}
            <strong className="text-slate-900">16 Years Synced</strong>
          </div>
        </div>

        {/* Col 3: Case Type Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Case Type Classification
            </h4>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Writ Petitions, Contempt & Appeals.
            </p>
          </div>

          <div className="space-y-2.5">
            {caseTypeDistributionData.map((c, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="font-bold text-slate-800">{c.type}</span>
                </div>
                <span className="font-bold text-slate-900">{c.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs font-bold text-slate-600 border-t border-slate-100 pt-2">
            Dominant Type: <strong className="text-[#006A38]">WP (60%)</strong>
          </div>
        </div>

        {/* Col 4: Subject-wise Dispute Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Dispute Categories & Risk
            </h4>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Printer penalties, paper quality & employee claims.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            {subjectMatrixData.slice(0, 4).map((s, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
              >
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="truncate max-w-[130px]">{s.subject}</span>
                  <span className="text-[#006A38]">{s.active} Cases</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Stake: {s.stake}</span>
                  <span className="text-rose-900 font-bold">
                    Risk: {s.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs font-bold text-slate-600 border-t border-slate-100 pt-2">
            Top Risk:{" "}
            <strong className="text-rose-900">Printer LD Penalties</strong>
          </div>
        </div>
      </div>

      {/* ─── MASTER LEGAL CASE REGISTER TABLE ──────────────────────────────── */}
      <Card className="mb-6">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i className="pi pi-briefcase text-[#006A38]" />
              Master Legal Case Register ({filteredCases.length} Files)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Filterable case list synced with High Court Jabalpur, Gwalior &
              Indore Bench Registry.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
            {filteredCases.length} Cases Filtered
          </span>
        </div>

        <div className="p-2">
          <Grid data={filteredCases} columns={caseColumns} paginator={false} />
        </div>
      </Card>

      {/* ─── CASE DETAILS MODAL (SHARED COMPONENT POPUP) ────────────────────── */}
      {selectedCaseForView && (
        <Modal
          visible={!!selectedCaseForView}
          onHide={() => setSelectedCaseForView(null)}
          header={`Legal Case Blueprint Details — ${selectedCaseForView.caseNumber}`}
          size="medium"
        >
          <div className="space-y-4 text-sm p-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {selectedCaseForView.caseNumber} (
                  {selectedCaseForView.caseType})
                </span>
                <span className="text-xs text-[#006A38] font-bold mt-0.5 block">
                  Bench: {selectedCaseForView.courtBench} | District:{" "}
                  {selectedCaseForView.district}
                </span>
                <span className="text-xs text-slate-600 font-mono block mt-0.5">
                  Filing Year: {selectedCaseForView.filingYear}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300 uppercase">
                {selectedCaseForView.caseSubject}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <strong className="text-slate-900 font-extrabold text-xs block">
                Petitioner vs Respondent Details:
              </strong>
              <p className="text-slate-900 font-bold">
                Petitioner: {selectedCaseForView.petitioner}
              </p>
              <p className="text-slate-700 font-medium">
                Respondent: {selectedCaseForView.respondent}
              </p>
              <div className="mt-2 text-rose-900 font-black bg-rose-50 border border-rose-200 p-2 rounded-lg inline-block">
                Financial Stake at Risk: ₹{" "}
                {selectedCaseForView.financialStakeLakhs} Lakhs
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-700 block uppercase">
                  STANDING COUNSEL ADVOCATE
                </span>
                <span className="text-xs font-extrabold text-slate-900 block mt-1">
                  {selectedCaseForView.advocateDetails.standingCounsel}
                </span>
                <span className="text-[11px] text-slate-600 block font-mono mt-0.5">
                  Contact: {selectedCaseForView.advocateDetails.contact}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-700 block uppercase">
                  NEXT HEARING DATE
                </span>
                <span className="text-xs font-extrabold text-rose-900 block mt-1 font-mono">
                  {selectedCaseForView.nextHearingDate}
                </span>
                <span className="text-[11px] text-slate-600 block uppercase mt-0.5">
                  Status: {selectedCaseForView.statusStage.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {selectedCaseForView.owdCompliance.isOwd && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <strong className="text-amber-950 font-extrabold text-xs block uppercase">
                  Order with Direction (OwD) Compliance:
                </strong>
                <p className="text-amber-900 font-medium">
                  {selectedCaseForView.owdCompliance.directionSummary}
                </p>
                <span className="text-xs font-black text-rose-900 block mt-1">
                  Compliance Deadline:{" "}
                  {selectedCaseForView.owdCompliance.complianceDeadline}
                </span>
              </div>
            )}

            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1.5">
              <strong className="text-blue-950 font-extrabold text-xs block">
                Court Audit Trail Timeline:
              </strong>
              <ul className="list-disc pl-4 space-y-1 text-blue-950 text-xs font-medium">
                {selectedCaseForView.auditTrail.map((ev, idx) => (
                  <li key={idx}>
                    {ev.date} — {ev.event} ({ev.court})
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                label="Close View"
                variant="outlined"
                onClick={() => setSelectedCaseForView(null)}
                className="text-xs font-bold"
              />
              <Button
                label="Submit Counter Affidavit"
                variant="primary"
                onClick={() => {
                  handleUpdateCaseStatus(
                    selectedCaseForView.id,
                    "COUNTER_AFFIDAVIT_FILED",
                    selectedCaseForView.caseNumber,
                  );
                  setSelectedCaseForView(null);
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
