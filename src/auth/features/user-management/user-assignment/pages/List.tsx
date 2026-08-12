import ToastService from "services/toast";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useDeleteUserAssignmentMutation,
  useUserAssignmentsQuery,
} from "../queries";
import Create from "./Create";

export default function List() {
  const { data = [], isLoading } = useUserAssignmentsQuery();
  const { mutateAsync: deleteAssignment } = useDeleteUserAssignmentMutation();

  const handleDelete = async (item: UserManagement.UserAssignmentList) => {
    try {
      const result = await deleteAssignment({
        userId: item.userId,
        roleName: item.roleName,
        domain: item.domain,
      });
      if (result) {
        ToastService.success("User assignment deleted successfully");
      }
    } catch {
      ToastService.error("Failed to delete user assignment");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage user role assignments across domains."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["userName", "roleName", "domain"]}
          searchPlaceholder="Search..."
          addButtonLabel="Add"
          CreateForm={Create}
          onDelete={handleDelete}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            { field: "userName", header: "User" },
            { field: "roleName", header: "Role" },
            { field: "domain", header: "Domain" },
          ]}
          renderContent={(item: UserManagement.UserAssignmentList) => (
            <Mosaic.Card
              title={item.userName}
              subTitle={[`Role: ${item.roleName}`, `Domain: ${item.domain}`]}
              onDelete={() => handleDelete(item)}
            />
          )}
          emptyMessage="No User Assignment Records Found."
        />
      </Card>
    </Page>
  );
}
