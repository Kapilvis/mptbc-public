import { ToastService } from "services";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useProjectActiveStatusMutation, useProjectsQuery } from "../queries";
import Create from "./Create";
import Edit from "./Edit";

export default function List() {
  const { data, isLoading } = useProjectsQuery();
  const { mutateAsync: toggleStatus } = useProjectActiveStatusMutation();

  const handleToggleStatus = async (item: Master.ProjectItem) => {
    try {
      const result = await toggleStatus({
        projectId: item.projectId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Project status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update project status");
    }
  };
  const pageTitle = usePageTitle();
  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create, update, and manage project information within the administrative hierarchy"
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data ?? []}
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
            { field: "name", header: "Project" },
            { field: "localName", header: "Local Name" },
            { field: "code", header: "Code", align: "center" },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.ProjectItem) => (
                <StatusButton
                  value={row.isActive}
                  onClick={() => handleToggleStatus(row)}
                />
              ),
            },
          ]}
          renderContent={(item: Master.ProjectItem) => (
            <Mosaic.Card
              title={item.name}
              subTitle={[
                item.divisionName ? `Division: ${item.divisionName}` : "",
                item.districtName ? `District: ${item.districtName}` : "",
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
