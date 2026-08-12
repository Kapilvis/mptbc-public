import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useQualificationActiveStatusMutation,
  useQualificationQuery,
} from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useQualificationQuery();
  const { mutateAsync: toggleStatus } = useQualificationActiveStatusMutation();

  const handleToggleStatus = async (item: Master.QualificationList) => {
    try {
      const result = await toggleStatus({
        qualificationId: item.qualificationId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Qualification status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update qualification status");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage qualifications for personnel records."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName", "qualificationTypeName"]}
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
            { field: "name", header: "Name" },
            { field: "localName", header: "Local Name" },
            { field: "qualificationTypeName", header: "Qualification Type" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.QualificationList) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.QualificationList) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                `Qualification Type: ${item.qualificationTypeName}`,
                item.localName || "",
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
