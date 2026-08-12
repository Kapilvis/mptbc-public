import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useOfficeLevelActiveStatusMutation,
  useOfficeLevelsQuery,
} from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useOfficeLevelsQuery();

  const { mutateAsync: toggleStatus } = useOfficeLevelActiveStatusMutation();

  const handleToggleStatus = async (item: Master.OfficeLevelList) => {
    try {
      const result = await toggleStatus({
        officeLevelId: item.officeLevelId,
        isActive: !item.isActive,
      });

      if (result) {
        ToastService.success("Office level status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update office level status");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage office levels for hierarchical administration"
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName", "code"]}
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
            {
              field: "name",
              header: "Name",
            },
            {
              field: "localName",
              header: "Local Name",
            },
            {
              field: "code",
              header: "Code",
              align: "center",
            },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.OfficeLevelList) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.OfficeLevelList) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[item.localName || "", `Code: ${item.code}`].filter(
                Boolean,
              )}
              isActive={item.isActive}
              onStatusToggle={() => handleToggleStatus(item)}
            />
          )}
        />
      </Card>
    </Page>
  );
}
