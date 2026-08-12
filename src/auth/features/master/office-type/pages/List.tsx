import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useOfficeTypeActiveStatusMutation,
  useOfficeTypesQuery,
} from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useOfficeTypesQuery();
  const { mutateAsync: toggleStatus } = useOfficeTypeActiveStatusMutation();

  const handleToggleStatus = async (item: Master.OfficeTypeList) => {
    try {
      const result = await toggleStatus({
        officeTypeId: item.officeTypeId,
        isActive: !item.isActive,
      });

      if (result) {
        ToastService.success("Office type status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update office type status");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage office types for hierarchical administration"
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName", "code", "officeLevelName"]}
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
            { field: "officeLevelName", header: "Office Level" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.OfficeTypeList) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.OfficeTypeList) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                `Office Level: ${item.officeLevelName}`,
                item.localName || "",
                `Code: ${item.code}`,
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
