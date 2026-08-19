import { useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import {
  depotBlockTitleSupplyData,
  type DepotBlockTitleSupplyRow,
} from "../data";

export default function DepotBlockTitleSupplyReportPage() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [selectedDepot, setSelectedDepot] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedMedium, setSelectedMedium] = useState("");

  // Filtering
  const filtered = depotBlockTitleSupplyData.filter((r) => {
    return (
      (!selectedDepot || r.depotCode === selectedDepot) &&
      (!selectedBlock || r.blockName === selectedBlock) &&
      (!selectedMedium || r.medium === selectedMedium)
    );
  });

  // Aggregations
  const totalDemand = filtered.reduce((s, r) => s + r.demandQty, 0);
  const totalDispatched = filtered.reduce((s, r) => s + r.dispatchedQty, 0);
  const totalReceived = filtered.reduce((s, r) => s + r.receivedQty, 0);
  const totalShortage = filtered.reduce((s, r) => s + r.shortageQty, 0);
  const totalDamaged = filtered.reduce((s, r) => s + r.damagedQty, 0);
  const overallFulfillment =
    totalDemand > 0 ? ((totalReceived / totalDemand) * 100).toFixed(1) : "0";

  return (
    <Page
      header={pageTitle || "Block Wise Textbook Distribution Report"}
      subHeader="डिपो वार, विकासखंड वार एवं शीर्षक वार पाठ्यपुस्तक प्रेषण एवं आपूर्ति स्थिति रिपोर्ट"
      showHeaderActions
    >
      {/* 1. Academic Session Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        subtitle={`Textbook demand vs supply metrics across depots, blocks and title items for session ${academicYear}.`}
      />

      {/* 2. Metadata Banner Strip */}
      <div className="mb-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Organisation:
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              Madhya Pradesh Textbook Corporation
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Scheme:
            </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              Free Textbook Scheme & Workbooks
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Class Scope:
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Class 1 to 12
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter Controls */}
      <Card className="mb-5 p-4 shadow-xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Depot Filter */}
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-600 dark:text-slate-400">
              Depot:
            </label>
            <select
              value={selectedDepot}
              onChange={(e) => setSelectedDepot(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All Depots</option>
              <option value="BPL">Bhopal (भोपाल)</option>
              <option value="SAGAR">Sagar (सागर)</option>
              <option value="GWL">Gwalior (ग्वालियर)</option>
              <option value="IND">Indore (इंदौर)</option>
            </select>
          </div>

          {/* Block Filter */}
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-600 dark:text-slate-400">
              Block:
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All Blocks</option>
              <option value="Jabera">Jabera</option>
              <option value="Babai">Babai</option>
              <option value="Dabra">Dabra</option>
              <option value="Mhow">Mhow</option>
            </select>
          </div>

          {/* Medium Filter */}
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-600 dark:text-slate-400">
              Medium:
            </label>
            <select
              value={selectedMedium}
              onChange={(e) => setSelectedMedium(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All Mediums</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          {(selectedDepot || selectedBlock || selectedMedium) && (
            <button
              onClick={() => {
                setSelectedDepot("");
                setSelectedBlock("");
                setSelectedMedium("");
              }}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 ml-auto"
            >
              <i className="pi pi-refresh text-[10px]" /> Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* 4. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {/* KPI 1: Total Demand */}
        <Card className="border-l-4 border-l-blue-600 border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Total Demand
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {totalDemand.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              Required Books
            </div>
          </div>
        </Card>

        {/* KPI 2: Dispatched */}
        <Card className="border-l-4 border-l-indigo-600 border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Total Dispatched
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {totalDispatched.toLocaleString()}
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">
              Sent from Depots
            </div>
          </div>
        </Card>

        {/* KPI 3: Received */}
        <Card className="border-l-4 border-l-emerald-600 border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Total Received
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {totalReceived.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Verified at Blocks
            </div>
          </div>
        </Card>

        {/* KPI 4: Shortage / Damaged */}
        <Card className="border-l-4 border-l-amber-600 border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Shortage / Damaged
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {(totalShortage + totalDamaged).toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              {totalShortage} Short | {totalDamaged} Damaged
            </div>
          </div>
        </Card>

        {/* KPI 5: Fulfillment % */}
        <Card className="border-l-4 border-l-teal-600 border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Fulfillment Rate
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {overallFulfillment}%
            </div>
            <div className="text-[11px] text-teal-600 font-semibold mt-1">
              Supply Completion
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Detailed Data Grid Table */}
      <Card className="border border-slate-100 p-1 shadow-xs">
        <GridPanel<DepotBlockTitleSupplyRow>
          toolbarPlacement="page"
          data={filtered}
          searchBox={true}
          searchPlaceholder="Search depot, block, title..."
          exportFilename="depot_block_title_demand_supply_report.xls"
          columns={[
            {
              header: "S.No.",
              cell: (_, opt) => (
                <span className="text-slate-500 font-medium">
                  {opt.rowIndex + 1}
                </span>
              ),
              width: "60px",
              align: "center",
            },
            {
              field: "depotName",
              header: "Depot",
              align: "center",
              cell: (row) => (
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {row.depotName} ({row.depotCode})
                </span>
              ),
              sortable: true,
            },
            {
              field: "blockName",
              header: "Block",
              align: "center",
              cell: (row) => (
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {row.blockName}
                </span>
              ),
              sortable: true,
            },
            {
              field: "medium",
              header: "Medium",
              align: "center",
              sortable: true,
            },
            {
              field: "classGroup",
              header: "Class",
              align: "center",
              sortable: true,
            },
            {
              field: "bookTitle",
              header: "Book Title (Hindi / English)",
              cell: (row) => (
                <span className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {row.bookTitle}
                </span>
              ),
              sortable: true,
            },
            {
              field: "demandQty",
              header: "Demand Books",
              align: "center",
              cell: (row) => (
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {row.demandQty.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "dispatchedQty",
              header: "Dispatched",
              align: "center",
              cell: (row) => (
                <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                  {row.dispatchedQty.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "receivedQty",
              header: "Received",
              align: "center",
              cell: (row) => (
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {row.receivedQty.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "shortageQty",
              header: "Shortage",
              align: "center",
              cell: (row) => (
                <span
                  className={`font-semibold ${
                    row.shortageQty > 0
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-slate-400"
                  }`}
                >
                  {row.shortageQty > 0 ? row.shortageQty.toLocaleString() : "—"}
                </span>
              ),
              sortable: true,
            },
            {
              field: "damagedQty",
              header: "Damaged",
              align: "center",
              cell: (row) => (
                <span
                  className={`font-semibold ${
                    row.damagedQty > 0
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-slate-400"
                  }`}
                >
                  {row.damagedQty > 0 ? row.damagedQty.toLocaleString() : "—"}
                </span>
              ),
              sortable: true,
            },
            {
              field: "fulfillmentPct",
              header: "Fulfillment %",
              align: "center",
              cell: (row) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold border ${
                    row.fulfillmentPct === 100
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : row.fulfillmentPct >= 90
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {row.fulfillmentPct}%
                </span>
              ),
              sortable: true,
            },
          ]}
        />
      </Card>
    </Page>
  );
}
