import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Button } from "shared/components/buttons";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import {
  useEmployeesQuery,
  useDeleteEmployeeMutation,
  useEmployeeActiveStatusMutation,
} from "../queries";
import { useNavigate } from "react-router-dom";

export default function List() {
  const { data = [], isLoading } = useEmployeesQuery();
  const navigate = useNavigate();
  const { mutateAsync: deleteEmployee } = useDeleteEmployeeMutation();
  const { mutateAsync: toggleStatus } = useEmployeeActiveStatusMutation();
  const { confirmAction } = useConfirmDialog();
  const pageTitle = usePageTitle();

  const handleToggleStatus = async (item: HRMS.EmployeeRegistration) => {
    try {
      const result = await toggleStatus({
        employeeId: item.employeeId,
        isActive: item.employmentStatus !== "Active",
      });
      if (result) {
        ToastService.success("Employee status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update employee status");
    }
  };

  const handleDeleteClick = (employee: HRMS.EmployeeRegistration) => {
    confirmAction({
      message: `Are you sure you want to delete the employee record for ${employee.fullName} (${employee.employeeCode})?`,
      header: "Delete Confirmation",
      icon: "trash",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      onAccept: async () => {
        try {
          const success = await deleteEmployee(employee.employeeId);
          if (success) {
            ToastService.success("Employee record deleted successfully");
          }
        } catch {
          ToastService.error("Failed to delete employee record");
        }
      },
    });
  };

  // Helper to extract employee name initials
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Simple date formatter
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Manage employee records and organizational details."
      showHeaderActions
    >
      <ConfirmDialog />

      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          onDelete={handleDeleteClick}
          onEdit={(item: HRMS.EmployeeRegistration) =>
            navigate(`./edit/${item.employeeId}`)
          }
          searchFields={[
            "employeeCode",
            "fullName",
            "department",
            "designation",
            "mobileNumber",
            "employeeType",
          ]}
          toolbar={
            <Button
              label="Add"
              icon="plus"
              onClick={() => navigate("./create")}
              variant="primary"
              className="shadow-sm font-bold text-xs"
            />
          }
          columns={[
            {
              cell: (_, option) => (
                <span className="text-slate-600 font-medium">
                  {option.rowIndex + 1}
                </span>
              ),
              width: "60px",
              align: "center",
              header: "S.No.",
            },
            { field: "employeeCode", header: "Employee Code", sortable: true },
            { field: "fullName", header: "Full Name", sortable: true },
            { field: "department", header: "Department", sortable: true },
            { field: "designation", header: "Designation", sortable: true },
            { field: "mobileNumber", header: "Mobile Number" },
            { field: "employeeType", header: "Employee Type", sortable: true },
            {
              cell: (item: HRMS.EmployeeRegistration) =>
                formatDate(item.joiningDate),
              header: "Joining Date",
              sortable: true,
            },
            {
              cell: (item: HRMS.EmployeeRegistration) => {
                const isActive = item.employmentStatus === "Active";
                return (
                  <StatusButton
                    value={isActive}
                    onClick={() => handleToggleStatus(item)}
                  />
                );
              },
              header: "Status",
              align: "center",
              sortable: true,
            },
          ]}
          renderContent={(item: HRMS.EmployeeRegistration) => {
            const initials = getInitials(item.fullName);
            const isActive = item.employmentStatus === "Active";

            return (
              <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative group h-full">
                {/* Status indicator top right */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {item.employmentStatus}
                  </span>
                </div>

                {/* Avatar Icon */}
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border-2 border-slate-100 text-slate-500 text-lg font-bold shadow-inner group-hover:scale-105 transition-transform duration-300 overflow-hidden mb-4">
                  {item.profilePhoto ? (
                    <img
                      src={item.profilePhoto}
                      alt={item.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                {/* Employee Info */}
                <h3 className="font-bold text-sm text-slate-800 line-clamp-1 mb-0.5">
                  {item.fullName}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-4 block">
                  {item.employeeCode}
                </span>

                {/* Details list */}
                <div className="w-full space-y-2 text-left text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Department</span>
                    <span className="font-medium text-slate-800 line-clamp-1">
                      {item.department}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Designation</span>
                    <span className="font-medium text-slate-800 line-clamp-1">
                      {item.designation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mobile</span>
                    <span className="font-medium text-slate-800">
                      {item.mobileNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className="font-medium text-slate-800">
                      {item.employeeType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Status</span>
                    <StatusButton
                      value={isActive}
                      onClick={() => handleToggleStatus(item)}
                    />
                  </div>
                </div>
              </div>
            );
          }}
          renderFooterActions={(item: HRMS.EmployeeRegistration) => (
            <Button
              icon="trash"
              size="small"
              onClick={() => handleDeleteClick(item)}
              className="p-button-danger button-variant-danger"
              tooltip="Delete employee record"
            />
          )}
        />
      </Card>
    </Page>
  );
}
