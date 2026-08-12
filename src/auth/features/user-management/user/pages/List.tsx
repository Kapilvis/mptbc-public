import { ToastService } from "services";
import { StatusButton } from "shared/components/buttons";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useUserActiveStatusMutation, useUsersQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useUsersQuery();
  const { mutateAsync: toggleStatus } = useUserActiveStatusMutation();

  const handleToggleStatus = async (item: UserManagement.UserList) => {
    try {
      const result = await toggleStatus({
        id: item.id,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("User status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update user status");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage users for system access and administration."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["userName", "firstName", "lastName", "email"]}
          searchPlaceholder="Search..."
          addButtonLabel="Add"
          CreateForm={Create}
          EditForm={Edit}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            { field: "userName", header: "User Name" },
            { field: "firstName", header: "First Name" },
            { field: "lastName", header: "Last Name" },
            { field: "email", header: "Email" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: UserManagement.UserList) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: UserManagement.UserList) => (
            <Mosaic.Card
              title={`${item.firstName} ${item.lastName || ""}`}
              subTitle={[`Username: ${item.userName}`, `Email: ${item.email}`]}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
          emptyMessage="No User Records Found."
        />
      </Card>
    </Page>
  );
}
