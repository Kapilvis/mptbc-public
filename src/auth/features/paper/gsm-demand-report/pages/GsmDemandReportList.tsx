import { useState, useMemo } from "react";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Modal } from "shared/components/popups";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { useGsmPaperDemandsQuery, useLockGsmDemandMutation } from "../queries";

export default function GsmDemandReportList() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");

  const [selectedTitlesGsm, setSelectedTitlesGsm] =
    useState<Paper.GsmPaperDemandItem | null>(null);

  const { data = [], isLoading } = useGsmPaperDemandsQuery({
    academicYear,
  });

  const { mutateAsync: lockSingle, isPending: isSinglePending } =
    useLockGsmDemandMutation();

  const summaryStats = useMemo(() => {
    const totalGrossMt = data.reduce(
      (acc, curr) => acc + curr.grossDemandMt,
      0,
    );
    const lockedCount = data.filter((item) => item.status === "Locked").length;
    return {
      totalGrossMt: Math.round(totalGrossMt).toLocaleString(),
      totalSpecs: data.length,
      lockedCount,
    };
  }, [data]);

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

  return (
    <Page
      header={pageTitle || "GSM-Wise Paper Demand Report & Lock"}
      subHeader="Consolidate textbook printing paper requirements by GSM specification, calculate gross tonnage with wastage, and lock paper demands for paper tender procurement."
      showHeaderActions
    >
      {/* Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
      />

      {/* Top KPI Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

      {/* Grid Table Section */}
      <Card className="border border-slate-100 shadow-xs">
        <GridPanel
          toolbarPlacement="page"
          defaultMode="grid"
          data={data}
          loading={isLoading}
          searchBox={true}
          searchPlaceholder="Search code, GSM or usage..."
          showExport
          exportFilename={`GSM_Paper_Demand_Report_${academicYear}`}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
              header: "S.NO.",
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
                  <div className="text-xs text-slate-900 dark:text-slate-100 font-semibold">
                    {row.usageType}
                  </div>
                </div>
              ),
            },
            {
              field: "titlesCount",
              header: "No. of Titles",
              align: "center",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <div className="text-center">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {row.titlesCount} Titles
                  </span>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {(row.totalBooksCount / 100000).toFixed(2)} Lakh Books
                  </div>
                </div>
              ),
            },
            {
              field: "netDemandMt",
              header: "Net Demand (MT)",
              align: "center",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {Math.round(row.netDemandMt).toLocaleString()}
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
              align: "center",
              cell: (row: Paper.GsmPaperDemandItem) => (
                <span className="font-mono font-black text-blue-700 dark:text-blue-400 text-base">
                  {Math.round(row.grossDemandMt).toLocaleString()}
                </span>
              ),
            },
            // {
            //   field: "totalBudgetLakhs",
            //   header: "Est. Budget",
            //   align: "right",
            //   cell: (row: Paper.GsmPaperDemandItem) => (
            //     <span className="font-bold text-emerald-800 dark:text-emerald-300">
            //       ₹ {row.totalBudgetLakhs.toFixed(2)} L
            //     </span>
            //   ),
            // },
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
                `Gross MT: ${Math.round(item.grossDemandMt).toLocaleString()} MT`,
                `Lock Status: ${item.status}`,
              ]}
              isActive={item.status === "Locked"}
            />
          )}
        />
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
                  {Math.round(selectedTitlesGsm.grossDemandMt).toLocaleString()}{" "}
                  MT
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
                    148 MT
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
                    148 MT
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
