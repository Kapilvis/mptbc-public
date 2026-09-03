import React, { useState } from "react";
import { GridPanel } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { BlockWiseDemandFilterBar } from "../components/BlockWiseDemandFilterBar";
import { type BlockDemandRow, type DemandReportFilter } from "../data";
import { useBlockWiseDemandQuery } from "../queries";

export const BlockWiseTextbookDemandReportPage: React.FC = () => {
  const pageTitle = usePageTitle();
  const [filter, setFilter] = useState<DemandReportFilter>({
    academicYear: "2026-2027",
    medium: "Hindi Medium",
    classLabel: "Class 9",
    districtSearch: "",
  });

  const { data, isLoading } = useBlockWiseDemandQuery(filter);

  const handleFilterChange = (updated: Partial<DemandReportFilter>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  };

  // Build dynamic GridPanel columns
  const gridColumns: Controls.ColumnProps<BlockDemandRow>[] = [
    {
      cell: (_, opt: { rowIndex: number }) => (
        <span>{(opt?.rowIndex ?? 0) + 1}</span>
      ),
      width: "50px",
      align: "center",
    },

    {
      field: "district",
      header: "DISTRICT",
      cell: (row: BlockDemandRow) => (
        <span className="font-semibold uppercase text-slate-900 dark:text-white">
          {row.district}
        </span>
      ),
      footer: (
        <span className="font-black text-emerald-800 dark:text-emerald-300 tracking-wider uppercase">
          TOTAL DEMAND
        </span>
      ),
    },
    {
      field: "block",
      header: "BLOCK",
      cell: (row: BlockDemandRow) => (
        <span className="font-bold uppercase">{row.block}</span>
      ),
      // footer: (
      //   <span className="font-bold text-slate-500">
      //     {data?.rows.length || 0} Blocks
      //   </span>
      // ),
    },
    {
      field: "bcode",
      header: "BCODE",
      align: "center",
      cell: (row: BlockDemandRow) => (
        <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
          {row.bcode}
        </span>
      ),
    },
    ...(data?.titleHeaders.map(
      (title): Controls.ColumnProps<BlockDemandRow> => ({
        header: title,
        align: "center",
        cell: (row: BlockDemandRow) => {
          const q = row.quantities[title] || 0;
          return (
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {q > 0 ? q.toLocaleString() : "0"}
            </span>
          );
        },
        footer: (
          <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
            {(data?.totals[title] || 0).toLocaleString()}
          </span>
        ),
      }),
    ) || []),
  ];

  return (
    <Page
      header={pageTitle || "Block Wise Textbook Demand Report"}
      subHeader="Subject-wise and Class-wise textbook demand matrix calculated from block requirements."
      showHeaderActions
    >
      {/* Interactive Filter Bar */}
      <BlockWiseDemandFilterBar filter={filter} onChange={handleFilterChange} />

      {/* Main Grid Panel (Grid title provided directly to GridPanel matching Image 2) */}
      <GridPanel<BlockDemandRow>
        data={data?.rows || []}
        loading={isLoading}
        columns={gridColumns}
      />
    </Page>
  );
};

export default BlockWiseTextbookDemandReportPage;
