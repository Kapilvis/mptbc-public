import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { Modal } from "shared/components/popups";
import Grid from "shared/components/grid/Grid";
import { DropDownList } from "shared/components/forms";
import {
  initialGrievanceKpis,
  categoryBreakdownData,
  levelResolutionData,
  initialGrievanceTickets,
  type GrievanceTicketItem,
} from "../data";

type GrievanceTabType = "SUMMARY" | "TICKET_REGISTER";

const categoryFilterOptions = [
  { label: "All Categories", value: "ALL" },
  { label: "Supply Shortage", value: "SUPPLY_SHORTAGE" },
  { label: "Quality & Printing Defect", value: "QUALITY_DEFECT" },
  { label: "HRMS Staff Payroll", value: "HRMS_STAFF_GRIEVANCE" },
  { label: "Vendor Fine & LD Appeal", value: "VENDOR_DISPUTE_APPEAL" },
  { label: "Transit Freight Claim", value: "TRANSPORT_FREIGHT_CLAIM" },
];

export default function GrievanceDashboard() {
  const [activeTab, setActiveTab] = useState<GrievanceTabType>("SUMMARY");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // State for interactive ticket actions & modal
  const [tickets, setTickets] = useState<GrievanceTicketItem[]>(
    initialGrievanceTickets,
  );
  const [selectedTicketForView, setSelectedTicketForView] =
    useState<GrievanceTicketItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filtered tickets list
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesCategory =
        selectedCategory === "ALL" || ticket.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        ticket.grievanceId.toLowerCase().includes(q) ||
        ticket.cmHelplineRefId.toLowerCase().includes(q) ||
        ticket.complainantDetails.name.toLowerCase().includes(q) ||
        ticket.complainantDetails.district.toLowerCase().includes(q) ||
        ticket.complainantDetails.block.toLowerCase().includes(q) ||
        ticket.issueDetails.subject.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [tickets, selectedCategory, searchQuery]);

  const handleTicketStatusChange = (
    ticketId: string,
    newStatus: "RESOLVED" | "ESCALATED",
    complainantName: string,
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            resolutionStatus: newStatus,
            escalationLevel:
              newStatus === "ESCALATED" ? "LEVEL_3" : t.escalationLevel,
            escalationLabel:
              newStatus === "ESCALATED"
                ? "Level 3 (Head Office)"
                : t.escalationLabel,
          };
        }
        return t;
      }),
    );

    setActionNotice(
      `Ticket ${ticketId} for ${complainantName} updated: ${
        newStatus === "RESOLVED"
          ? "Marked as Resolved & Closed"
          : "Escalated to Level 3 Head Office"
      }`,
    );

    setTimeout(() => setActionNotice(null), 4000);
  };

  // Table Columns for Master Grievance Grid
  const ticketColumns: Controls.ColumnProps<GrievanceTicketItem>[] = useMemo(
    () => [
      {
        field: "grievanceId",
        header: "TICKET ID / CM HELPLINE",
        width: "190px",
        cell: (item: GrievanceTicketItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-extrabold text-[#006A38] text-xs font-mono">
              {item.grievanceId}
            </span>
            <span className="text-xs text-slate-800 font-bold">
              Ref: {item.cmHelplineRefId}
            </span>
          </div>
        ),
      },
      {
        field: "complainantDetails",
        header: "COMPLAINANT & LOCATION",
        width: "220px",
        cell: (item: GrievanceTicketItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-extrabold text-slate-900 text-xs">
              {item.complainantDetails.name} (
              {item.complainantDetails.designation})
            </span>
            <span className="text-xs font-bold text-slate-800">
              {item.complainantDetails.district} •{" "}
              {item.complainantDetails.block}
            </span>
          </div>
        ),
      },
      {
        field: "categoryLabel",
        header: "CATEGORY",
        width: "170px",
        cell: (item: GrievanceTicketItem) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              item.category === "SUPPLY_SHORTAGE"
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : item.category === "QUALITY_DEFECT"
                  ? "bg-blue-100 text-blue-900 border border-blue-300"
                  : item.category === "VENDOR_DISPUTE_APPEAL"
                    ? "bg-rose-100 text-rose-900 border border-rose-300"
                    : "bg-purple-100 text-purple-900 border border-purple-300"
            }`}
          >
            {item.categoryLabel}
          </span>
        ),
      },
      {
        field: "issueDetails",
        header: "SUBJECT & TITLE",
        width: "260px",
        cell: (item: GrievanceTicketItem) => (
          <div className="flex flex-col space-y-0.5">
            <span className="font-bold text-slate-900 text-xs truncate max-w-[240px]">
              {item.issueDetails.subject}
            </span>
            <span className="text-xs text-slate-800 font-bold truncate max-w-[240px]">
              {item.issueDetails.affectedTitle}
            </span>
          </div>
        ),
      },
      {
        field: "escalationLevel",
        header: "ESCALATION LEVEL",
        width: "160px",
        cell: (item: GrievanceTicketItem) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              item.escalationLevel === "LEVEL_1"
                ? "bg-slate-100 text-slate-800 border border-slate-300"
                : item.escalationLevel === "LEVEL_2"
                  ? "bg-blue-100 text-blue-900 border border-blue-300"
                  : item.escalationLevel === "LEVEL_3"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-rose-100 text-rose-900 border border-rose-300"
            }`}
          >
            {item.escalationLabel}
          </span>
        ),
      },
      {
        field: "resolutionStatus",
        header: "STATUS",
        width: "135px",
        cell: (item: GrievanceTicketItem) => (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
              item.resolutionStatus === "RESOLVED"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : item.resolutionStatus === "ESCALATED"
                  ? "bg-rose-100 text-rose-800 border border-rose-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            {item.resolutionStatus.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        field: "id",
        header: "ACTION",
        width: "120px",
        cell: (item: GrievanceTicketItem) => (
          <Button
            label="View Ticket"
            icon="pi pi-eye"
            size="small"
            variant="outlined"
            onClick={() => setSelectedTicketForView(item)}
            className="text-xs font-bold"
          />
        ),
      },
    ],
    [],
  );

  return (
    <Page
      header="Grievance Dashboard"
      subHeader="Madhya Pradesh Textbook Corporation — CM Helpline 181, BRC Shortage Claims & Redressal Monitoring."
      showHeaderActions
    >
      {/* ─── TOP HEADER BAR (SEARCH, COMPACT TABS & CATEGORY DROPDOWN) ──────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ticket ID, CM Helpline Ref, District..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#006A38]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          {/* Tab Switcher Pills */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab("SUMMARY")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === "SUMMARY"
                  ? "bg-[#006A38] text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("TICKET_REGISTER")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === "TICKET_REGISTER"
                  ? "bg-[#006A38] text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Ticket Register
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-900 text-white">
                {filteredTickets.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <i className="pi pi-filter text-[#006A38] text-sm" />
              Category:
            </label>
            <div className="w-48">
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
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <i className="pi pi-check-circle text-emerald-600 text-base" />
          {actionNotice}
        </div>
      )}

      {/* ─── TOP 5 METRIC CARDS (NUMBERS & QUICK DATA FOCUS) ────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* KPI 1: Total Active Grievances */}
        <div className="bg-[#f0f7ff] border border-[#bcd7ff] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                1. TOTAL GRIEVANCES
              </span>
              <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full border border-blue-300">
                FY26
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {initialGrievanceKpis.totalGrievances} Tickets
            </div>

            <div className="grid grid-cols-3 gap-1 text-left mt-2.5 pt-2 border-t border-[#bfdbfe]">
              <div>
                <span className="text-[9.5px] font-bold text-emerald-800 uppercase block">
                  RESOLVED
                </span>
                <div className="text-sm font-black text-slate-900">
                  {initialGrievanceKpis.resolvedCount}
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-amber-800 uppercase block">
                  PENDING
                </span>
                <div className="text-sm font-black text-slate-900">
                  {initialGrievanceKpis.pendingCount}
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-purple-800 uppercase block">
                  OVERDUE
                </span>
                <div className="text-sm font-black text-slate-900">
                  {initialGrievanceKpis.overdueCount}
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Resolution Rate:{" "}
            <strong className="text-emerald-900 font-black">
              {initialGrievanceKpis.resolutionRate} Closed
            </strong>
          </div>
        </div>

        {/* KPI 2: CM Helpline 181 Complaints */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                2. CM HELPLINE 181
              </span>
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300">
                Portal 181
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {initialGrievanceKpis.cmHelpline181Count} Complaints
            </div>

            <div className="grid grid-cols-2 gap-1 text-left mt-2.5 pt-2 border-t border-[#bbf7d0]">
              <div>
                <span className="text-[9.5px] font-bold text-emerald-900 uppercase block">
                  SLA ON-TIME
                </span>
                <div className="text-sm font-black text-slate-900">
                  {initialGrievanceKpis.cmHelplineSla}
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-blue-900 uppercase block">
                  SYNC STATUS
                </span>
                <div className="text-sm font-black text-slate-900">
                  Live Synced
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Target SLA:{" "}
            <strong className="text-emerald-900 font-black">
              100% On-Time
            </strong>
          </div>
        </div>

        {/* KPI 3: BRC Supply Shortages */}
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                3. SUPPLY SHORTAGES
              </span>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                45 Claims
              </span>
            </div>
            <div className="text-xl font-black text-amber-950 mt-1">
              {initialGrievanceKpis.supplyShortagesCount} Active Claims
            </div>

            <div className="grid grid-cols-3 gap-1 text-left mt-2.5 pt-2 border-t border-[#fde68a]">
              <div>
                <span className="text-[9.5px] font-bold text-slate-700 uppercase block">
                  INDORE
                </span>
                <div className="text-sm font-black text-slate-900">16</div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-slate-700 uppercase block">
                  BHOPAL
                </span>
                <div className="text-sm font-black text-slate-900">14</div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-slate-700 uppercase block">
                  UJJAIN
                </span>
                <div className="text-sm font-black text-slate-900">15</div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-amber-950 mt-2">
            Affected BRC Blocks:{" "}
            <strong className="text-amber-900 font-black">45 Locations</strong>
          </div>
        </div>

        {/* KPI 4: Vendor Fine & LD Appeals */}
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                4. VENDOR APPEALS
              </span>
              <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-2.5 py-1 rounded-full border border-rose-300">
                18 Appeals
              </span>
            </div>
            <div className="text-xl font-black text-rose-950 mt-1">
              {initialGrievanceKpis.vendorAppealsCount} Fine Appeals
            </div>

            <div className="grid grid-cols-2 gap-1 text-left mt-2.5 pt-2 border-t border-[#fecaca]">
              <div>
                <span className="text-[9.5px] font-bold text-rose-900 uppercase block">
                  PRINTERS
                </span>
                <div className="text-sm font-black text-slate-900">11</div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-rose-900 uppercase block">
                  PAPER MILLS
                </span>
                <div className="text-sm font-black text-slate-900">7</div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-rose-950 mt-2">
            High Value Appeals:{" "}
            <strong className="text-rose-900 font-black">18 Files</strong>
          </div>
        </div>

        {/* KPI 5: Average Resolution Time */}
        <div className="bg-[#faf5ff] border border-[#e9d5ff] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                5. AVG RESOLUTION
              </span>
              <span className="text-xs font-extrabold bg-purple-100 text-purple-900 px-2.5 py-1 rounded-full border border-purple-300">
                Speed
              </span>
            </div>
            <div className="text-xl font-black text-purple-950 mt-1">
              {initialGrievanceKpis.avgResolutionDays}
            </div>

            <div className="grid grid-cols-2 gap-1 text-left mt-2.5 pt-2 border-t border-[#e9d5ff]">
              <div>
                <span className="text-[9.5px] font-bold text-purple-900 uppercase block">
                  TARGET
                </span>
                <div className="text-sm font-black text-slate-900">
                  &lt; 3 Days
                </div>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-emerald-900 uppercase block">
                  EFFICIENCY
                </span>
                <div className="text-sm font-black text-slate-900">
                  +58% Fast
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2">
            Average Speed:{" "}
            <strong className="text-purple-900 font-black">2.1 Days</strong>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: SUMMARY VIEW (CHARTS & ESCALATION MATRIX) ─────────── */}
      {activeTab === "SUMMARY" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left 2 Cols: Category Breakdown & Vertical Bar Visual */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-chart-bar text-[#006A38]" />
                  Grievances Category Breakdown
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Distribution of filed tickets across Supply Shortages,
                  Quality, Payroll, Vendor & Freight.
                </p>
              </div>
              <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                Total: 156 Complaints
              </span>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {categoryBreakdownData.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-center"
                >
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {item.category}
                  </span>
                  <span className="text-xl font-black text-slate-900 block">
                    {item.count}
                  </span>
                  <span className="text-xs font-bold text-[#006A38] block">
                    {Math.round((item.count / 156) * 100)}% of total
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical Bar Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Category Ticket Volume Comparison
                </h4>
                <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                  Active & Resolved Volume
                </span>
              </div>

              <div className="relative h-64 flex items-end justify-between gap-3 pt-6 pb-6 px-4 bg-white rounded-xl border border-slate-200/80">
                {categoryBreakdownData.map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end z-10"
                  >
                    <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {bar.count}
                    </span>
                    <div
                      className="w-12 max-w-[48px] rounded-t-xl transition-all duration-300 shadow-sm hover:brightness-105"
                      style={{
                        height: `${(bar.count / 52) * 75}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                    <span className="text-[11px] font-extrabold text-slate-900 text-center leading-tight whitespace-normal max-w-[110px] mt-1.5">
                      {bar.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Level-wise Resolution Donut Visual */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-chart-pie text-[#006A38]" />
                  Resolution SLA Levels (L1 to L4)
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  156 Total
                </span>
              </div>

              {/* Donut Visual */}
              <div className="flex items-center justify-center my-6">
                <div className="relative w-44 h-44 flex items-center justify-center">
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
                    {/* L1 89.7% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#006A38"
                      strokeWidth="14"
                      strokeDasharray="214.2 238.7"
                      strokeDashoffset="0"
                      fill="transparent"
                    />
                    {/* L2 5.1% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#2563eb"
                      strokeWidth="14"
                      strokeDasharray="12.2 238.7"
                      strokeDashoffset="-214.2"
                      fill="transparent"
                    />
                    {/* L3 2.5% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#d97706"
                      strokeWidth="14"
                      strokeDasharray="6.0 238.7"
                      strokeDashoffset="-226.4"
                      fill="transparent"
                    />
                    {/* L4 2.5% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#dc2626"
                      strokeWidth="14"
                      strokeDasharray="6.0 238.7"
                      strokeDashoffset="-232.4"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute text-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 block">
                      89.7%
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">
                      L1 Resolved
                    </span>
                  </div>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2 text-xs">
                {levelResolutionData.map((item, idx) => (
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
                        {item.level}
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 2: TICKET REGISTER & EXECUTIVE ACTION DESK ─────────────── */}
      {activeTab === "TICKET_REGISTER" && (
        <>
          {/* Executive Action Desk */}
          <Card className="mb-6">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-bolt text-amber-600" />
                  Grievance Action Desk ({filteredTickets.length} Active Files)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  High-priority BRC shortage claims & vendor fine appeals for
                  immediate resolution.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                Action Queue
              </span>
            </div>

            <div className="p-4 space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-2xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-[#006A38] text-xs font-mono">
                        {ticket.grievanceId}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        Ref: {ticket.cmHelplineRefId}
                      </span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-300 uppercase">
                        {ticket.categoryLabel}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        Filing: {ticket.filingDate}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900">
                      {ticket.complainantDetails.name} (
                      {ticket.complainantDetails.designation}) • Location:{" "}
                      <span className="text-[#006A38] font-bold">
                        {ticket.complainantDetails.district},{" "}
                        {ticket.complainantDetails.block}
                      </span>{" "}
                      • Contact:{" "}
                      <span className="font-mono text-slate-800">
                        {ticket.complainantDetails.contact}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                      <strong>Subject:</strong> {ticket.issueDetails.subject}
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">
                        {ticket.issueDetails.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200">
                    <Button
                      label="View Ticket"
                      icon="pi pi-eye"
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedTicketForView(ticket)}
                      className="text-xs font-bold"
                    />

                    {ticket.resolutionStatus !== "RESOLVED" ? (
                      <>
                        <Button
                          label="Escalate to L3"
                          icon="pi pi-arrow-up-right"
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleTicketStatusChange(
                              ticket.id,
                              "ESCALATED",
                              ticket.complainantDetails.name,
                            )
                          }
                          className="text-xs font-bold"
                        />
                        <Button
                          label="Resolve Ticket"
                          icon="pi pi-check"
                          size="small"
                          variant="primary"
                          onClick={() =>
                            handleTicketStatusChange(
                              ticket.id,
                              "RESOLVED",
                              ticket.complainantDetails.name,
                            )
                          }
                          className="text-xs font-bold bg-[#006A38] border-[#006A38] hover:bg-[#00522b]"
                        />
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                        Resolved & Closed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Master Grievance Grid */}
          <Card className="mb-6">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i className="pi pi-list text-[#006A38]" />
                  Master Grievance Register
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Filterable master registry synced with CM Helpline 181 & MP
                  Samadhan Portal.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                {filteredTickets.length} Tickets Listed
              </span>
            </div>

            <div className="p-2">
              <Grid
                data={filteredTickets}
                columns={ticketColumns}
                paginator={false}
              />
            </div>
          </Card>
        </>
      )}

      {/* ─── TICKET DETAILS MODAL (SHARED COMPONENT POPUP) ────────────────────── */}
      {selectedTicketForView && (
        <Modal
          visible={!!selectedTicketForView}
          onHide={() => setSelectedTicketForView(null)}
          header={`Grievance Blueprint Details — ${selectedTicketForView.grievanceId}`}
          size="medium"
        >
          <div className="space-y-4 text-xs p-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {selectedTicketForView.complainantDetails.name}
                </span>
                <span className="text-xs text-[#006A38] font-bold mt-0.5 block">
                  {selectedTicketForView.complainantDetails.designation} •{" "}
                  {selectedTicketForView.complainantDetails.district} (
                  {selectedTicketForView.complainantDetails.block})
                </span>
                <span className="text-xs text-slate-600 font-mono block mt-0.5">
                  Contact: {selectedTicketForView.complainantDetails.contact}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                {selectedTicketForView.categoryLabel}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <strong className="text-slate-900 font-extrabold text-xs block">
                Subject & Detailed Issue Description:
              </strong>
              <p className="text-slate-800 font-bold">
                {selectedTicketForView.issueDetails.subject}
              </p>
              <p className="text-slate-600 font-medium">
                {selectedTicketForView.issueDetails.description}
              </p>
              {selectedTicketForView.issueDetails.shortageQty && (
                <div className="mt-2 text-rose-900 font-black bg-rose-50 border border-rose-200 p-2 rounded-lg inline-block">
                  Verified Shortage Quantity:{" "}
                  {selectedTicketForView.issueDetails.shortageQty} Copies
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-700 block uppercase">
                  ASSIGNED NODAL OFFICER
                </span>
                <span className="text-xs font-extrabold text-slate-900 block mt-1">
                  {selectedTicketForView.assignedOfficer.officerName}
                </span>
                <span className="text-[11px] text-slate-600 block">
                  {selectedTicketForView.assignedOfficer.role}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-700 block uppercase">
                  SLA DEADLINE
                </span>
                <span className="text-xs font-extrabold text-emerald-900 block mt-1">
                  {selectedTicketForView.assignedOfficer.slaDeadline}
                </span>
                <span className="text-[11px] text-slate-600 block">
                  {selectedTicketForView.escalationLabel}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1.5">
              <strong className="text-blue-950 font-extrabold text-xs block">
                Audit Trail Timeline:
              </strong>
              <ul className="list-disc pl-4 space-y-1 text-blue-950 text-xs font-medium">
                <li>
                  {selectedTicketForView.filingDate} — Ticket created via{" "}
                  {selectedTicketForView.sourceLabel}
                </li>
                <li>Assigned to L1 District Nodal Officer</li>
                <li>Auto-Escalation Engine active for SLA tracking</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                label="Close View"
                variant="outlined"
                onClick={() => setSelectedTicketForView(null)}
                className="text-xs font-bold"
              />
              <Button
                label="Resolve Ticket"
                variant="primary"
                onClick={() => {
                  handleTicketStatusChange(
                    selectedTicketForView.id,
                    "RESOLVED",
                    selectedTicketForView.complainantDetails.name,
                  );
                  setSelectedTicketForView(null);
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
