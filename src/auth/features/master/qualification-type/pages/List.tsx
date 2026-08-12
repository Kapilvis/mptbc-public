import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  useQualificationTypeActiveStatusMutation,
  useQualificationTypesQuery,
} from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data = [], isLoading } = useQualificationTypesQuery();
  const { mutateAsync: toggleStatus } =
    useQualificationTypeActiveStatusMutation();

  const handleToggleStatus = async (item: Master.QualificationTypeList) => {
    try {
      const result = await toggleStatus({
        qualificationTypeId: item.qualificationTypeId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Qualification Type updated successfully");
      }
    } catch {
      ToastService.error("Failed to update qualification type");
    }
  };

  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage qualification types for personnel record classification."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          searchFields={["name", "localName"]}
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
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.QualificationTypeList) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.QualificationTypeList) => (
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
