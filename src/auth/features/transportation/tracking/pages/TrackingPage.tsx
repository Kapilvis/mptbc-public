import { useMemo, useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { AlertTriangle, Clock, Truck, MapPin, X } from "lucide-react";
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
  const [gpsModalVisible, setGpsModalVisible] = useState(false);

  // Helper to calculate days remaining
  const calculateDeliveryDays = (
    dispatchDateStr: string,
    status: string,
    actualDeliveryDate?: string,
  ) => {
    const dispatchDate = new Date(dispatchDateStr);
    const dueDate = new Date(dispatchDate);
    dueDate.setDate(dueDate.getDate() + 5); // 5-day window

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
    d.setDate(d.getDate() + 5);
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

  const delayedDispatches = useMemo(() => {
    return dispatchesList.filter(
      (d) => d.displayStatus === "Delayed" && d.lat && d.lng,
    );
  }, [dispatchesList]);

  const inTransitCount = useMemo(
    () => dispatchesList.filter((d) => d.displayStatus === "In Transit").length,
    [dispatchesList],
  );

  const delayedCount = useMemo(
    () => dispatchesList.filter((d) => d.displayStatus === "Delayed").length,
    [dispatchesList],
  );

  const totalVehicles = dispatchesList.length || 1;

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
      subHeader="Monitor in-transit shipments, audit delivery timelines, and log default exceptions."
    >
      {/* Rich Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1: TOTAL VEHICLES */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:shadow-md transition min-h-[105px]">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              TOTAL VEHICLES
            </span>
            <span className="text-4xl font-black text-slate-800">
              {totalVehicles}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center shrink-0">
            <Truck size={32} className="text-slate-400" />
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5">
              REGISTERED
            </span>
          </div>
        </div>

        {/* Card 2: IN TRANSIT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:shadow-md transition min-h-[105px]">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              IN TRANSIT
            </span>
            <span className="text-4xl font-black text-sky-600">
              {inTransitCount}
            </span>
          </div>
          <div className="relative shrink-0 flex items-center justify-center pr-1.5">
            <svg
              className="w-10 h-10 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Converging road lines */}
              <path d="M5 22L10 2M19 22L14 2" />
              {/* Dashed center line */}
              <line
                x1="12"
                y1="22"
                x2="12"
                y2="2"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="2 3"
              />
            </svg>
            <div className="absolute -top-1 right-0 bg-white rounded-full p-0.5 shadow-xs border border-sky-100 text-sky-600">
              <Clock size={11} />
            </div>
          </div>
        </div>

        {/* Card 3: DELAYED */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between hover:shadow-md transition min-h-[105px] relative">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              DELAYED
            </span>
            <span className="text-4xl font-black text-red-600">
              {delayedCount}
            </span>
          </div>
          <div className="absolute top-4 right-4 bg-red-50 border border-red-100 text-red-500 p-1 rounded-lg">
            <AlertTriangle size={14} />
          </div>
          <div className="flex flex-col items-end justify-end shrink-0 h-full pt-8">
            <button
              onClick={() => setGpsModalVisible(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all whitespace-nowrap"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              VIEW LIVE MAP
              <MapPin size={13} className="text-white ml-0.5" />
            </button>
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
              align: "center",
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
              align: "center",
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
            {
              header: "Location",
              align: "center",
              cell: (row: FlatTrackingDispatch) => {
                const lat = row.lat || 22.7196;
                const lng = row.lng || 75.8577;
                return (
                  <button
                    onClick={() => {
                      window.open(
                        `/transportmap.html?lat=${lat}&lng=${lng}&name=${encodeURIComponent(row.truckNo)}&status=${row.displayStatus}`,
                        "_blank",
                      );
                    }}
                    className="text-sky-600 hover:text-sky-800 transition cursor-pointer flex items-center justify-center w-full hover:scale-110"
                    title="Track Live GPS Location"
                  >
                    <MapPin size={18} />
                  </button>
                );
              },
            },
          ]}
        />
      </Card>

      {/* Live GPS Selection Modal */}
      {gpsModalVisible && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Clock
                  className="text-red-500 animate-pulse animate-duration-1000"
                  size={18}
                />
                <span className="font-bold text-slate-800 text-sm">
                  Live GPS Tracking: Select Delayed Vehicle
                </span>
              </div>
              <button
                onClick={() => setGpsModalVisible(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 rounded-full hover:bg-slate-100 flex items-center justify-center"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              {delayedDispatches.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-medium">
                  No delayed vehicles with active GPS tracking found.
                </div>
              ) : (
                delayedDispatches.map((vehicle) => (
                  <button
                    key={vehicle.dispatchId}
                    onClick={() => {
                      if (vehicle.lat && vehicle.lng) {
                        window.open(
                          `/transportmap.html?lat=${vehicle.lat}&lng=${vehicle.lng}&name=${encodeURIComponent(vehicle.truckNo)}`,
                          "_blank",
                        );
                        setGpsModalVisible(false);
                      }
                    }}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 hover:border-sky-500 hover:bg-sky-50/30 rounded-xl transition text-left cursor-pointer group w-full"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Truck
                          size={13}
                          className="text-slate-500 group-hover:text-sky-600"
                        />
                        {vehicle.truckNo}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {vehicle.district} - {vehicle.block} (
                        {vehicle.transporterName})
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                      Delayed
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
