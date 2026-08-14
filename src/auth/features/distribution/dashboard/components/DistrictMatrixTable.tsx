import { Card, GridPanel, Mosaic } from "shared/components/panels";
import type { DistrictMatrixItem } from "../data";

interface DistrictMatrixTableProps {
  data: DistrictMatrixItem[];
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
            District & Block Data Matrix
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Consolidated distribution status across districts and block clusters
          </p>
        </div>
      </div>

      <GridPanel
        toolbarPlacement="panel"
        defaultMode="grid"
        data={data}
        loading={loading}
        showExport
        exportFilename="District_Block_Data_Matrix"
        searchFields={["districtName"]}
        columns={[
          {
            field: "districtName",
            header: "District Name",
            cell: (row: DistrictMatrixItem) => (
              <span className="font-semibold text-gray-900 dark:text-white">
                {row.districtName}
              </span>
            ),
          },
          {
            field: "grossDemand",
            header: "Gross Demand (TBC)",
            align: "right",
            cell: (row: DistrictMatrixItem) => (
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                {row.grossDemand.toLocaleString()}
              </span>
            ),
          },
          {
            field: "sentToBrc",
            header: "Sent to BRC",
            align: "right",
            cell: (row: DistrictMatrixItem) => row.sentToBrc.toLocaleString(),
          },
          {
            field: "brcRecvPercent",
            header: "BRC Recv %",
            align: "right",
            cell: (row: DistrictMatrixItem) => (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {row.brcRecvPercent}%
              </span>
            ),
          },
          {
            field: "shortDamaged",
            header: "Short/Damaged",
            align: "right",
            cell: (row: DistrictMatrixItem) => (
              <span
                className={
                  row.shortDamaged > 0
                    ? "font-bold text-rose-600"
                    : "text-gray-500"
                }
              >
                {row.shortDamaged}
              </span>
            ),
          },
          {
            field: "sentToSchool",
            header: "Sent to School",
            align: "right",
            cell: (row: DistrictMatrixItem) =>
              row.sentToSchool.toLocaleString(),
          },
          {
            field: "studentDistPercent",
            header: "Student Dist. %",
            align: "right",
            cell: (row: DistrictMatrixItem) => (
              <span className="font-bold text-blue-700 dark:text-blue-400">
                {row.studentDistPercent}%
              </span>
            ),
          },
        ]}
        renderContent={(item: DistrictMatrixItem) => (
          <Mosaic.Card
            title={item.districtName}
            subTitle={[
              `Gross Demand: ${item.grossDemand.toLocaleString()}`,
              `Sent to BRC: ${item.sentToBrc.toLocaleString()} (${item.brcRecvPercent}%)`,
              `Sent to School: ${item.sentToSchool.toLocaleString()}`,
              `Student Dist: ${item.studentDistPercent}%`,
            ]}
            isActive={true}
          />
        )}
      />
    </Card>
  );
}
