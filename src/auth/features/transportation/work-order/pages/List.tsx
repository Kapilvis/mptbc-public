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

  if (loadingWorkOrders || loadingTransporters) {
    return <Loader />;
  }

  return (
    <Page
      header={pageTitle || "Work Order & Allocation"}
      subHeader="Generate distribution work orders, configure block-level supply targets, and track delivery timelines."
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
            // {
            //   header: "Trucks (9 / 4.5)",
            //   cell: (item: Transportation.WorkOrder) => (
            //     <span className="font-semibold text-slate-700">
            //       {item.nineTonTrucksRequired || 0} /{" "}
            //       {item.fourPointFiveTonTrucksRequired || 0}
            //     </span>
            //   ),
            //   align: "center",
            //   width: "130px",
            // },
            {
              field: "instructionDate",
              header: "Issue Date",
              sortable: true,
              width: "110px",
              align: "center",
            },
            {
              field: "dueDate",
              header: "Due Date",
              sortable: true,
              width: "110px",
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
