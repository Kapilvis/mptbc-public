import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import {
  getBookPaperRequirements,
  deleteBookPaperRequirement,
} from "../bookPaperRequirementService";
import { usePageTitle } from "shared/hooks/usePageTitle";

export default function List() {
  const navigate = useNavigate();
  const pageTitle = usePageTitle();
  const queryClient = useQueryClient();

  const { data: requirements = [], isLoading: loading } = useQuery({
    queryKey: ["book-paper-requirements"],
    queryFn: getBookPaperRequirements,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBookPaperRequirement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-paper-requirements"] });
      ToastService.success("Book paper requirement deleted successfully");
    },
    onError: () => {
      ToastService.error("Failed to delete book paper requirement");
    },
  });

  const totals = useMemo(() => {
    return requirements.reduce(
      (acc, curr) => {
        acc.inner += curr.innerPaperMt;
        acc.cover += curr.coverPaperMt;
        acc.books += curr.numberOfBooks;
        return acc;
      },
      { inner: 0, cover: 0, books: 0 },
    );
  }, [requirements]);

  const gsmGroups = useMemo(() => {
    const groups: {
      [key: string]: {
        pagesGsmName: string;
        coverGsmName: string;
        totalInnerPaperMt: number;
        totalCoverPaperMt: number;
        count: number;
      };
    } = {};

    requirements.forEach((req) => {
      const key = `${req.pagesGsmName}-${req.coverGsmName}`;
      if (!groups[key]) {
        groups[key] = {
          pagesGsmName: req.pagesGsmName,
          coverGsmName: req.coverGsmName,
          totalInnerPaperMt: 0,
          totalCoverPaperMt: 0,
          count: 0,
        };
      }
      groups[key].totalInnerPaperMt += req.innerPaperMt;
      groups[key].totalCoverPaperMt += req.coverPaperMt;
      groups[key].count += 1;
    });

    return Object.values(groups);
  }, [requirements]);

  const handleEdit = (item: BookPaperRequirement.Item) => {
    navigate(`edit/${item.bookPaperRequirementId}`);
  };

  const handleDelete = async (item: BookPaperRequirement.Item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      await deleteMutation.mutateAsync(item.bookPaperRequirementId);
    }
  };

  const columns: Controls.ColumnProps<BookPaperRequirement.Item>[] = [
    {
      field: "bookPaperRequirementId",
      cell: (_: BookPaperRequirement.Item, option: { rowIndex: number }) => (
        <span className="text-slate-600 font-medium">
          {option.rowIndex + 1}
        </span>
      ),
      header: "S.No.",
      width: "60px",
      align: "center",
      sortable: false,
    },
    {
      field: "title",
      header: "Title",
      sortable: true,
      footer: (
        <span className="font-bold text-slate-700 uppercase tracking-wide">
          Total Paper Requirement (MT)
        </span>
      ),
    },
    {
      field: "numberOfBooks",
      header: "Number of Books",
      align: "center",
      cell: (row: BookPaperRequirement.Item) => (
        <span>{row.numberOfBooks.toLocaleString()}</span>
      ),
      footer: (
        <span className="font-bold text-slate-700 text-base">
          {totals.books.toLocaleString()}
        </span>
      ),
    },
    {
      field: "pagesPerBook",
      header: "Pages",
      align: "center",
      cell: (row: BookPaperRequirement.Item) => (
        <span>{row.pagesPerBook.toLocaleString()}</span>
      ),
    },
    {
      field: "pagesGsmName",
      header: "Pages (GSM)",
      align: "center",
    },
    {
      field: "coverGsmName",
      header: "Cover (GSM)",
      align: "center",
    },
    {
      field: "innerPaperMt",
      header: "Pages (MT)",
      align: "center",
      cell: (row: BookPaperRequirement.Item) => (
        <span className="font-mono font-semibold text-blue-600">
          {Math.round(row.innerPaperMt).toLocaleString()} MT
        </span>
      ),
      footer: (
        <span className="font-mono font-bold text-blue-600 text-base">
          {Math.round(totals.inner).toLocaleString()} MT
        </span>
      ),
    },
    {
      field: "coverPaperMt",
      header: "Cover (MT)",
      align: "center",
      cell: (row: BookPaperRequirement.Item) => (
        <span className="font-mono font-semibold text-emerald-600">
          {Math.round(row.coverPaperMt).toLocaleString()} MT
        </span>
      ),
      footer: (
        <span className="font-mono font-bold text-emerald-600 text-base">
          {Math.round(totals.cover).toLocaleString()} MT
        </span>
      ),
    },
    {
      field: "createdOn",
      header: "Total (MT)",
      align: "center",
      cell: (row: BookPaperRequirement.Item) => (
        <span className="font-mono font-bold text-slate-800">
          {Math.round(row.innerPaperMt + row.coverPaperMt).toLocaleString()} MT
        </span>
      ),
      footer: (
        <span className="font-mono font-extrabold text-slate-800 text-base">
          {Math.round(totals.inner + totals.cover).toLocaleString()} MT
        </span>
      ),
    },
  ];

  const grossPaper = Math.round(totals.inner + totals.cover);
  const paperOpeningStock = 60; // 60 MT Opening Stock in Godown
  const actualPaperRequirement = Math.max(0, grossPaper - paperOpeningStock); // 3,707 MT

  const kpiCards = [
    {
      label: "Books (Work Allocation)",
      value: totals.books.toLocaleString(),
      subLabel: "For Printer Work Orders",
      icon: "pi-book",
      accent: "border-l-purple-600",
      iconBg:
        "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50",
      subColor: "text-purple-600",
    },
    {
      label: "Required Paper (Gross)",
      value: `${grossPaper.toLocaleString()} MT`,
      subLabel: `Inner: ${Math.round(totals.inner)} MT • Cover: ${Math.round(totals.cover)} MT`,
      icon: "pi-copy",
      accent: "border-l-blue-600",
      iconBg:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
      subColor: "text-blue-600",
    },
    {
      label: "Paper Opening Stock",
      value: `${paperOpeningStock.toLocaleString()} MT`,
      subLabel: "Deducted from Godown Stock",
      icon: "pi-box",
      accent: "border-l-amber-500",
      iconBg:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
      subColor: "text-amber-600",
    },
    {
      label: "Actual Requirement",
      value: `${actualPaperRequirement.toLocaleString()} MT`,
      subLabel: "Gross (3,767) − Opening Stock (60)",
      icon: "pi-check-circle",
      accent: "border-l-emerald-600",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
      subColor: "text-emerald-600",
    },
  ];

  return (
    <Page
      header={pageTitle || "Book Paper Requirement"}
      subHeader="Calculate and manage textbook printing paper requirements in Metric Tons (MT)."
      showHeaderActions
    >
      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.label}
            className={`border-l-4 ${kpi.accent} border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow`}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  {kpi.label}
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </div>
                <div
                  className={`mt-1 flex items-center gap-1.5 text-xs ${kpi.subColor} font-semibold`}
                >
                  <i className={`pi ${kpi.icon} text-[11px]`} />
                  <span>{kpi.subLabel}</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${kpi.iconBg}`}
              >
                <i className={`pi ${kpi.icon} text-xl`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <Card className="border border-slate-100 p-1">
          <GridPanel
            toolbarPlacement="page"
            data={requirements}
            loading={loading}
            searchBox={true}
            searchPlaceholder="Search Title..."
            mode="both"
            searchFields={["title"]}
            defaultMode="grid"
            toolbar={
              <Button
                label="Add"
                icon="plus"
                onClick={() => navigate("create")}
                variant="primary"
                className="shadow-sm font-bold text-xs"
              />
            }
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No book paper requirements found."
            exportFilename="Book_Paper_Requirements.xls"
            renderMosaicFooter={() =>
              gsmGroups.length > 0 ? (
                <div className="border-t border-slate-100 p-5 bg-slate-50/30 rounded-b-xl">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                    Total Paper Requirement (MT)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gsmGroups.map((group) => (
                      <div
                        key={`${group.pagesGsmName}-${group.coverGsmName}`}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 text-xs font-bold rounded bg-blue-50 text-blue-700">
                              {group.pagesGsmName}
                            </span>
                            <span className="text-slate-400 text-xs">/</span>
                            <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-50 text-emerald-700">
                              {group.coverGsmName}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                            {group.count}
                            {group.count === 1 ? " Record" : " Records"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Total Inner (MT)
                            </span>
                            <span className="text-xl font-extrabold text-blue-600 font-mono mt-1">
                              {Math.round(
                                group.totalInnerPaperMt,
                              ).toLocaleString()}{" "}
                              MT
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Total Cover (MT)
                            </span>
                            <span className="text-xl font-extrabold text-emerald-600 font-mono mt-1">
                              {Math.round(
                                group.totalCoverPaperMt,
                              ).toLocaleString()}{" "}
                              MT
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            }
          />
        </Card>
      </div>
    </Page>
  );
}
