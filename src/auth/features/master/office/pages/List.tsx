import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useOfficeActiveStatusMutation, useOfficesQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useOfficesQuery();
  const { mutateAsync: toggleStatus } = useOfficeActiveStatusMutation();

  const handleToggleStatus = async (item: Master.OfficeItem) => {
    try {
      const result = await toggleStatus({
        officeId: item.officeId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Office status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update Office status");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Register and manage offices for organizational structure"
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={[
            "name",
            "localName",
            "code",
            "officeLevelName",
            "officeTypeName",
          ]}
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
            { field: "name", header: "Office Name" },
            { field: "code", header: "Office Code", align: "center" },
            { field: "officeLevelName", header: "Office Level" },
            { field: "officeTypeName", header: "Office Type" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.OfficeItem) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.OfficeItem) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                `Office Level: ${item.officeLevelName}`,
                `Office Type: ${item.officeTypeName}`,
                item.localName || "",
                `Code: ${item.code}`,
              ].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
          searchBox
          emptyMessage="No Office Records Found."
        />
      </Card>
    </Page>
  );
}
