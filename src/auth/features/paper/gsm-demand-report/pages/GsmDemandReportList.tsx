import { useState, useMemo } from "react";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import { CheckBox, DropDownList, TextBox } from "shared/components/forms";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { Modal } from "shared/components/popups";
import {
  useBulkLockGsmDemandMutation,
  useGsmPaperDemandsQuery,
  useLockGsmDemandMutation,
} from "../queries";

export default function GsmDemandReportList() {
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [paperCategory, setPaperCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedTitlesGsm, setSelectedTitlesGsm] =
    useState<Paper.GsmPaperDemandItem | null>(null);

  const { data = [], isLoading } = useGsmPaperDemandsQuery({
    academicYear,
    paperCategory,
    status,
    search,
  });

  const { mutateAsync: lockSingle, isPending: isSinglePending } =
    useLockGsmDemandMutation();

  const { mutateAsync: lockBulk, isPending: isBulkPending } =
    useBulkLockGsmDemandMutation();

  const academicYearOptions = [
    { label: "2026-2027", value: "2026-2027" },
    { label: "2025-2026", value: "2025-2026" },
  ];

  const categoryOptions = [
    { label: "All Paper Categories", value: "All" },
    { label: "Reel Paper (Inner Pages)", value: "Reel Paper (Inner)" },
    { label: "Sheet Paper (Cover Pages)", value: "Sheet Paper (Cover)" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Draft (Unlocked)", value: "Draft" },
    { label: "Locked / Finalized", value: "Locked" },
  ];

  const summaryStats = useMemo(() => {
    const totalGrossMt = data.reduce(
      (acc, curr) => acc + curr.grossDemandMt,
      0,
    );
    const totalBudgetLakhs = data.reduce(
      (acc, curr) => acc + curr.totalBudgetLakhs,
      0,
    );
    const lockedCount = data.filter((item) => item.status === "Locked").length;
    return {
      totalGrossMt: totalGrossMt.toFixed(2),
      totalBudgetCrores: (totalBudgetLakhs / 100).toFixed(2),
      totalBudgetLakhs: totalBudgetLakhs.toFixed(2),
      totalSpecs: data.length,
      lockedCount,
    };
  }, [data]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSingleLockChange = async (
    id: number,
    newStatus: Paper.DemandLockStatus,
  ) => {
    try {
      await lockSingle({ id, status: newStatus });
      ToastService.success(
        `GSM Paper Demand has been ${newStatus === "Locked" ? "Locked & Finalized for Tendering" : "reset to Draft"}.`,
      );
    } catch {
      ToastService.error("Failed to update GSM demand lock status");
    }
  };

  const handleBulkLockChange = async (newStatus: Paper.DemandLockStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await lockBulk({ ids: selectedIds, status: newStatus });
      ToastService.success(
        `Successfully locked ${selectedIds.length} GSM paper demand specification(s) for tender procurement.`,
      );
      setSelectedIds([]);
    } catch {
      ToastService.error("Failed to lock selected GSM demands");
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <Page
      header="GSM-Wise Paper Demand Report & Lock"
      subHeader="Consolidate textbook printing paper requirements by GSM specification, calculate gross tonnage with wastage, estimate budgets, and lock paper demands for paper tender procurement."
      showHeaderActions
    >
      {/* Top KPI Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Gross Demand
            </span>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-0.5">
              {summaryStats.totalGrossMt}{" "}
              <span className="text-sm font-bold">MT</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <i className="pi pi-box text-xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Est. Paper Budget
            </span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
              ₹ {summaryStats.totalBudgetCrores}{" "}
              <span className="text-sm font-bold">Cr</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <i className="pi pi-indian-rupee text-xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              GSM Specifications
            </span>
            <div className="text-2xl font-black text-purple-700 dark:text-purple-400 mt-0.5">
              {summaryStats.totalSpecs}{" "}
              <span className="text-sm font-bold">Types</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <i className="pi pi-tags text-xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Lock Status
            </span>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-0.5">
              {summaryStats.lockedCount} / {summaryStats.totalSpecs}{" "}
              <span className="text-xs font-bold text-gray-500">Locked</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <i className="pi pi-lock text-xl" />
          </div>
        </div>
      </div>

      {/* Top Filter Card */}
      <Card className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <DropDownList
              label="Academic Year"
              data={academicYearOptions}
              value={academicYear}
              onChange={(val) => setAcademicYear(String(val ?? "2026-2027"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <DropDownList
              label="Paper Category"
              data={categoryOptions}
              value={paperCategory}
              onChange={(val) => setPaperCategory(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <DropDownList
              label="Demand Lock Status"
              data={statusOptions}
              value={status}
              onChange={(val) => setStatus(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <TextBox
              label="Search Specification"
              value={search}
              onChange={(val) => setSearch(String(val ?? ""))}
              placeholder="Search code, GSM or usage..."
              icon="search"
              iconPosition="right"
            />
          </div>
        </div>
      </Card>

      {/* Grid Table Section */}
      <Card className="relative">
        <GridPanel
          toolbarPlacement="panel"
          defaultMode="grid"
          data={data}
          loading={isLoading}
          searchBox={false}
          showExport
          exportFilename={`GSM_Paper_Demand_Report_${academicYear}`}
          columns={[
            {
              header: (
                <div className="flex justify-center items-center">
                  <CheckBox
                    checked={isAllSelected}
                    onChange={(checked) => handleSelectAll(!!checked)}
                  />
                </div>
              ),
              width: "40px",
              align: "center",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <div className="flex justify-center items-center">
                  <CheckBox
                    checked={selectedIds.includes(row.id)}
                    onChange={(checked) => handleSelectRow(row.id, !!checked)}
                  />
                </div>
              ),
            },
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
              header: "S.No.",
            },
            {
              field: "gsmCode",
              header: "GSM",
              align: "center",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <span className="font-extrabold text-blue-800 dark:text-blue-300">
                  {row.gsmCode}
                </span>
              ),
            },
            {
              field: "gsmName",
              header: "GSM Specification",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {row.gsmName}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {row.usageType}
                  </div>
                </div>
              ),
            },
            // {
            //   field: "paperCategory",
            //   header: "Paper Category",
            //   align: "center",
            //   cell: (row: Paper.GsmPaperDemandItem) => (
            //     <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            //       {row.paperCategory}
            //     </span>
            //   ),
            // },
            {
              field: "titlesCount",
              header: "No. of Titles ",
              align: "center",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <div className="text-center">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {row.titlesCount} Titles
                  </span>
                  <div className="text-[11px] text-gray-500">
                    {(row.totalBooksCount / 100000).toFixed(2)} Lakh Books
                  </div>
                </div>
              ),
            },
            {
              field: "netDemandMt",
              header: "Net Demand (MT)",
              align: "right",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
                  {row.netDemandMt.toFixed(3)}
                </span>
              ),
            },
            {
              field: "wastagePercent",
              header: "Wastage",
              align: "center",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                  +{row.wastagePercent}%
                </span>
              ),
            },
            {
              field: "grossDemandMt",
              header: "Gross Demand (MT)",
              align: "right",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <span className="font-mono font-black text-blue-700 dark:text-blue-400 text-base">
                  {row.grossDemandMt.toFixed(3)}
                </span>
              ),
            },
            {
              field: "totalBudgetLakhs",
              header: "Est. Budget",
              align: "right",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  ₹ {row.totalBudgetLakhs.toFixed(2)} L
                </span>
              ),
            },
            // {
            //   field: "status",
            //   header: "Lock Status",
            //   align: "center",
            //   cell: (row: Paper.GsmPaperDemandItem) => (
            //     <span
            //       className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
            //         row.status === "Locked"
            //           ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            //           : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            //       }`}
            //     >
            //       {row.status === "Locked" ? "Locked / Finalized" : "Draft"}
            //     </span>
            //   ),
            // },
            {
              header: "Action",
              align: "center",
              width: "230px",
              cell: (row: Paper.GsmPaperDemandItem) => {
                if (row.status === "Draft") {
                  return (
                    <div className="flex items-center gap-1.5 justify-center">
                      <Button
                        label="Lock Demand"
                        icon="pi pi-lock"
                        size="small"
                        variant="outlined"
                        disabled={isSinglePending}
                        className="!text-emerald-700 !border-emerald-600 hover:!bg-emerald-50 dark:!text-emerald-400 dark:!border-emerald-500 !py-1 !px-2.5 !text-xs font-bold"
                        onClick={() => handleSingleLockChange(row.id, "Locked")}
                      />
                      <Button
                        label="View Titles"
                        icon="pi pi-list"
                        size="small"
                        variant="outlined"
                        className="!py-1 !px-2 !text-xs"
                        onClick={() => setSelectedTitlesGsm(row)}
                      />
                    </div>
                  );
                }

                return (
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <i className="pi pi-check-circle text-emerald-600" />
                      Locked for Tender
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSingleLockChange(row.id, "Draft")}
                      className="text-gray-400 hover:text-gray-600 text-xs p-1"
                      title="Unlock GSM Demand back to Draft"
                    >
                      <i className="pi pi-refresh" />
                    </button>
                  </div>
                );
              },
            },
          ]}
          renderContent={(item: Paper.GsmPaperDemandItem) => (
            <Mosaic.Card
              title={`${item.gsmCode} - ${item.gsmName}`}
              subTitle={[
                `Category: ${item.paperCategory}`,
                `Usage: ${item.usageType}`,
                `Gross MT: ${item.grossDemandMt.toFixed(3)} MT | Est. Budget: ₹ ${item.totalBudgetLakhs} L`,
                `Lock Status: ${item.status}`,
              ]}
              isActive={item.status === "Locked"}
            />
          )}
        />

        {/* Bottom Bulk Action Footer */}
        {selectedIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-3 mt-4 bg-emerald-50/50 border border-emerald-200 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/60 gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Selected: {selectedIds.length} GSM Specification(s)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                label={`Lock Selected Demands (${selectedIds.length})`}
                icon="pi pi-lock"
                size="small"
                variant="outlined"
                disabled={isBulkPending}
                className="!text-emerald-700 !border-emerald-600 hover:!bg-emerald-50 dark:!text-emerald-400 dark:!border-emerald-500 font-bold"
                onClick={() => handleBulkLockChange("Locked")}
              />
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Titles Breakdown Modal */}
      <Modal
        visible={!!selectedTitlesGsm}
        onHide={() => setSelectedTitlesGsm(null)}
        header={`Titles Breakdown for ${selectedTitlesGsm?.gsmName || ""}`}
        size="medium"
      >
        {selectedTitlesGsm && (
          <div className="space-y-4 p-1">
            {/* Header info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-800 dark:text-blue-300">
                  {selectedTitlesGsm.gsmCode}
                </span>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white mt-0.5">
                  {selectedTitlesGsm.gsmName}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {selectedTitlesGsm.usageType}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-gray-500 block">
                  Gross Paper Tonnage
                </span>
                <span className="text-lg font-black text-blue-700 dark:text-blue-300 font-mono">
                  {selectedTitlesGsm.grossDemandMt.toFixed(3)} MT
                </span>
              </div>
            </div>

            {/* Simulated Titles Table */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-xs">
              <div className="bg-gray-100 dark:bg-gray-800 p-2.5 font-bold text-gray-700 dark:text-gray-300 grid grid-cols-12 gap-2 border-b border-gray-200 dark:border-gray-700">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-6">Textbook Title</div>
                <div className="col-span-2 text-right">Quantity</div>
                <div className="col-span-3 text-right">Paper (MT)</div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-56 overflow-y-auto">
                <div className="p-2.5 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="col-span-1 text-center font-medium text-gray-400">
                    1
                  </div>
                  <div className="col-span-6 font-bold text-gray-900 dark:text-white">
                    Textbook / Bhasha Bharati - 1
                    <span className="block text-[11px] font-normal text-gray-500">
                      Class 1 (Hindi Medium)
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-mono">
                    15,00,000
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-blue-600">
                    148.50 MT
                  </div>
                </div>

                <div className="p-2.5 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="col-span-1 text-center font-medium text-gray-400">
                    2
                  </div>
                  <div className="col-span-6 font-bold text-gray-900 dark:text-white">
                    Anandmay Ganit - 1
                    <span className="block text-[11px] font-normal text-gray-500">
                      Class 1 (Hindi Medium)
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-mono">
                    15,00,000
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-blue-600">
                    148.50 MT
                  </div>
                </div>

                <div className="p-2.5 grid grid-cols-12 gap-2 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="col-span-1 text-center font-medium text-gray-400">
                    3
                  </div>
                  <div className="col-span-6 font-bold text-gray-900 dark:text-white">
                    English Reader - Class 5
                    <span className="block text-[11px] font-normal text-gray-500">
                      Class 5 (English Medium)
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-mono">
                    12,50,000
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-blue-600">
                    123.50 MT
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons inside modal */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                label="Close"
                size="small"
                variant="outlined"
                onClick={() => setSelectedTitlesGsm(null)}
              />
              {selectedTitlesGsm.status === "Draft" && (
                <Button
                  icon="pi pi-lock"
                  label="Lock & Freeze Demand for Tender"
                  size="small"
                  className="!bg-emerald-600 !text-white hover:!bg-emerald-700 font-bold"
                  onClick={() => {
                    handleSingleLockChange(selectedTitlesGsm.id, "Locked");
                    setSelectedTitlesGsm(null);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </Page>
  );
}
