import { Card, GridPanel, Mosaic } from "shared/components/panels";
import type { TitleWiseDistributionItem } from "../data";

interface DistrictMatrixTableProps {
  data: TitleWiseDistributionItem[];
  loading?: boolean;
}

export function DistrictMatrixTable({
  data,
  loading,
}: DistrictMatrixTableProps) {
  return (
    <Card>
      <div className="mb-3 flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Title Wise Textbook Distribution Report
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time title wise demand, supply, BRC receipts, and student
            distribution status
          </p>
        </div>
      </div>

      <GridPanel
        toolbarPlacement="panel"
        defaultMode="grid"
        data={data}
        loading={loading}
        showExport
        exportFilename="Title_Wise_Textbook_Distribution_Report"
        searchFields={[
          "districtName",
          "blockName",
          "titleName",
          "bookTypeName",
          "mediumName",
        ]}
        columns={[
          {
            field: "academicYear",
            header: "Academic Year",
            align: "center",
            width: "110px",
          },
          {
            field: "bookTypeName",
            header: "Book Type",
            align: "center",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {row.bookTypeName}
              </span>
            ),
          },
          {
            field: "mediumName",
            header: "Medium Name",
            cell: (row: TitleWiseDistributionItem) => row.mediumName,
          },
          {
            field: "districtName",
            header: "District Name",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-semibold text-gray-900 dark:text-white">
                {row.districtName}
              </span>
            ),
          },
          {
            field: "blockName",
            header: "Block Name",
            cell: (row: TitleWiseDistributionItem) => row.blockName,
          },
          {
            field: "titleName",
            header: "Title Name",
            width: "240px",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-semibold text-gray-900 dark:text-white block text-xs">
                {row.titleName}
              </span>
            ),
          },
          {
            field: "classId",
            header: "Class",
            align: "center",
            width: "70px",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {row.classId}
              </span>
            ),
          },
          {
            field: "blockDemandToTbc",
            header: "Block Demand to TBC",
            align: "right",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                {row.blockDemandToTbc.toLocaleString()}
              </span>
            ),
          },
          {
            field: "tbcSentToBrc",
            header: "TBC Sent to BRC",
            align: "right",
            cell: (row: TitleWiseDistributionItem) =>
              row.tbcSentToBrc.toLocaleString(),
          },
          {
            field: "tbcSentPercent",
            header: "TBC Sent %",
            align: "right",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {row.tbcSentPercent}%
              </span>
            ),
          },
          {
            field: "brcReceived",
            header: "BRC Received",
            align: "right",
            cell: (row: TitleWiseDistributionItem) =>
              row.brcReceived.toLocaleString(),
          },
          {
            field: "brcReceivedSortSupply",
            header: "BRC Short Supply",
            align: "right",
            cell: (row: TitleWiseDistributionItem) => (
              <span
                className={
                  row.brcReceivedSortSupply > 0
                    ? "font-bold text-amber-600"
                    : "text-gray-500"
                }
              >
                {row.brcReceivedSortSupply}
              </span>
            ),
          },
          {
            field: "brcReceivedDamaged",
            header: "BRC Damaged",
            align: "right",
            cell: (row: TitleWiseDistributionItem) => (
              <span
                className={
                  row.brcReceivedDamaged > 0
                    ? "font-bold text-rose-600"
                    : "text-gray-500"
                }
              >
                {row.brcReceivedDamaged}
              </span>
            ),
          },
          {
            field: "brcReceivedPercent",
            header: "BRC Recv %",
            align: "right",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {row.brcReceivedPercent}%
              </span>
            ),
          },
          {
            field: "brcSentToSchool",
            header: "BRC Sent to School",
            align: "right",
            cell: (row: TitleWiseDistributionItem) =>
              row.brcSentToSchool.toLocaleString(),
          },
          {
            field: "brcSentToSchoolPercent",
            header: "BRC Sent %",
            align: "right",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                {row.brcSentToSchoolPercent}%
              </span>
            ),
          },
          {
            field: "schoolDistributeToStudent",
            header: "School Distribute to Student",
            align: "right",
            cell: (row: TitleWiseDistributionItem) => (
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                {row.schoolDistributeToStudent.toLocaleString()}
              </span>
            ),
          },
        ]}
        renderContent={(item: TitleWiseDistributionItem) => (
          <Mosaic.Card
            title={item.titleName}
            subTitle={[
              `District: ${item.districtName} | Block: ${item.blockName}`,
              `Class: ${item.classId} | Book: ${item.bookTypeName} (${item.mediumName})`,
              `Block Demand: ${item.blockDemandToTbc.toLocaleString()}`,
              `BRC Recv: ${item.brcReceived.toLocaleString()} (${item.brcReceivedPercent}%)`,
              `Student Dist: ${item.schoolDistributeToStudent.toLocaleString()}`,
            ]}
            isActive={true}
          />
        )}
      />
    </Card>
  );
}
