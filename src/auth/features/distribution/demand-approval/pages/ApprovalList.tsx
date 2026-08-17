import { useState } from "react";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import { CheckBox, DropDownList, TextBox } from "shared/components/forms";
import { Card, GridPanel } from "shared/components/panels";
import Page from "shared/components/panels/Page";

import {
  useBulkApprovalStatusMutation,
  useDemandApprovalsQuery,
  useUpdateApprovalStatusMutation,
} from "../queries";

export default function ApprovalList() {
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [agency, setAgency] = useState("All");
  const [bookType, setBookType] = useState("All");
  const [classGroup, setClassGroup] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data = [], isLoading } = useDemandApprovalsQuery({
    academicYear,
    agency,
    bookType,
    classGroup,
    search,
  });

  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateApprovalStatusMutation();
  const { mutateAsync: bulkUpdateStatus, isPending: isBulkUpdating } =
    useBulkApprovalStatusMutation();

  const academicYearOptions = [
    { label: "2026-2027", value: "2026-2027" },
    { label: "2025-2026", value: "2025-2026" },
  ];

  const agencyOptions = [
    { label: "All Agencies / Districts", value: "All" },
    { label: "RSK - Bhopal", value: "RSK - Bhopal" },
    { label: "District Aggregation", value: "District Aggregation" },
  ];

  const bookTypeOptions = [
    { label: "All Book Types", value: "All" },
    { label: "पाठ्यपुस्तक", value: "पाठ्यपुस्तक" },
    { label: "एटग्रेड", value: "एटग्रेड" },
  ];

  const classGroupOptions = [
    { label: "All Classes", value: "All" },
    { label: "High School 9-12", value: "High School 9-12" },
    { label: "Classes 1-8", value: "Classes 1-8" },
  ];

  const handleAction = async (
    id: number,
    status: Distribution.DemandStatus,
  ) => {
    try {
      await updateStatus({ id, status });
      ToastService.success(`Demand status updated to ${status}`);
    } catch {
      ToastService.error("Failed to update demand status");
    }
  };

  const handleBulkSubmit = async (status: Distribution.DemandStatus) => {
    if (!selectedIds.length) return;
    try {
      await bulkUpdateStatus({ ids: selectedIds, status });
      ToastService.success(
        `Successfully ${status.toLowerCase()} ${selectedIds.length} demands in bulk`,
      );
      setSelectedIds([]);
    } catch {
      ToastService.error("Failed to execute bulk action");
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const selectedItems = data.filter((item) => selectedIds.includes(item.id));
  const totalSelectedDemand = selectedItems.reduce(
    (sum, item) => sum + item.requestedDemand,
    0,
  );

  return (
    <Page
      header="Approval of Agency Textbooks Demand"
      subHeader="Review and process textbook demand requests submitted by agencies (RSK / CPI)."
      showHeaderActions
    >
      {/* Top Filter Card */}
      <Card className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
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
              label="Agency / District"
              data={agencyOptions}
              value={agency}
              onChange={(val) => setAgency(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <DropDownList
              label="Book Type"
              data={bookTypeOptions}
              value={bookType}
              onChange={(val) => setBookType(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <DropDownList
              label="Class"
              data={classGroupOptions}
              value={classGroup}
              onChange={(val) => setClassGroup(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <TextBox
              label="Search"
              value={search}
              onChange={(val) => setSearch(String(val ?? ""))}
              placeholder="Search demand title..."
              icon="search"
              iconPosition="right"
            />
          </div>
        </div>
      </Card>

      {/* Main Table Grid */}
      <Card className="relative">
        <GridPanel
          toolbarPlacement="panel"
          defaultMode="grid"
          data={data}
          loading={isLoading}
          searchBox={false}
          showExport
          exportFilename="Pending_Agency_Demands_Approval"
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
              cell: (row: Distribution.DemandApprovalItem) => (
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
              field: "agencyName",
              header: "Department",
              align: "center",
              width: "100px",
            },
            {
              field: "district",
              header: "District",
              cell: (row: Distribution.DemandApprovalItem) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {row.district}
                </span>
              ),
            },
            {
              field: "titleName",
              header: "Book Title",
              width: "240px",
              cell: (row: Distribution.DemandApprovalItem) => (
                <span className="font-semibold text-gray-900 dark:text-white block text-xs">
                  {row.titleName}
                </span>
              ),
            },
            { field: "bookType", header: "Book Type", align: "center" },
            { field: "classGroup", header: "Class", align: "center" },
            { field: "medium", header: "Medium", align: "center" },
            {
              field: "requestedDemand",
              header: "Requested Demand",
              align: "right",
              cell: (row: Distribution.DemandApprovalItem) => (
                <span className="font-bold text-gray-900 dark:text-white">
                  {row.requestedDemand.toLocaleString()}
                </span>
              ),
            },
            {
              field: "currentStock",
              header: "Current TBC Stock",
              align: "right",
              cell: (row: Distribution.DemandApprovalItem) => (
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {row.currentStock}
                </span>
              ),
            },
            {
              field: "variance",
              header: "Variance",
              align: "center",
              cell: (row: Distribution.DemandApprovalItem) => (
                <span
                  className={
                    row.variance.startsWith("-")
                      ? "text-rose-600 font-bold"
                      : "text-emerald-600 font-bold"
                  }
                >
                  {row.variance}
                </span>
              ),
            },
            {
              header: "Approval Action",
              align: "center",
              width: "240px",
              cell: (row: Distribution.DemandApprovalItem) => {
                if (row.status === "Pending") {
                  return (
                    <div className="flex items-center gap-1.5 justify-center">
                      <Button
                        label="Approve"
                        icon="pi pi-check"
                        size="small"
                        variant="outlined"
                        disabled={isUpdating}
                        className="!text-emerald-700 !border-emerald-600 hover:!bg-emerald-50 dark:!text-emerald-400 dark:!border-emerald-500 !py-1 !px-2.5 !text-xs font-semibold"
                        onClick={() => handleAction(row.id, "Approved")}
                      />
                      <Button
                        label="Reject"
                        icon="pi pi-times"
                        size="small"
                        variant="outlined"
                        disabled={isUpdating}
                        className="!text-rose-700 !border-rose-600 hover:!bg-rose-50 dark:!text-rose-400 dark:!border-rose-500 !py-1 !px-2.5 !text-xs font-semibold"
                        onClick={() => handleAction(row.id, "Rejected")}
                      />
                      <Button
                        label="Hold"
                        icon="pi pi-pause"
                        size="small"
                        variant="outlined"
                        disabled={isUpdating}
                        className="!text-amber-700 !border-amber-500 hover:!bg-amber-50 dark:!text-amber-400 dark:!border-amber-500 !py-1 !px-2.5 !text-xs font-semibold"
                        onClick={() => handleAction(row.id, "Hold")}
                      />
                    </div>
                  );
                }

                return (
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        row.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : row.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                            : "bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700"
                      }`}
                    >
                      {row.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAction(row.id, "Pending")}
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
        />

        {/* Bottom Bulk Action Footer */}
        {selectedIds.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-3 mt-4 bg-emerald-50/50 border border-emerald-200 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/60 gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Selected: {selectedIds.length} demand(s)
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold border-l border-emerald-300 dark:border-emerald-800 pl-3">
                Total Qty: {totalSelectedDemand.toLocaleString()} Units
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                label={`Approve (${selectedIds.length})`}
                icon="pi pi-check"
                size="small"
                variant="outlined"
                disabled={isBulkUpdating}
                className="!text-emerald-700 !border-emerald-600 hover:!bg-emerald-50 dark:!text-emerald-400 dark:!border-emerald-500 font-bold"
                onClick={() => handleBulkSubmit("Approved")}
              />
              <Button
                label={`Reject (${selectedIds.length})`}
                icon="pi pi-times"
                size="small"
                variant="outlined"
                disabled={isBulkUpdating}
                className="!text-rose-700 !border-rose-600 hover:!bg-rose-50 dark:!text-rose-400 dark:!border-rose-500 font-bold"
                onClick={() => handleBulkSubmit("Rejected")}
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
    </Page>
  );
}
