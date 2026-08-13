import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useGsmActiveStatusMutation, useGsmsQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useGsmsQuery();
  const { mutateAsync: toggleStatus } = useGsmActiveStatusMutation();

  const handleToggleStatus = async (item: Master.GsmItem) => {
    try {
      const result = await toggleStatus({
        gsmId: item.gsmId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("GSM status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update GSM status");
    }
  };
  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage paper types, GSM weights, and specifications."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName", "usage", "code"]}
          CreateForm={Create}
          EditForm={Edit}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            { field: "name", header: "Paper Type" },
            { field: "localName", header: "Local Name" },
            {
              field: "gsmValue",
              header: "GSM",
              align: "center",
              cell: (row: Master.GsmItem) => <span>{row.gsmValue} GSM</span>,
            },
            { field: "usage", header: "Usage" },
            { field: "code", header: "Specification", align: "center" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.GsmItem) => (
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
                `${item.gsmValue} GSM`,
                item.usage ? `Usage: ${item.usage}` : "",
                item.code ? `Spec: ${item.code}` : "",
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
