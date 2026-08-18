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
        return acc;
      },
      { inner: 0, cover: 0 },
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
      header: "Number of Titles",
      align: "right",
      cell: (row: BookPaperRequirement.Item) => (
        <span>{row.numberOfBooks.toLocaleString()}</span>
      ),
    },
    {
      field: "pagesPerBook",
      header: "Pages",
      align: "right",
      cell: (row: BookPaperRequirement.Item) => (
        <span>{row.pagesPerBook.toLocaleString()}</span>
      ),
    },
    {
      field: "pagesGsmName",
      header: "GSM (Pages)",
    },
    {
      field: "coverGsmName",
      header: "GSM (Cover)",
    },
    {
      field: "innerPaperMt",
      header: "Pages (MT)",
      align: "right",
      cell: (row: BookPaperRequirement.Item) => (
        <span className="font-mono font-semibold text-blue-600">
          {row.innerPaperMt.toFixed(3)}
        </span>
      ),
      footer: (
        <span className="font-mono font-bold text-blue-600 text-base">
          {totals.inner.toFixed(3)}
        </span>
      ),
    },
    {
      field: "coverPaperMt",
      header: "Cover (MT)",
      align: "right",
      cell: (row: BookPaperRequirement.Item) => (
        <span className="font-mono font-semibold text-emerald-600">
          {row.coverPaperMt.toFixed(3)}
        </span>
      ),
      footer: (
        <span className="font-mono font-bold text-emerald-600 text-base">
          {totals.cover.toFixed(3)}
        </span>
      ),
    },
  ];

  return (
    <Page
      header={pageTitle || "Book Paper Requirement"}
      subHeader="Calculate and manage textbook printing paper requirements in Metric Tons (MT)."
      showHeaderActions
    >
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
                              {group.totalInnerPaperMt.toFixed(3)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Total Cover (MT)
                            </span>
                            <span className="text-xl font-extrabold text-emerald-600 font-mono mt-1">
                              {group.totalCoverPaperMt.toFixed(3)}
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
