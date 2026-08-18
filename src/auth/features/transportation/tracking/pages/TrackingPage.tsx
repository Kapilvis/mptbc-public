import { useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { ToastService } from "services";
import { Button } from "shared/components/buttons";
import { AlertCircle, Clock, MapPin } from "lucide-react";
import { useWorkOrdersQuery } from "../../work-order/queries";

interface FlatTrackingDispatch extends Transportation.Dispatch {
  district: string;
  block: string;
  transporterName: string;
  slaDueDate: string;
  daysRemaining: number;
  displayStatus: string;
}

export default function TrackingPage() {
  const { data: workOrders = [], isLoading } = useWorkOrdersQuery();
  const { confirmAction } = useConfirmDialog();

  // Helper to calculate days remaining
  const calculateSlaDays = (
    dispatchDateStr: string,
    status: string,
    actualDeliveryDate?: string,
  ) => {
    const dispatchDate = new Date(dispatchDateStr);
    const slaDueDate = new Date(dispatchDate);
    slaDueDate.setDate(slaDueDate.getDate() + 3); // 3-day SLA

    const endPoint =
      status === "Delivered" && actualDeliveryDate
        ? new Date(actualDeliveryDate)
        : new Date();

    endPoint.setHours(0, 0, 0, 0);
    slaDueDate.setHours(0, 0, 0, 0);

    const diffTime = slaDueDate.getTime() - endPoint.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Flatten work orders into individual dispatches
  const dispatchesList = useMemo(() => {
    return workOrders.flatMap((wo) =>
      (wo.dispatches || []).map((d) => {
        const daysRemaining = calculateSlaDays(
          d.dispatchDate,
          d.status,
          d.actualDeliveryDate,
        );

        let displayStatus: string = d.status;
        if (d.status === "In Transit" && daysRemaining < 0) {
          displayStatus = "SLA Breached";
        }

        const dispatchDate = new Date(d.dispatchDate);
        const slaDueDate = new Date(dispatchDate);
        slaDueDate.setDate(slaDueDate.getDate() + 3);
        const slaDueDateStr = slaDueDate.toISOString().split("T")[0];

        return {
          ...d,
          district: wo.district,
          block: wo.block,
          transporterName: wo.transporterName,
          slaDueDate: slaDueDateStr,
          daysRemaining,
          displayStatus,
        };
      }),
    );
  }, [workOrders]);

  const handleMarkDefault = (row: FlatTrackingDispatch) => {
    confirmAction({
      header: "Mark Transporter as Defaulted",
      message: `Are you sure you want to mark dispatch ${row.lrNumber} (Truck: ${row.truckNo}) as Defaulted? This will initiate the penalty recovery process and blacklist this truck for active work orders.`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Confirm Default",
      rejectLabel: "Cancel",
      onAccept: () => {
        ToastService.success(
          `Dispatch ${row.lrNumber} marked as Defaulted. Incident report submitted to Head Office.`,
        );
      },
    });
  };

  const getSlaBadgeClass = (days: number, status: string) => {
    if (status === "Delivered") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (days < 0) {
      return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
    }
    if (days <= 1) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "SLA Breached":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "In Transit":
      default:
        return "bg-sky-100 text-sky-800 border-sky-300";
    }
  };

  if (isLoading) {
    return (
      <Page header="Delivery Tracking" subHeader="Please wait...">
        <div className="flex items-center justify-center min-h-[300px] text-slate-500 font-medium">
          Syncing active dispatch signals and SLA counters...
        </div>
      </Page>
    );
  }

  return (
    <Page
      header="Live Delivery Tracking Monitor"
      subHeader="Monitor in-transit shipments, audit SLA delivery clocks, and log default exceptions."
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4 bg-sky-50/50 border-sky-100">
          <div className="p-3 bg-sky-100 rounded-xl text-sky-600">
            <Clock size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              In Transit
            </span>
            <span className="text-xl font-bold text-slate-800">
              {
                dispatchesList.filter((d) => d.displayStatus === "In Transit")
                  .length
              }{" "}
              Shipments
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 bg-rose-50/50 border-rose-100">
          <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
            <AlertCircle size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SLA Breaches
            </span>
            <span className="text-xl font-bold text-slate-800">
              {
                dispatchesList.filter((d) => d.displayStatus === "SLA Breached")
                  .length
              }{" "}
              Shipments
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 bg-emerald-50/50 border-emerald-100">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
            <MapPin size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Successfully Delivered
            </span>
            <span className="text-xl font-bold text-slate-800">
              {dispatchesList.filter((d) => d.status === "Delivered").length}{" "}
              Shipments
            </span>
          </div>
        </Card>
      </div>

      {/* Main Table - Clean Separate Columns without Sub-Headings */}
      <Card>
        <GridPanel
          data={dispatchesList}
          searchFields={[
            "lrNumber",
            "truckNo",
            "transporterName",
            "district",
            "block",
          ]}
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
              header: "Lorry Receipt Number",
              field: "lrNumber",
              sortable: true,
              width: "180px",
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
              header: "Transporter",
              field: "transporterName",
              sortable: true,
            },
            {
              header: "Vehicle Number",
              field: "truckNo",
              sortable: true,
              width: "140px",
            },
            {
              header: "Loaded Bundles",
              field: "bundlesLoaded",
              sortable: true,
              align: "center",
              width: "130px",
            },
            {
              header: "Weight (Metric Ton)",
              cell: (row: FlatTrackingDispatch) => (
                <span className="font-semibold text-slate-700">
                  {(row.bundlesLoaded * 0.04).toFixed(2)} MT
                </span>
              ),
              align: "center",
              width: "140px",
            },
            {
              header: "Dispatch Date",
              field: "dispatchDate",
              sortable: true,
              width: "120px",
            },
            {
              header: "SLA Due Date",
              field: "slaDueDate",
              sortable: true,
              width: "120px",
            },
            {
              header: "SLA Countdown",
              align: "center",
              width: "160px",
              cell: (row: FlatTrackingDispatch) => {
                const days = row.daysRemaining;
                const isDelivered = row.status === "Delivered";
                return (
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap inline-block ${getSlaBadgeClass(days, row.status)}`}
                  >
                    {isDelivered
                      ? "On Time Delivery"
                      : days < 0
                        ? `LATE BY ${Math.abs(days)} DAYS`
                        : days === 0
                          ? "DUE TODAY"
                          : `${days} DAYS LEFT`}
                  </span>
                );
              },
            },
            {
              header: "Status",
              field: "displayStatus",
              width: "140px",
              align: "center",
              cell: (row: FlatTrackingDispatch) => (
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap inline-block ${getStatusBadgeClass(row.displayStatus)}`}
                >
                  {row.displayStatus}
                </span>
              ),
            },
            {
              header: "Actions",
              width: "140px",
              align: "center",
              cell: (row: FlatTrackingDispatch) => {
                const isBreached = row.displayStatus === "SLA Breached";
                return (
                  <Button
                    icon="shield"
                    label="Mark Default"
                    variant="danger"
                    size="small"
                    className="!text-xs whitespace-nowrap"
                    onClick={() => handleMarkDefault(row)}
                    disabled={row.status === "Delivered" || !isBreached}
                  />
                );
              },
            },
          ]}
        />
      </Card>
      <ConfirmDialog />
    </Page>
  );
}
