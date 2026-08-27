import { useState } from "react";
import { Button } from "shared/components/buttons";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { formatDate } from "shared/utils/dateUtils";
import { DemandDetailDrawer } from "../components/DemandDetailDrawer";
import { useDepartmentDemandsQuery } from "../queries";

import { usePageTitle } from "shared/hooks/usePageTitle";

export default function List() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [selectedItem, setSelectedItem] =
    useState<Distribution.DepartmentDemandItem | null>(null);

  const { data = [], isLoading } = useDepartmentDemandsQuery({
    academicYear: academicYear,
    department: "All",
    district: "All",
    medium: "All",
    search: "",
  });

  const totalDemandQty = data.reduce((sum, item) => sum + item.demandQty, 0);

  return (
    <Page
      header={pageTitle || "Demand Received from Departments (RSK / CPI)"}
      subHeader="View and track department demand received from Rajya Shiksha Kendra (RSK) and Commissionerate of Public Instruction (CPI)."
      showHeaderActions
    >
      {/* Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        className="mb-4"
      />

      <Card className="border border-slate-100 shadow-xs">
        <GridPanel
          toolbarPlacement="page"
          defaultMode="grid"
          data={data}
          loading={isLoading}
          searchBox={true}
          searchPlaceholder="Search department, district, title..."
          showExport
          exportFilename="RSK_CPI_Department_Demand.xls"
          columns={[
            {
              cell: (_, option) => (
                <span className="text-slate-500 font-medium">
                  {option.rowIndex + 1}
                </span>
              ),
              width: "60px",
              align: "center",
            },
            {
              field: "agency",
              header: "DEPARTMENT",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span>{row.agency}</span>
              ),
            },
            {
              field: "district",
              header: "DISTRICT",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span>{row.district}</span>
              ),
            },
            {
              field: "block",
              header: "BLOCK",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span>{row.block}</span>
              ),
            },
            {
              field: "titleName",
              header: "BOOK TITLE",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span>{row.titleName}</span>
              ),
            },
            {
              field: "medium",
              header: "MEDIUM",
              align: "left",
            },
            {
              field: "classNo",
              header: "CLASS",
              align: "center",
              footer: (
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  Total:
                </span>
              ),
            },
            {
              field: "demandQty",
              header: "REQUESTED DEMAND",
              align: "center",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                  {row.demandQty.toLocaleString()}
                </span>
              ),
              footer: (
                <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">
                  {totalDemandQty.toLocaleString()} Books
                </span>
              ),
            },
            {
              field: "receivedDate",
              header: "RECEIVED DATE",
              align: "center",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span>{formatDate(row.receivedDate)}</span>
              ),
            },
            {
              header: "ACTION",
              align: "center",
              width: "100px",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <Button
                  icon="pi pi-chart-line"
                  label="Track"
                  size="small"
                  variant="info"
                  onClick={() => setSelectedItem(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Distribution.DepartmentDemandItem) => (
            <Mosaic.Card
              title={item.titleName}
              subTitle={[
                `District: ${item.district} | Block: ${item.block}`,
                `Agency: ${item.agency} | Class: ${item.classNo}`,
                `Demand Qty: ${item.demandQty.toLocaleString()}`,
                `Status: ${item.status}`,
              ]}
              isActive={item.status === "Approved"}
            />
          )}
        />

        {/* Total Summary Footer */}
        <div className="mt-4 p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex justify-between items-center text-xs font-bold text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200">
          <span>Total Received Demand Records: {data.length}</span>
          <span className="font-black text-sm">
            Overall Total Demand Qty: {totalDemandQty.toLocaleString()} Books
          </span>
        </div>
      </Card>

      {/* Side Tracker Drawer */}
      <DemandDetailDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </Page>
  );
}
