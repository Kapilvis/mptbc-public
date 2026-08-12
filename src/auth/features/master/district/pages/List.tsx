import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useDistrictActiveStatusMutation, useDistrictsQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data, isLoading } = useDistrictsQuery();
  const { mutateAsync: toggleStatus } = useDistrictActiveStatusMutation();

  const handleToggleStatus = async (item: Master.DistrictItem) => {
    try {
      const result = await toggleStatus({
        districtId: item.districtId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("District status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update district status");
    }
  };
  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create, update, and manage district information within the administrative hierarchy."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data ?? []}
          loading={isLoading}
          searchFields={["name", "localName", "code", "divisionName"]}
          CreateForm={Create}
          EditForm={Edit}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            { field: "divisionName", header: "Division" },
            { field: "name", header: "District" },
            { field: "localName", header: "Local Name" },
            { field: "code", header: "Code", align: "center" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.DistrictItem) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.DistrictItem) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                item.divisionName ? `Division: ${item.divisionName}` : "",
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
