import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useBlockActiveStatusMutation, useBlocksQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useBlocksQuery();
  const { mutateAsync: toggleStatus } = useBlockActiveStatusMutation();

  const handleToggleStatus = async (item: Master.BlockItem) => {
    try {
      const result = await toggleStatus({
        blockId: item.blockId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Block status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update block status");
    }
  };

  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create, update, and manage block information within the administrative location hierarchy."
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
            "districtName",
            "divisionName",
          ]}
          CreateForm={Create}
          EditForm={Edit}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            { field: "divisionName", header: "Division" },
            { field: "districtName", header: "District" },
            { field: "name", header: "Block Name" },
            { field: "localName", header: "Local Name" },
            { field: "code", header: "Code", align: "center" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.BlockItem) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.BlockItem) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                item.divisionName ? `Division: ${item.divisionName}` : "",
                item.districtName ? `District: ${item.districtName}` : "",
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
