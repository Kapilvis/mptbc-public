import { ToastService } from "services";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Button } from "shared/components/buttons";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { useTransportersQuery, useDeleteTransporterMutation } from "../queries";
import { useNavigate } from "react-router-dom";

export default function List() {
  const { data = [], isLoading } = useTransportersQuery();
  const navigate = useNavigate();
  const { mutateAsync: deleteTransporter } = useDeleteTransporterMutation();
  const { confirmAction } = useConfirmDialog();
  const pageTitle = usePageTitle();

  const handleDeleteClick = (trans: Transportation.TransporterRegistration) => {
    confirmAction({
      message: `Are you sure you want to delete the transporter record for ${trans.transporterName} (${trans.registrationNo})?`,
      header: "Delete Confirmation",
      icon: "trash",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      onAccept: async () => {
        try {
          const success = await deleteTransporter(trans.transporterId);
          if (success) {
            ToastService.success("Transporter record deleted successfully");
          }
        } catch {
          ToastService.error("Failed to delete transporter record");
        }
      },
    });
  };

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="View and manage textbook transportation partners."
      showHeaderActions
    >
      <ConfirmDialog />

      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          onDelete={handleDeleteClick}
          onEdit={(item: Transportation.TransporterRegistration) =>
            navigate(`./edit/${item.transporterId}`)
          }
          searchFields={[
            "registrationNo",
            "transporterName",
            "transporterType",
            "ownerName",
            "mobile",
            "email",
            "district",
          ]}
          toolbar={
            <Button
              label="Add"
              icon="plus"
              onClick={() => navigate("./create")}
              variant="primary"
              className="shadow-sm font-bold text-xs"
            />
          }
          columns={[
            {
              cell: (_, option) => (
                <span className="text-slate-600 font-medium">
                  {option.rowIndex + 1}
                </span>
              ),
              width: "60px",
              align: "center",
              header: "S.No.",
            },
            { field: "registrationNo", header: "Reg No.", sortable: true },
            {
              field: "transporterName",
              header: "Transporter Name",
              sortable: true,
            },
            { field: "transporterType", header: "Type", sortable: true },
            { field: "ownerName", header: "Owner Name", sortable: true },
            { field: "mobile", header: "Mobile" },
            {
              cell: (item: Transportation.TransporterRegistration) => (
                <span>{`${item.district}, ${item.state}`}</span>
              ),
              header: "District & State",
            },
            {
              cell: (item: Transportation.TransporterRegistration) => {
                const isQualified = item.technicalStatus === "Qualified";
                return (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                      isQualified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {isQualified ? "Technically Qualified" : "Not Qualified"}
                  </span>
                );
              },
              header: "Technical Status",
              sortable: true,
            },
          ]}
          renderContent={(item: Transportation.TransporterRegistration) => {
            const isQualified = item.technicalStatus === "Qualified";
            return (
              <Mosaic.Card
                title={item.transporterName}
                subTitle={[
                  item.firmName ? `Firm Name: ${item.firmName}` : "",
                  `Reg No: ${item.registrationNo}`,
                  `Type: ${item.transporterType}`,
                  `Owner: ${item.ownerName}`,
                  `Mobile: ${item.mobile}`,
                  `District: ${item.district}`,
                ]}
              >
                <div
                  className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase border rounded ${
                    isQualified
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {isQualified ? "Qualified" : "Not Qualified"}
                </div>
              </Mosaic.Card>
            );
          }}
          renderFooterActions={(
            item: Transportation.TransporterRegistration,
          ) => (
            <Button
              icon="trash"
              size="small"
              onClick={() => handleDeleteClick(item)}
              className="p-button-danger button-variant-danger"
              tooltip="Delete transporter record"
            />
          )}
        />
      </Card>
    </Page>
  );
}
