import { useState } from "react";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { Loader } from "shared/components/progress";
import { Button } from "shared/components/buttons";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { ToastService } from "services";
import {
  useWorkOrdersQuery,
  useTransportersL1Query,
  useImportAppendixMutation,
} from "../queries";
import WorkOrderFormModal from "../components/WorkOrderFormModal";

export default function List() {
  const [modalVisible, setModalVisible] = useState(false);
  const { confirmAction } = useConfirmDialog();

  const { data: workOrders = [], isLoading: loadingWorkOrders } =
    useWorkOrdersQuery();
  const { data: transporters = [], isLoading: loadingTransporters } =
    useTransportersL1Query();

  const importMutation = useImportAppendixMutation();

  const handleImportAppendix = () => {
    confirmAction({
      header: "Import Appendix-1 Data",
      message:
        "Are you sure you want to import sample Appendix-1 targets for Indore district? This will auto-generate Indore, Mhow, and Sanwer block allocations assigned to the L1 Prime Bidder (Verma Logistics).",
      icon: "file-import",
      acceptLabel: "Import Data",
      rejectLabel: "Cancel",
      onAccept: async () => {
        try {
          const res = await importMutation.mutateAsync("Indore");
          if (res && res.length > 0) {
            ToastService.success(
              `Successfully imported ${res.length} block allocations from Appendix-1!`,
            );
          } else {
            ToastService.success(
              "Appendix-1 data already imported or no new blocks found.",
            );
          }
        } catch (err: unknown) {
          const errMsg =
            err instanceof Error
              ? err.message
              : "Import failed. Please check if Indore Prime Bidder is authorized.";
          ToastService.error(errMsg);
        }
      },
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "In Transit":
        return "bg-sky-50 text-sky-700 border border-sky-200";
      case "Pending Dispatch":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  if (loadingWorkOrders || loadingTransporters) {
    return <Loader />;
  }

  return (
    <Page
      header="Work Order & Allocation"
      subHeader="Generate distribution work orders, configure block-level supply targets, and calculate delivery SLA timelines."
    >
      <Card>
        <div className="flex justify-end gap-3 mb-4">
          <Button
            label="Import Appendix-1"
            icon="file-excel"
            onClick={handleImportAppendix}
            variant="outlined"
          />
          <Button
            label="Create Work Order"
            icon="plus"
            onClick={() => setModalVisible(true)}
          />
        </div>
        <GridPanel
          toolbarPlacement="page"
          data={workOrders}
          searchFields={["workOrderId", "district", "block", "transporterName"]}
          columns={[
            {
              cell: (item: Transportation.WorkOrder) => (
                <span className="font-bold text-slate-800 tracking-wide text-xs">
                  {item.workOrderId}
                </span>
              ),
              header: "Work Order ID",
              width: "120px",
            },
            {
              cell: (item: Transportation.WorkOrder) => (
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-800">
                    {item.block}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    District: {item.district}
                  </span>
                </div>
              ),
              header: "Destination HQ (Block/Dist)",
            },
            {
              cell: (item: Transportation.WorkOrder) => (
                <span className="font-semibold text-slate-700">
                  {item.transporterName}
                </span>
              ),
              header: "Allocated Transporter",
            },
            {
              cell: (item: Transportation.WorkOrder) => (
                <span className="font-bold text-slate-800 text-xs">
                  {item.totalBundles}
                </span>
              ),
              header: "Target Bundles",
              width: "120px",
              align: "right",
            },
            {
              cell: (item: Transportation.WorkOrder) => (
                <div className="flex flex-col gap-0.5 text-[11px] text-slate-500 font-medium">
                  <span>
                    9T Trucks:{" "}
                    <strong>{item.nineTonTrucksRequired || 0}</strong>
                  </span>
                  <span>
                    4.5T Trucks:{" "}
                    <strong>{item.fourPointFiveTonTrucksRequired || 0}</strong>
                  </span>
                </div>
              ),
              header: "Truck Estimates",
              width: "130px",
            },
            {
              cell: (item: Transportation.WorkOrder) => (
                <div className="flex flex-col gap-0.5 text-[11px]">
                  <span className="text-slate-500">
                    Issued: {item.instructionDate}
                  </span>
                  <span className="text-rose-600 font-semibold">
                    Due: {item.dueDate}
                  </span>
                </div>
              ),
              header: "Timeline & SLA",
              width: "150px",
            },
            {
              cell: (item: Transportation.WorkOrder) => (
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(
                    item.status,
                  )}`}
                >
                  {item.status}
                </span>
              ),
              header: "Status",
              width: "140px",
              align: "center",
            },
          ]}
        />
      </Card>

      {modalVisible && (
        <WorkOrderFormModal
          visible={modalVisible}
          onHide={() => setModalVisible(false)}
          transporters={transporters}
        />
      )}

      <ConfirmDialog />
    </Page>
  );
}
