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
    },
    {
      field: "numberOfBooks",
      header: "Number of Books",
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
      header: "Pages GSM",
    },
    {
      field: "coverGsmName",
      header: "Cover GSM",
    },
    {
      field: "innerPaperMt",
      header: "Inner Paper (MT)",
      align: "right",
      cell: (row: BookPaperRequirement.Item) => (
        <span className="font-mono font-semibold text-blue-600">
          {row.innerPaperMt.toFixed(3)}
        </span>
      ),
    },
    {
      field: "coverPaperMt",
      header: "Cover Paper (MT)",
      align: "right",
      cell: (row: BookPaperRequirement.Item) => (
        <span className="font-mono font-semibold text-emerald-600">
          {row.coverPaperMt.toFixed(3)}
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
          />
        </Card>
      </div>
    </Page>
  );
}
