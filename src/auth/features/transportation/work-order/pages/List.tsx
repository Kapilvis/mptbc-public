import { useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { Loader } from "shared/components/progress";
import { Button } from "shared/components/buttons";
import { useWorkOrdersQuery, useTransportersL1Query } from "../queries";
import WorkOrderFormModal from "../components/WorkOrderFormModal";

export default function List() {
  const pageTitle = usePageTitle();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: workOrders = [], isLoading: loadingWorkOrders } =
    useWorkOrdersQuery();
  const { data: transporters = [], isLoading: loadingTransporters } =
    useTransportersL1Query();

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
      header={pageTitle || "Work Order & Allocation"}
      subHeader="Generate distribution work orders, configure block-level supply targets, and track delivery SLA timelines."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={workOrders}
          searchFields={["workOrderId", "district", "block", "transporterName"]}
          toolbar={
            <Button
              label="Add"
              icon="plus"
              onClick={() => setModalVisible(true)}
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
            {
              field: "workOrderId",
              header: "Work Order ID",
              sortable: true,
              width: "130px",
            },
            {
              field: "district",
              header: "District",
              sortable: true,
            },
            {
              field: "block",
              header: "Block / Destination",
              sortable: true,
            },
            {
              field: "transporterName",
              header: "Allocated Transporter",
              sortable: true,
            },
            {
              field: "totalBundles",
              header: "Target Bundles",
              sortable: true,
              align: "center",
              width: "120px",
            },
            {
              header: "Trucks (9T / 4.5T)",
              cell: (item: Transportation.WorkOrder) => (
                <span className="font-semibold text-slate-700">
                  {item.nineTonTrucksRequired || 0} /{" "}
                  {item.fourPointFiveTonTrucksRequired || 0}
                </span>
              ),
              align: "center",
              width: "130px",
            },
            {
              field: "instructionDate",
              header: "Issue Date",
              sortable: true,
              width: "110px",
            },
            {
              field: "dueDate",
              header: "Due Date",
              sortable: true,
              width: "110px",
            },
            {
              cell: (item: Transportation.WorkOrder) => (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(
                    item.status,
                  )}`}
                >
                  {item.status}
                </span>
              ),
              header: "Status",
              width: "130px",
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
    </Page>
  );
}
