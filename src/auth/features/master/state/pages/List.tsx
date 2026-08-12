import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useStateActiveStatusMutation, useStatesQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data, isLoading } = useStatesQuery();
  const { mutateAsync: toggleStatus } = useStateActiveStatusMutation();

  const handleToggleStatus = async (item: Master.StateItem) => {
    try {
      const result = await toggleStatus({
        stateId: item.stateId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("State status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update state status");
    }
  };
  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create, update, and manage state information within the administrative hierarchy"
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data ?? []}
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
            { field: "lgdCode", header: "LGD Code", align: "center" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.StateItem) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.StateItem) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                item.localName || "",
                `Code: ${item.code}`,
                item.lgdCode ? `LGD: ${item.lgdCode}` : "",
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
