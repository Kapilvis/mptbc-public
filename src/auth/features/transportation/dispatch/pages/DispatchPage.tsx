import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { Loader } from "shared/components/progress";
import { useWorkOrdersQuery } from "../../work-order/queries";
import DispatchFormModal from "../components/DispatchFormModal";

interface FlatDispatch extends Transportation.Dispatch {
  district: string;
  block: string;
  transporterName: string;
}

export default function DispatchPage() {
  const pageTitle = usePageTitle();
  const [modalVisible, setModalVisible] = useState(false);
  const { data: workOrders = [], isLoading: loadingWorkOrders } =
    useWorkOrdersQuery();

  // Flattened dispatches for history table
  const allDispatches: FlatDispatch[] = useMemo(() => {
    return workOrders.flatMap((wo) =>
      (wo.dispatches || []).map((d) => ({
        ...d,
        district: wo.district,
        block: wo.block,
        transporterName: wo.transporterName,
      })),
    );
  }, [workOrders]);

  if (loadingWorkOrders) {
    return <Loader />;
  }

  return (
    <Page
      header={pageTitle || "Loading & Dispatch"}
      subHeader="Authorize truck loadout, perform fleet document verification, and generate dispatch gate passes."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={allDispatches}
          searchFields={[
            "lrNumber",
            "truckNo",
            "driverName",
            "district",
            "block",
            "transporterName",
          ]}
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
              header: "Vehicle Number",
              field: "truckNo",
              sortable: true,
              width: "160px",
            },
            {
              header: "Work Order",
              field: "workOrderId",
              sortable: true,
              width: "120px",
            },
            {
              header: "District",
              field: "district",
              sortable: true,
            },
            {
              header: "Block / Destination",
              field: "block",
              sortable: true,
            },
            {
              header: "Allocated Transporter",
              field: "transporterName",
              sortable: true,
            },
            {
              header: "Loaded Bundles",
              field: "bundlesLoaded",
              sortable: true,
              align: "center",
              width: "130px",
            },
            {
              header: "Loaded Weight (Metric Ton)",
              cell: (row: FlatDispatch) => (
                <span className="font-semibold text-slate-700">
                  {Math.round(row.bundlesLoaded * 0.04)} MT
                </span>
              ),
              align: "center",
              width: "160px",
            },
            {
              header: "Driver Name",
              field: "driverName",
              sortable: true,
            },
            {
              header: "Driver Mobile",
              field: "driverMobile",
              sortable: true,
            },
            {
              header: "Dispatch Date",
              field: "dispatchDate",
              sortable: true,
              width: "120px",
            },
            {
              header: "Status",
              field: "status",
              width: "120px",
              align: "center",
              cell: (row: FlatDispatch) => {
                const isDelivered = row.status === "Delivered";
                return (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isDelivered
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-sky-50 text-sky-700 border border-sky-200"
                    }`}
                  >
                    {row.status}
                  </span>
                );
              },
            },
          ]}
        />
      </Card>

      {modalVisible && (
        <DispatchFormModal
          visible={modalVisible}
          onHide={() => setModalVisible(false)}
          workOrders={workOrders}
        />
      )}
    </Page>
  );
}
