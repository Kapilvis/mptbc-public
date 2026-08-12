import { ToastService } from "services";
import { StatusButton } from "shared/components/buttons";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useUserRoleActiveStatusMutation, useUserRolesQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useUserRolesQuery();
  const { mutateAsync: toggleStatus } = useUserRoleActiveStatusMutation();

  const handleToggleStatus = async (item: UserManagement.UserRoleList) => {
    try {
      const result = await toggleStatus({
        id: item.id,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Role status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update role status");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage user roles for system access control."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "description"]}
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
            { field: "name", header: "Role Name" },
            { field: "description", header: "Description" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: UserManagement.UserRoleList) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: UserManagement.UserRoleList) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                item.description ? `Description: ${item.description}` : "",
              ].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>
    </Page>
  );
}
