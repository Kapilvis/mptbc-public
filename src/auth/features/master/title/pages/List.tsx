import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { masterUrls } from "auth/features/master/urls";
import StatusButton from "shared/components/buttons/StatusButton";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useTitleActiveStatusMutation, useTitlesQuery } from "../queries";

export default function List() {
  const navigate = useNavigate();
  const { data = [], isLoading } = useTitlesQuery();
  const { mutateAsync: toggleStatus } = useTitleActiveStatusMutation();

  const handleToggleStatus = async (item: Master.TitleItem) => {
    try {
      const result = await toggleStatus({
        titleId: item.titleId,
        isActive: !item.isActive,
      });
      if (result) {
        ToastService.success("Title status updated successfully");
      }
    } catch {
      ToastService.error("Failed to update title status");
    }
  };

  function CreateRedirect({ onSave }: { onSave: () => void }) {
    useEffect(() => {
      onSave();
      navigate(masterUrls.title.create);
    }, [onSave]);
    return null;
  }

  function EditRedirect({
    data: item,
    onSave,
  }: {
    data: Master.TitleItem;
    onSave: () => void;
  }) {
    useEffect(() => {
      onSave();
      if (item?.titleId) {
        navigate(masterUrls.title.edit(item.titleId));
      }
    }, [item, onSave]);
    return null;
  }

  const pageTitle = usePageTitle();

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Create and manage book titles, dimensions, GSM specifications, and paper area calculations."
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
            "className",
            "bookTypeName",
            "mediumName",
          ]}
          CreateForm={CreateRedirect}
          EditForm={EditRedirect}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: "50px",
              align: "center",
            },
            { field: "name", header: "Title Name" },
            { field: "code", header: "Code", align: "center" },
            { field: "className", header: "Class" },
            { field: "bookTypeName", header: "Book Type" },
            { field: "mediumName", header: "Medium" },
            {
              field: "totalPages",
              header: "Total Pages",
              align: "center",
              cell: (row: Master.TitleItem) => (
                <span>{row.totalPages} pages</span>
              ),
            },
            {
              field: "weight",
              header: "Weight",
              align: "center",
              cell: (row: Master.TitleItem) => <span>{row.weight} g</span>,
            },
            {
              field: "paperArea",
              header: "Paper Area",
              align: "center",
              cell: (row: Master.TitleItem) => <span>{row.paperArea} m²</span>,
            },
            {
              field: "isActive",
              header: "Status",
              align: "center",
              cell: (row: Master.TitleItem) => (
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
                item.className ? `Class: ${item.className}` : "",
                item.bookTypeName ? `Type: ${item.bookTypeName}` : "",
                item.mediumName ? `Medium: ${item.mediumName}` : "",
                `Pages: ${item.totalPages} | Area: ${item.paperArea} m²`,
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
