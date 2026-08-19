import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { dispatchHistoryData, type DispatchHistoryItem } from "../data";
import { DepotToBlockReceiptModal } from "../components/DepotToBlockReceiptModal";

function StatusBadge({ status }: { status: 0 | 1 }) {
  return status === 1 ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-wide">
      <i className="pi pi-check-circle text-[9px]" /> Received
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-wide">
      <i className="pi pi-clock text-[9px]" /> Pending
    </span>
  );
}

export default function DispatchHistoryPage() {
  const navigate = useNavigate();
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [receiptItem, setReceiptItem] = useState<DispatchHistoryItem | null>(
    null,
  );

  const totalBooks = dispatchHistoryData.reduce((s, r) => s + r.totalBooks, 0);
  const totalBundles = dispatchHistoryData.reduce(
    (s, r) => s + r.totalBundles,
    0,
  );
  const acknowledged = dispatchHistoryData.filter((r) => r.status === 1).length;

  return (
    <Page
      header={pageTitle || "Depot to Block Dispatch"}
      subHeader="डिपो से ब्लॉक प्रेषण — Complete history of challans dispatched from depot to blocks."
      showHeaderActions
    >
      {/* 1. Academic Session Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        subtitle={`Depot to block textbook dispatch orders for session ${academicYear}.`}
      />

      {/* 2. Redesigned Premium KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* KPI 1: Total Challans */}
        <Card className="border-l-4 border-l-indigo-600 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Total Challans
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {dispatchHistoryData.length.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <i className="pi pi-file text-[11px]" />
                <span>Generated Dispatches</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shrink-0">
              <i className="pi pi-file text-xl" />
            </div>
          </div>
        </Card>

        {/* KPI 2: Total Bundles */}
        <Card className="border-l-4 border-l-blue-600 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Total Bundles
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalBundles.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                <i className="pi pi-box text-[11px]" />
                <span>Packed & Dispatched</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 shrink-0">
              <i className="pi pi-box text-xl" />
            </div>
          </div>
        </Card>

        {/* KPI 3: Total Books */}
        <Card className="border-l-4 border-l-emerald-600 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Total Books
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalBooks.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <i className="pi pi-book text-[11px]" />
                <span>Textbooks Sent</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 shrink-0">
              <i className="pi pi-book text-xl" />
            </div>
          </div>
        </Card>

        {/* KPI 4: Received */}
        <Card className="border-l-4 border-l-teal-600 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Received
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {acknowledged} / {dispatchHistoryData.length}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-teal-600 font-semibold">
                <i className="pi pi-check-circle text-[11px]" />
                <span>Block Receipts Verified</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-800/50 shrink-0">
              <i className="pi pi-check-circle text-xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Grid Card with Shared GridPanel */}
      <Card className="border border-slate-100 p-1 shadow-xs">
        <GridPanel<DispatchHistoryItem>
          toolbarPlacement="page"
          data={dispatchHistoryData}
          searchBox={true}
          searchPlaceholder="Search challan, block, truck..."
          exportFilename="depot_dispatch_history.xls"
          toolbar={
            <Button
              onClick={() =>
                navigate("/district-depot/dispatch/challan-to-block")
              }
              label="Create Dispatch"
              icon="pi pi-plus"
              variant="primary"
            />
          }
          columns={[
            {
              header: "S.No.",
              cell: (_, opt) => (
                <span className="text-gray-500 font-medium">
                  {opt.rowIndex + 1}
                </span>
              ),
              width: "60px",
              align: "center",
            },
            {
              field: "year",
              header: "Year",
              align: "center",
              sortable: true,
            },
            {
              field: "classGroup",
              header: "Class Group",
              align: "center",
              sortable: true,
            },
            {
              field: "depotCode",
              header: "Depot",
              align: "center",
              cell: (row) => (
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {row.depotCode}
                  </span>
                  <span className="text-gray-400 ml-1 text-[10px]">
                    ({row.depotName})
                  </span>
                </div>
              ),
              sortable: true,
            },
            {
              field: "blockName",
              header: "Block",
              align: "center",
              cell: (row) => (
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {row.blockName}
                </span>
              ),
              sortable: true,
            },
            {
              field: "challanNo",
              header: "Challan No",
              align: "center",
              cell: (row) => (
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {row.challanNo}
                </span>
              ),
              sortable: true,
            },
            {
              field: "date",
              header: "Date",
              align: "center",
              sortable: true,
            },
            {
              field: "totalBundles",
              header: "Bundles",
              align: "center",
              cell: (row) => (
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  {row.totalBundles.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "totalBooks",
              header: "Books",
              align: "center",
              cell: (row) => (
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {row.totalBooks.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "truckNo",
              header: "Truck No",
              align: "center",
              cell: (row) => (
                <span className="font-mono text-gray-600 dark:text-gray-400">
                  {row.truckNo}
                </span>
              ),
            },
            {
              field: "status",
              header: "Status",
              align: "center",
              cell: (row) => <StatusBadge status={row.status} />,
            },
            {
              header: "ACTION",
              align: "center",
              width: "100px",
              cell: (row) => (
                <Button
                  onClick={() => setReceiptItem(row)}
                  label="View"
                  icon="pi pi-file-pdf"
                  size="small"
                  variant="info"
                />
              ),
            },
          ]}
        />
      </Card>

      {receiptItem && (
        <DepotToBlockReceiptModal
          item={receiptItem}
          onClose={() => setReceiptItem(null)}
        />
      )}
    </Page>
  );
}
