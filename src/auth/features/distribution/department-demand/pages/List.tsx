import { useState } from "react";
import { Button } from "shared/components/buttons";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { DemandDetailDrawer } from "../components/DemandDetailDrawer";
import { useDepartmentDemandsQuery } from "../queries";

import { usePageTitle } from "shared/hooks/usePageTitle";

export default function List() {
  const pageTitle = usePageTitle();
  const [selectedItem, setSelectedItem] =
    useState<Distribution.DepartmentDemandItem | null>(null);

  const { data = [], isLoading } = useDepartmentDemandsQuery({
    academicYear: "2026-2027",
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
              header: "S.NO.",
            },
            {
              field: "agency",
              header: "DEPARTMENT",
              align: "center",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {row.agency}
                </span>
              ),
            },
            {
              field: "district",
              header: "DISTRICT",
              align: "center",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {row.district}
                </span>
              ),
            },
            {
              field: "block",
              header: "BLOCK",
              align: "center",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {row.block}
                </span>
              ),
            },
            {
              field: "titleName",
              header: "BOOK TITLE",
              align: "center",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {row.titleName}
                </span>
              ),
            },
            {
              field: "medium",
              header: "MEDIUM",
              align: "center",
            },
            {
              field: "classNo",
              header: "CLASS",
              align: "center",
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
            },
            {
              field: "receivedDate",
              header: "RECEIVED DATE",
              align: "center",
            },
            // {
            //   field: "status",
            //   header: "STATUS",
            //   align: "center",
            //   cell: (row: Distribution.DepartmentDemandItem) =>
            //     renderStatusBadge(row.status),
            // },
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
          <span>
            Overall Total Demand Qty: {totalDemandQty.toLocaleString()} Units
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
