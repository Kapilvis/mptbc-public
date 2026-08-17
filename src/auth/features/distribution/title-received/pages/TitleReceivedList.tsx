import { useState } from "react";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import { CheckBox, DropDownList, TextBox } from "shared/components/forms";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { Modal } from "shared/components/popups";
import {
  useBulkUpdateTitleReceivedMutation,
  useTitleReceivedQuery,
  useUpdateTitleReceivedMutation,
} from "../queries";

export default function TitleReceivedList() {
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [department, setDepartment] = useState("All");
  const [receiptStatus, setReceiptStatus] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedDocTitle, setSelectedDocTitle] =
    useState<Distribution.TitleReceivedItem | null>(null);

  const { data = [], isLoading } = useTitleReceivedQuery({
    academicYear,
    department,
    receiptStatus,
    search,
  });

  const { mutateAsync: updateSingle, isPending: isSinglePending } =
    useUpdateTitleReceivedMutation();

  const { mutateAsync: updateBulk, isPending: isBulkPending } =
    useBulkUpdateTitleReceivedMutation();

  const academicYearOptions = [
    { label: "2026-2027", value: "2026-2027" },
    { label: "2025-2026", value: "2025-2026" },
  ];

  const departmentOptions = [
    { label: "All Departments", value: "All" },
    { label: "RSK (Class 1-8)", value: "RSK" },
    { label: "CPI (Class 9-12)", value: "CPI" },
  ];

  const receiptStatusOptions = [
    { label: "All Receiving Statuses", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Received", value: "Received" },
    { label: "Need Info", value: "Need Info" },
  ];

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

  const handleSingleStatusChange = async (
    id: number,
    newStatus: Distribution.ReceiptStatus,
  ) => {
    try {
      await updateSingle({ id, status: newStatus });
      ToastService.success(`Title receiving status updated to ${newStatus}`);
    } catch {
      ToastService.error("Failed to update receiving status");
    }
  };

  const handleBulkStatusChange = async (
    newStatus: Distribution.ReceiptStatus,
  ) => {
    if (selectedIds.length === 0) return;
    try {
      await updateBulk({ ids: selectedIds, status: newStatus });
      ToastService.success(
        `Successfully marked ${selectedIds.length} titles as ${newStatus}`,
      );
      setSelectedIds([]);
    } catch {
      ToastService.error("Failed to execute bulk receipt action");
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <Page
      header="Title Demand Received (RSK / CPI)"
      subHeader="Receive, verify soft copy matter specifications, and acknowledge textbook demand proposals sent by RSK (Class 1-8) and CPI (Class 9-12)."
      showHeaderActions
    >
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
              label="Department"
              data={departmentOptions}
              value={department}
              onChange={(val) => setDepartment(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <DropDownList
              label="Receiving Status"
              data={receiptStatusOptions}
              value={receiptStatus}
              onChange={(val) => setReceiptStatus(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <TextBox
              label="Search Proposal"
              value={search}
              onChange={(val) => setSearch(String(val ?? ""))}
              placeholder="Search code or title name..."
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
          exportFilename={`Title_Demand_Received_${academicYear}`}
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
              cell: (row: Distribution.TitleReceivedItem) => (
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
              field: "titleCode",
              header: "Title Code",
              align: "center",
              cell: (row: Distribution.TitleReceivedItem) => (
                <span className="font-extrabold text-emerald-800 dark:text-emerald-300">
                  {row.titleCode}
                </span>
              ),
            },
            {
              field: "titleName",
              header: "Title Name",
              cell: (row: Distribution.TitleReceivedItem) => (
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {row.titleName}
                  </div>
                  {row.localTitleName && (
                    <div className="text-xs text-gray-500 font-medium">
                      {row.localTitleName}
                    </div>
                  )}
                </div>
              ),
            },
            {
              field: "department",
              header: "Department",
              align: "center",
              cell: (row: Distribution.TitleReceivedItem) => (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-extrabold ${
                    row.department === "RSK"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                  }`}
                >
                  {row.department}
                </span>
              ),
            },
            {
              field: "className",
              header: "Class & Medium",
              cell: (row: Distribution.TitleReceivedItem) => (
                <span>
                  {row.className} ({row.medium})
                </span>
              ),
            },
            {
              field: "totalPages",
              header: "Book Type & Pages",
              align: "center",
              cell: (row: Distribution.TitleReceivedItem) => (
                <span>
                  {row.bookType} ({row.totalPages} pages)
                </span>
              ),
            },
            {
              header: "Soft Copy PDF",
              align: "center",
              cell: (row: Distribution.TitleReceivedItem) => (
                <Button
                  icon="pi pi-file-pdf"
                  label="View Doc"
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedDocTitle(row)}
                />
              ),
            },
            {
              field: "submissionDate",
              header: "Submission Date",
              align: "center",
            },
            {
              field: "receiptStatus",
              header: "Receiving Status",
              align: "center",
              cell: (row: Distribution.TitleReceivedItem) => (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    row.receiptStatus === "Received"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : row.receiptStatus === "Pending"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  {row.receiptStatus}
                </span>
              ),
            },
            {
              header: "Action",
              align: "center",
              width: "220px",
              cell: (row: Distribution.TitleReceivedItem) => {
                if (row.receiptStatus === "Pending") {
                  return (
                    <div className="flex items-center gap-1.5 justify-center">
                      <Button
                        label="Mark Received"
                        icon="pi pi-check-circle"
                        size="small"
                        variant="outlined"
                        disabled={isSinglePending}
                        className="!text-emerald-700 !border-emerald-600 hover:!bg-emerald-50 dark:!text-emerald-400 dark:!border-emerald-500 !py-1 !px-2.5 !text-xs font-semibold"
                        onClick={() =>
                          handleSingleStatusChange(row.id, "Received")
                        }
                      />
                      <Button
                        label="Need Info"
                        icon="pi pi-info-circle"
                        size="small"
                        variant="outlined"
                        disabled={isSinglePending}
                        className="!text-amber-700 !border-amber-500 hover:!bg-amber-50 dark:!text-amber-400 dark:!border-amber-500 !py-1 !px-2.5 !text-xs font-semibold"
                        onClick={() =>
                          handleSingleStatusChange(row.id, "Need Info")
                        }
                      />
                    </div>
                  );
                }

                return (
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        row.receiptStatus === "Received"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                      }`}
                    >
                      {row.receiptStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSingleStatusChange(row.id, "Pending")
                      }
                      className="text-gray-400 hover:text-gray-600 text-xs p-1"
                      title="Reset to Pending"
                    >
                      <i className="pi pi-refresh" />
                    </button>
                  </div>
                );
              },
            },
          ]}
          renderContent={(item: Distribution.TitleReceivedItem) => (
            <Mosaic.Card
              title={`${item.titleCode} - ${item.titleName}`}
              subTitle={[
                item.localTitleName || "",
                `Department: ${item.department} | Class: ${item.className}`,
                `Medium: ${item.medium} | Pages: ${item.totalPages}`,
                `Submitted: ${item.submissionDate} | Status: ${item.receiptStatus}`,
              ]}
              isActive={item.receiptStatus === "Received"}
            />
          )}
        />

        {/* Bottom Bulk Action Footer */}
        {selectedIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-3 mt-4 bg-emerald-50/50 border border-emerald-200 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/60 gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Selected: {selectedIds.length} title proposal(s)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                label={`Mark Selected as Received (${selectedIds.length})`}
                icon="pi pi-check-circle"
                size="small"
                variant="outlined"
                disabled={isBulkPending}
                className="!text-emerald-700 !border-emerald-600 hover:!bg-emerald-50 dark:!text-emerald-400 dark:!border-emerald-500 font-bold"
                onClick={() => handleBulkStatusChange("Received")}
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

      {/* Soft Copy Document Viewer Modal */}
      <Modal
        visible={!!selectedDocTitle}
        onHide={() => setSelectedDocTitle(null)}
        header={`Title Soft Copy & Specifications - ${selectedDocTitle?.titleCode || ""}`}
        size="small"
      >
        {selectedDocTitle && (
          <div className="space-y-4 p-1">
            {/* Title Header Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-800 dark:text-emerald-300">
                  {selectedDocTitle.titleCode}
                </span>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white mt-0.5">
                  {selectedDocTitle.titleName}
                </h3>
                {selectedDocTitle.localTitleName && (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {selectedDocTitle.localTitleName}
                  </p>
                )}
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-extrabold ${
                  selectedDocTitle.department === "RSK"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-purple-600 text-white shadow-sm"
                }`}
              >
                {selectedDocTitle.department}
              </span>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-semibold block text-[11px]">
                  Class & Medium
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedDocTitle.className} ({selectedDocTitle.medium})
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-semibold block text-[11px]">
                  Book Type & Pages
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedDocTitle.bookType} ({selectedDocTitle.totalPages}{" "}
                  Pages)
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-semibold block text-[11px]">
                  Inner & Cover GSM
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  Inner: {selectedDocTitle.innerGsm} | Cover:{" "}
                  {selectedDocTitle.coverGsm}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-semibold block text-[11px]">
                  Weight & Paper Area
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {selectedDocTitle.weight}g | {selectedDocTitle.paperArea} m²
                </span>
              </div>
            </div>

            {/* PDF Attachment & Action Box */}
            <div className="border border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl p-5 text-center bg-emerald-50/30 dark:bg-emerald-950/20">
              <i className="pi pi-file-pdf text-red-500 text-3xl mb-2 inline-block" />
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                {selectedDocTitle.titleCode}_Matter_Copy_2026.pdf
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Official textbook matter PDF received from{" "}
                {selectedDocTitle.department} for receiving verification.
              </p>

              <div className="flex items-center justify-center gap-3 mt-4">
                <Button
                  icon="pi pi-download"
                  label="Download Matter PDF"
                  size="small"
                  onClick={() =>
                    ToastService.success("Downloading Matter PDF Document...")
                  }
                />
                <Button
                  icon="pi pi-check-circle"
                  label="Acknowledge & Mark Received"
                  size="small"
                  variant="outlined"
                  className="!text-emerald-700 !border-emerald-600 hover:!bg-emerald-600 hover:!text-white"
                  onClick={() => {
                    handleSingleStatusChange(selectedDocTitle.id, "Received");
                    setSelectedDocTitle(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Page>
  );
}
