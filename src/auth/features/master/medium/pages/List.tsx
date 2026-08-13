import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useMediumActiveStatusMutation, useMediumsQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useMediumsQuery();
  const { mutateAsync: toggleStatus } = useMediumActiveStatusMutation();

  const handleToggleStatus = async (item: Master.MediumItem) => {
    try {
      const result = await toggleStatus({
        mediumId: item.mediumId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Medium status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update medium status");
    }
  };
  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage medium of instruction (Hindi, English, Urdu, Marathi)."
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
            { field: "name", header: "Medium Name" },
            { field: "localName", header: "Local Name" },
            { field: "code", header: "Code", align: "center" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.MediumItem) => (
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
