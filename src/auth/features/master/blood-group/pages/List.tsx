import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useBloodGroupActiveStatusMutation,
  useBloodGroupsQuery,
} from "../queries";

export default function List() {
  const { data = [], isLoading } = useBloodGroupsQuery();
  const { mutateAsync: toggleStatus } = useBloodGroupActiveStatusMutation();

  const handleToggleStatus = async (item: Master.BloodGroupItem) => {
    try {
      const result = await toggleStatus({
        bloodGroupId: item.bloodGroupId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Blood Group status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update Blood Group status");
    }
  };
  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Manage blood group dictionary for medical and beneficiary records."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName", "code"]}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            { field: "name", header: "Blood Group" },
            { field: "localName", header: "Local Name" },
            { field: "code", header: "Code", align: "center" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.BloodGroupItem) => (
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
