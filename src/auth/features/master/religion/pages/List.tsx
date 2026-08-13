import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useReligionActiveStatusMutation, useReligionsQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useReligionsQuery();
  const { mutateAsync: toggleStatus } = useReligionActiveStatusMutation();

  const handleToggleStatus = async (item: Master.ReligionItem) => {
    try {
      const result = await toggleStatus({
        religionId: item.religionId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Religion status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update religion status");
    }
  };
  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage religion data for accurate record keeping."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName", "code"]}
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
              cell: (row: Master.ReligionItem) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                item.localName || "",
                item.code ? `Code: ${item.code}` : "",
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
