import { useState } from "react";
import { Button } from "shared/components/buttons";
import { DropDownList, TextBox } from "shared/components/forms";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { DemandDetailDrawer } from "../components/DemandDetailDrawer";
import { useDepartmentDemandsQuery } from "../queries";

export default function List() {
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [department, setDepartment] = useState("All");
  const [district, setDistrict] = useState("All");
  const [medium, setMedium] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<Distribution.DepartmentDemandItem | null>(null);

  const { data = [], isLoading } = useDepartmentDemandsQuery({
    academicYear,
    department,
    district,
    medium,
    search,
  });

  const academicYearOptions = [
    { label: "2026-2027", value: "2026-2027" },
    { label: "2025-2026", value: "2025-2026" },
  ];

  const departmentOptions = [
    { label: "All Agencies", value: "All" },
    { label: "RSK / CPI", value: "RSK/CPI" },
    { label: "RSK", value: "RSK" },
    { label: "CPI", value: "CPI" },
  ];

  const districtOptions = [
    { label: "All Districts", value: "All" },
    { label: "Agar Malwa", value: "Agar Malwa" },
    { label: "Alirajpur", value: "Alirajpur" },
    { label: "Anuppur", value: "Anuppur" },
    { label: "Betul", value: "Betul" },
    { label: "Bhind", value: "Bhind" },
    { label: "Guna", value: "Guna" },
    { label: "Ratlam", value: "Ratlam" },
    { label: "Sehore", value: "Sehore" },
  ];

  const mediumOptions = [
    { label: "All Mediums", value: "All" },
    { label: "Hindi Medium", value: "Hindi Medium" },
    { label: "English Medium", value: "English Medium" },
    { label: "Urdu Medium", value: "Urdu Medium" },
    { label: "Marathi Medium", value: "Marathi Medium" },
  ];

  const totalDemandQty = data.reduce((sum, item) => sum + item.demandQty, 0);

  const renderStatusBadge = (status: Distribution.DemandStatus) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
            Pending
          </span>
        );
      case "In Process":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
            In Process
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800">
            Rejected
          </span>
        );
    }
  };

  return (
    <Page
      header="Demand Received from Departments (RSK / CPI)"
      subHeader="View and track department demand received from Rajya Shiksha Kendra (RSK) and Commissionerate of Public Instruction (CPI)."
      showHeaderActions
    >
      <Card className="mb-4">
        {/* Top Filters Bar */}
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
              label="Department / Agency"
              data={departmentOptions}
              value={department}
              onChange={(val) => setDepartment(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <DropDownList
              label="District"
              data={districtOptions}
              value={district}
              onChange={(val) => setDistrict(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <DropDownList
              label="Medium"
              data={mediumOptions}
              value={medium}
              onChange={(val) => setMedium(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <TextBox
              label="Search"
              value={search}
              onChange={(val) => setSearch(String(val ?? ""))}
              placeholder="Search keyword..."
              icon="search"
              iconPosition="right"
            />
          </div>
        </div>
      </Card>

      <Card>
        <GridPanel
          toolbarPlacement="panel"
          defaultMode="grid"
          data={data}
          loading={isLoading}
          searchBox={false}
          showExport
          exportFilename="RSK_CPI_Department_Demand"
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
              header: "S.No.",
            },
            { field: "agency", header: "Agency", align: "center" },
            { field: "district", header: "District" },
            { field: "block", header: "Block" },
            { field: "titleName", header: "Title Name" },
            { field: "medium", header: "Medium" },
            { field: "classNo", header: "Class", align: "center" },
            {
              field: "demandQty",
              header: "Demand Qty (TBC)",
              align: "right",
              cell: (row: Distribution.DepartmentDemandItem) => (
                <span className="font-bold text-gray-900 dark:text-white">
                  {row.demandQty.toLocaleString()}
                </span>
              ),
            },
            { field: "receivedDate", header: "Received Date", align: "center" },
            {
              field: "status",
              header: "Status",
              align: "center",
              cell: (row: Distribution.DepartmentDemandItem) =>
                renderStatusBadge(row.status),
            },
            {
              cell: (row: Distribution.DepartmentDemandItem) => (
                <Button
                  icon="pi pi-chart-line"
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedItem(row)}
                />
              ),
              width: "70px",
              align: "center",
              header: "Tracker",
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
        <div className="mt-4 p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex justify-between items-center text-sm font-bold text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200">
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
