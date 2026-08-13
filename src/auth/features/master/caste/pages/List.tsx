import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useCasteActiveStatusMutation, useCastesQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useCastesQuery();
  const { mutateAsync: toggleStatus } = useCasteActiveStatusMutation();

  const handleToggleStatus = async (item: Master.CasteList) => {
    try {
      const result = await toggleStatus({
        casteId: item.casteId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Caste status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update caste status");
    }
  };
  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and Manage caste data for accurate beneficiary records."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName"]}
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
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.CasteList) => (
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
              subTitle={[item.localName || ""].filter(Boolean)}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>
    </Page>
  );
}
