import { ToastService } from "services";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Button } from "shared/components/buttons";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { useTransportersQuery } from "../../transporter-registration/queries";
import { useVehiclesQuery, useDeleteVehicleMutation } from "../queries";
import { useNavigate } from "react-router-dom";

export default function List() {
  const { data = [], isLoading } = useVehiclesQuery();
  const { data: transporters = [] } = useTransportersQuery();
  const navigate = useNavigate();
  const { mutateAsync: deleteVehicle } = useDeleteVehicleMutation();
  const { confirmAction } = useConfirmDialog();
  const pageTitle = usePageTitle();

  const handleDeleteClick = (veh: Transportation.Vehicle) => {
    confirmAction({
      message: `Are you sure you want to delete the vehicle record for ${veh.registrationNo} (${veh.model})?`,
      header: "Delete Confirmation",
      icon: "trash",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      onAccept: async () => {
        try {
          const success = await deleteVehicle(veh.vehicleId);
          if (success) {
            ToastService.success("Vehicle record deleted successfully");
          }
        } catch {
          ToastService.error("Failed to delete vehicle record");
        }
      },
    });
  };

  // Helper to determine vehicle compliance status
  const getDocumentStatus = (veh: Transportation.Vehicle) => {
    const today = new Date();
    const dates = [
      new Date(veh.rcExpiry),
      new Date(veh.insuranceExpiry),
      new Date(veh.fitnessExpiry),
      new Date(veh.permitExpiry),
      new Date(veh.pucExpiry),
    ];

    const hasExpired = dates.some((d) => d.getTime() < today.getTime());
    if (hasExpired)
      return {
        label: "Expired Docs",
        className: "bg-rose-50 text-rose-700 border-rose-200",
      };

    const warningThreshold = new Date();
    warningThreshold.setDate(today.getDate() + 30);
    const hasExpiringSoon = dates.some(
      (d) => d.getTime() < warningThreshold.getTime(),
    );
    if (hasExpiringSoon)
      return {
        label: "Expiring Soon",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };

    return {
      label: "All Valid",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  };

  const getTransporterName = (id: number) => {
    return (
      transporters.find((t) => t.transporterId === id)?.transporterName ||
      `Transporter #${id}`
    );
  };

  return (
    <Page
      header={`${pageTitle}`}
      subHeader="Manage transporter vehicles, registered capacities, and compliance certifications."
      showHeaderActions
    >
      <ConfirmDialog />

      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={data}
          loading={isLoading}
          onDelete={handleDeleteClick}
          onEdit={(item: Transportation.Vehicle) =>
            navigate(`./edit/${item.vehicleId}`)
          }
          searchFields={[
            "registrationNo",
            "category",
            "model",
            "manufacturer",
            "ownershipStatus",
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
            { field: "category", header: "Category", sortable: true },
            {
              cell: (item: Transportation.Vehicle) => (
                <span>{`${item.capacity} Metric Ton`}</span>
              ),
              header: "Capacity",
              sortable: true,
            },
            { field: "model", header: "Vehicle Model", sortable: true },
            { field: "ownershipStatus", header: "Ownership", sortable: true },
            {
              cell: (item: Transportation.Vehicle) => (
                <span>{getTransporterName(item.transporterId)}</span>
              ),
              header: "Transporter Owner",
            },
            {
              cell: (item: Transportation.Vehicle) => {
                const hasGps = Boolean(
                  item.hasGps || item.gpsProvider || item.gpsDeviceId,
                );
                return hasGps ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <i className="pi pi-map-marker text-[9px]" />{" "}
                    {item.gpsProvider || "GPS Active"}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">No GPS</span>
                );
              },
              header: "GPS Tracking",
            },
            {
              cell: (item: Transportation.Vehicle) => {
                const status = getDocumentStatus(item);
                return (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${status.className}`}
                  >
                    {status.label}
                  </span>
                );
              },
              header: "Compliance Status",
              sortable: true,
            },
          ]}
          renderContent={(item: Transportation.Vehicle) => {
            const status = getDocumentStatus(item);
            return (
              <Mosaic.Card
                title={item.registrationNo}
                subTitle={[
                  `Model: ${item.model}`,
                  `Category: ${item.category}`,
                  `Capacity: ${item.capacity} Metric Ton`,
                  `Ownership: ${item.ownershipStatus}`,
                  `Owner: ${getTransporterName(item.transporterId)}`,
                ]}
              >
                <div
                  className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase border rounded ${status.className}`}
                >
                  {status.label}
                </div>
              </Mosaic.Card>
            );
          }}
          renderFooterActions={(item: Transportation.Vehicle) => (
            <Button
              icon="trash"
              size="small"
              onClick={() => handleDeleteClick(item)}
              className="p-button-danger button-variant-danger"
              tooltip="Delete vehicle record"
            />
          )}
        />
      </Card>
    </Page>
  );
}
