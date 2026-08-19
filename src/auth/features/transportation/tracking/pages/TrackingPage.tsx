import { useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { AlertTriangle, CheckCircle2, Clock, Truck } from "lucide-react";
import { useWorkOrdersQuery } from "../../work-order/queries";

interface FlatTrackingDispatch extends Transportation.Dispatch {
  district: string;
  block: string;
  transporterName: string;
  expectedDeliveryDate: string;
  daysRemaining: number;
  displayStatus: string;
}

export default function TrackingPage() {
  const pageTitle = usePageTitle();
  const { data: workOrders = [], isLoading } = useWorkOrdersQuery();

  // Helper to calculate days remaining
  const calculateDeliveryDays = (
    dispatchDateStr: string,
    status: string,
    actualDeliveryDate?: string,
  ) => {
    const dispatchDate = new Date(dispatchDateStr);
    const dueDate = new Date(dispatchDate);
    dueDate.setDate(dueDate.getDate() + 3); // 3-day window

    const endPoint =
      status === "Delivered" && actualDeliveryDate
        ? new Date(actualDeliveryDate)
        : new Date();

    endPoint.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - endPoint.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format date to Indian IST format (DD/MM/YYYY)
  const formatISTDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format YYYY-MM-DD
  const calculateExpectedDeliveryDate = (dispatchDateStr: string) => {
    const d = new Date(dispatchDateStr);
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  };

  // Flatten dispatches from work orders with live calculated delivery status
  const dispatchesList = useMemo(() => {
    const list: FlatTrackingDispatch[] = [];
    workOrders.forEach((wo) => {
      if (wo.dispatches && wo.dispatches.length > 0) {
        wo.dispatches.forEach((disp) => {
          const days = calculateDeliveryDays(
            disp.dispatchDate,
            disp.status,
            disp.actualDeliveryDate,
          );
          const isDelayed = days < 0 && disp.status !== "Delivered";

          list.push({
            ...disp,
            district: wo.district,
            block: wo.block,
            transporterName: wo.transporterName,
            expectedDeliveryDate: calculateExpectedDeliveryDate(
              disp.dispatchDate,
            ),
            daysRemaining: days,
            displayStatus: isDelayed ? "Delayed" : disp.status,
          });
        });
      }
    });

    // Sort by urgency: Delayed first, then nearest due date
    return list.sort((a, b) => {
      if (a.displayStatus === "Delayed" && b.displayStatus !== "Delayed")
        return -1;
      if (b.displayStatus === "Delayed" && a.displayStatus !== "Delayed")
        return 1;
      return a.daysRemaining - b.daysRemaining;
    });
  }, [workOrders]);

  const inTransitCount = useMemo(
    () => dispatchesList.filter((d) => d.displayStatus === "In Transit").length,
    [dispatchesList],
  );

  const delayedCount = useMemo(
    () => dispatchesList.filter((d) => d.displayStatus === "Delayed").length,
    [dispatchesList],
  );

  const deliveredCount = useMemo(
    () => dispatchesList.filter((d) => d.status === "Delivered").length,
    [dispatchesList],
  );

  const totalVehicles = dispatchesList.length || 1;
  const inTransitPct = Math.round((inTransitCount / totalVehicles) * 100);
  const deliveredPct = Math.round((deliveredCount / totalVehicles) * 100);

  const getTimelineBadgeClass = (days: number, status: string) => {
    if (status === "Delivered") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (days < 0) {
      return "bg-red-50 text-red-700 border-red-200";
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
      case "Delayed":
        return "bg-red-100 text-red-800 border-red-300";
      case "In Transit":
      default:
        return "bg-sky-100 text-sky-800 border-sky-300";
    }
  };

  if (isLoading) {
    return (
      <Page header="Live Delivery Tracking" subHeader="Please wait...">
        <div className="flex items-center justify-center min-h-[300px] text-slate-500 font-medium">
          Syncing active dispatch signals and vehicle tracking...
        </div>
      </Page>
    );
  }

  return (
    <Page
      header={pageTitle || "Live Delivery Tracking"}
      subHeader="Monitor in-transit shipments, audit SLA delivery clocks, and log default exceptions."
    >
      {/* Rich Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {/* 1. In Transit */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              In-Transit Vehicles
            </span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Truck size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">
                {inTransitCount}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                / {totalVehicles} Active Vehicles
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${inTransitPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 font-semibold mt-2.5">
              <span className="text-sky-700 flex items-center gap-1.5 font-bold">
                <Clock size={13} /> Live GPS Active
              </span>
              <span className="text-slate-500">On-Route</span>
            </div>
          </div>
        </div>

        {/* 2. Delay Alerts (Pure Bold Red) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Delivery Delay Alerts
            </span>
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-600">
                {delayedCount}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Delayed Vehicle(s)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((delayedCount / totalVehicles) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-semibold mt-2.5">
              <span className="text-red-600 font-bold">
                Delayed Past 3 Days
              </span>
              <span className="text-red-700 text-xs font-bold">
                Penalty Notice
              </span>
            </div>
          </div>
        </div>

        {/* 3. Completed Deliveries */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completed Deliveries
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">
                {deliveredCount}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                / {totalVehicles} Deliveries Completed
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${deliveredPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 font-semibold mt-2.5">
              <span className="text-emerald-700 font-bold">
                {deliveredPct}% Delivery Rate
              </span>
              <span className="text-emerald-700 font-bold">POD Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
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
              header: "Vehicle Number",
              field: "truckNo",
              sortable: true,
              width: "160px",
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
              cell: (row: FlatTrackingDispatch) => (
                <span className="text-slate-700 font-medium">
                  {formatISTDate(row.dispatchDate)}
                </span>
              ),
              sortable: true,
              width: "130px",
            },
            {
              header: "Expected Delivery Date",
              cell: (row: FlatTrackingDispatch) => (
                <span className="text-slate-700 font-medium">
                  {formatISTDate(row.expectedDeliveryDate)}
                </span>
              ),
              sortable: true,
              width: "180px",
            },
            {
              header: "Delivery Timeline",
              align: "center",
              width: "160px",
              cell: (row: FlatTrackingDispatch) => {
                const days = row.daysRemaining;
                const isDelivered = row.status === "Delivered";
                return (
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap inline-block ${getTimelineBadgeClass(days, row.status)}`}
                  >
                    {isDelivered
                      ? "On-Time Delivery"
                      : days < 0
                        ? `Late by ${Math.abs(days)} Days`
                        : days === 0
                          ? "Due Today"
                          : `${days} Days Left`}
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
          ]}
        />
      </Card>
    </Page>
  );
}
