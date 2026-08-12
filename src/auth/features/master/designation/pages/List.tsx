import ToastService from "services/toast";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useDesignationActiveStatusMutation,
  useDesignationQuery,
} from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useDesignationQuery();
  const { mutateAsync: toggleStatus } = useDesignationActiveStatusMutation();

  const handleToggleStatus = async (item: Master.DesignationList) => {
    try {
      const result = await toggleStatus({
        designationId: item.designationId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Designation status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update designation status");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage designations for organizational hierarchy."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName", "code"]}
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
            { field: "name", header: "Name" },
            { field: "localName", header: "Local Name" },
            { field: "code", header: "Code", align: "center" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.DesignationList) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.DesignationList) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[item.localName || "", item.code].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>
    </Page>
  );
}
