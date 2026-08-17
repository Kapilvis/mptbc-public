import { useMemo } from "react";
import { useForm } from "react-hook-form";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import {
  TextBox,
  NumberBox,
  DropDownList as SelectBox,
  DatePicker as DateBox,
} from "shared/components/forms";
import { ToastService } from "services";
import { AlertTriangle, Info, Truck, CheckCircle2 } from "lucide-react";
import {
  useWorkOrdersQuery,
  useAddDispatchMutation,
} from "../../work-order/queries";
import { useVehiclesQuery } from "../../../master/vehicle-master/queries";

interface DispatchFormValues {
  workOrderId: string;
  vehicleId: string;
  bundlesLoaded: number;
  dispatchDate: string;
  driverName: string;
  driverMobile: string;
  lrNumber: string;
  gatePassNo: string;
}

interface FlatDispatch extends Transportation.Dispatch {
  district: string;
  block: string;
  transporterName: string;
}

export default function DispatchPage() {
  const { data: workOrders = [], isLoading: loadingWorkOrders } =
    useWorkOrdersQuery();
  const { data: vehicles = [], isLoading: loadingVehicles } =
    useVehiclesQuery();
  const addDispatchMutation = useAddDispatchMutation();

  const todayStr = new Date().toISOString().split("T")[0];

  const { control, handleSubmit, watch, reset } = useForm<DispatchFormValues>({
    defaultValues: {
      workOrderId: "",
      vehicleId: "",
      bundlesLoaded: 0,
      dispatchDate: todayStr,
      driverName: "",
      driverMobile: "",
      lrNumber: "",
      gatePassNo: "",
    },
  });

  const watchWorkOrderId = watch("workOrderId");
  const watchVehicleId = watch("vehicleId");
  const watchBundlesLoaded = watch("bundlesLoaded");

  // Get active work orders (Pending Dispatch or In Transit if not fully delivered)
  const activeWorkOrders = useMemo(() => {
    return workOrders.filter(
      (wo) => wo.status === "Pending Dispatch" || wo.status === "In Transit",
    );
  }, [workOrders]);

  const selectedWorkOrder = useMemo(() => {
    if (!watchWorkOrderId) return null;
    return workOrders.find((wo) => wo.workOrderId === watchWorkOrderId) || null;
  }, [watchWorkOrderId, workOrders]);

  // Check if a vehicle is expired
  const isVehicleExpired = (vehicle: Transportation.Vehicle): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rc = new Date(vehicle.rcExpiry);
    const ins = new Date(vehicle.insuranceExpiry);
    const fit = new Date(vehicle.fitnessExpiry);
    const perm = new Date(vehicle.permitExpiry);
    const puc = new Date(vehicle.pucExpiry);

    return (
      rc < today || ins < today || fit < today || perm < today || puc < today
    );
  };

  // Filter vehicles belonging to the allocated transporter
  const transporterVehicles = useMemo(() => {
    if (!selectedWorkOrder) return [];
    return vehicles.filter(
      (v: Transportation.Vehicle) =>
        v.transporterId === selectedWorkOrder.allocatedTransporterId,
    );
  }, [selectedWorkOrder, vehicles]);

  // Valid and expired fleet separation
  const { validVehicles, expiredCount } = useMemo(() => {
    const valid = transporterVehicles.filter(
      (v: Transportation.Vehicle) => !isVehicleExpired(v),
    );
    const expired = transporterVehicles.length - valid.length;
    return { validVehicles: valid, expiredCount: expired };
  }, [transporterVehicles]);

  const selectedVehicle = useMemo(() => {
    if (!watchVehicleId) return null;
    return (
      vehicles.find(
        (v: Transportation.Vehicle) => v.vehicleId === Number(watchVehicleId),
      ) || null
    );
  }, [watchVehicleId, vehicles]);

  // Auto-calculated weight (Bundles * 0.04 Tons)
  const calculatedWeight = useMemo(() => {
    const bundles = Number(watchBundlesLoaded) || 0;
    return Number((bundles * 0.04).toFixed(3));
  }, [watchBundlesLoaded]);

  // Overload verification
  const isOverloaded = useMemo(() => {
    if (!selectedVehicle || !calculatedWeight) return false;
    return calculatedWeight > selectedVehicle.capacity;
  }, [selectedVehicle, calculatedWeight]);

  // Options for work orders dropdown
  const workOrderOptions = useMemo(() => {
    return activeWorkOrders.map((wo) => ({
      text: `${wo.workOrderId} - ${wo.district} (${wo.block})`,
      id: wo.workOrderId,
    }));
  }, [activeWorkOrders]);

  // Options for vehicles dropdown
  const vehicleOptions = useMemo(() => {
    return validVehicles.map((v: Transportation.Vehicle) => ({
      text: `${v.registrationNo} [Cat-${v.category.slice(-1)} | Cap: ${v.capacity}T]`,
      id: String(v.vehicleId),
    }));
  }, [validVehicles]);

  const onSubmit = async (data: DispatchFormValues) => {
    if (!selectedWorkOrder) {
      ToastService.error("Please select a valid Work Order.");
      return;
    }
    if (!selectedVehicle) {
      ToastService.error("Please select a valid vehicle.");
      return;
    }
    if (isOverloaded) {
      ToastService.error(
        "Overload detected! Please select a larger truck or reduce loaded bundles.",
      );
      return;
    }

    try {
      await addDispatchMutation.mutateAsync({
        workOrderId: data.workOrderId,
        dispatchData: {
          workOrderId: data.workOrderId,
          truckNo: selectedVehicle.registrationNo,
          driverName: data.driverName,
          driverMobile: data.driverMobile,
          capacity: selectedVehicle.capacity,
          bundlesLoaded: Number(data.bundlesLoaded),
          dispatchDate: data.dispatchDate,
          lrNumber: data.lrNumber,
        },
      });

      ToastService.success(
        `Dispatch authorized successfully for Truck ${selectedVehicle.registrationNo}!`,
      );
      reset({
        workOrderId: "",
        vehicleId: "",
        bundlesLoaded: 0,
        dispatchDate: todayStr,
        driverName: "",
        driverMobile: "",
        lrNumber: "",
        gatePassNo: "",
      });
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to authorize dispatch.";
      ToastService.error(errMsg);
    }
  };

  // Flattened dispatches for listing historical logs in loading terminal
  const allDispatches = useMemo(() => {
    return workOrders.flatMap((wo) =>
      (wo.dispatches || []).map((d) => ({
        ...d,
        district: wo.district,
        block: wo.block,
        transporterName: wo.transporterName,
      })),
    );
  }, [workOrders]);

  const loading = loadingWorkOrders || loadingVehicles;

  if (loading) {
    return (
      <Page header="Loading Terminal" subHeader="Please wait...">
        <div className="flex items-center justify-center min-h-[300px] text-slate-500 font-medium">
          Loading active allocations and fleet registry...
        </div>
      </Page>
    );
  }

  return (
    <Page
      header="Loading & Dispatch Terminal"
      subHeader="Authorize truck loadout, perform fleet document verification, and generate dispatch gate pass."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Dispatch Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="flex flex-col gap-5 p-5">
              <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Truck className="text-indigo-600" size={20} />
                New Dispatch Details
              </span>

              {/* Work Order Selector */}
              <SelectBox
                label="Select Active Work Order"
                name="workOrderId"
                required
                control={control}
                data={workOrderOptions}
                optionValue="id"
                textField="text"
              />

              {/* Dynamic Work Order & Transporter Details */}
              {selectedWorkOrder && (
                <div className="bg-slate-50 border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Destination Details
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedWorkOrder.district} - {selectedWorkOrder.block}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">
                      Total Allocated: {selectedWorkOrder.totalBundles} bundles
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Allocated Transporter (L1)
                    </span>
                    <span className="font-bold text-slate-800 text-sm block">
                      {selectedWorkOrder.transporterName}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase inline-flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Authorized Prime Bidder
                    </span>
                  </div>
                </div>
              )}

              {/* Loading Truck Selector */}
              <SelectBox
                label="Select Loading Truck"
                name="vehicleId"
                required
                control={control}
                data={vehicleOptions}
                optionValue="id"
                textField="text"
                disabled={!selectedWorkOrder}
              />

              {/* Vehicle Document Warnings */}
              {selectedWorkOrder && (
                <div className="flex flex-col gap-2">
                  {expiredCount > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-amber-800">
                      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">
                          Fleet Maintenance Warning
                        </span>
                        <span className="text-[11px] leading-relaxed mt-0.5">
                          {expiredCount} fleet truck(s) belonging to{" "}
                          {selectedWorkOrder.transporterName} have expired
                          documents (RC, fitness, permit, or insurance) and have
                          been locked out of selection.
                        </span>
                      </div>
                    </div>
                  )}
                  {validVehicles.length === 0 &&
                    transporterVehicles.length > 0 && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-rose-800">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase">
                            All Fleet Vehicles Locked
                          </span>
                          <span className="text-[11px] leading-relaxed mt-0.5">
                            No valid vehicles with up-to-date documents are
                            currently available for this transporter. Dispatch
                            cannot be authorized until documentation is updated.
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Bundles Loaded input & capacity auto-calc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Bundle Count Loaded"
                  name="bundlesLoaded"
                  required
                  control={control}
                  placeholder="Enter loading bundles count"
                  disabled={!watchVehicleId}
                />

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Calculated Weight
                  </span>
                  <div
                    className={`border rounded-xl p-3 flex items-center justify-between ${
                      isOverloaded
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : "bg-indigo-50/50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">
                        {calculatedWeight} Tons
                      </span>
                      {selectedVehicle && (
                        <span className="text-[10px] font-medium text-slate-500">
                          Truck Capacity: {selectedVehicle.capacity} Tons
                        </span>
                      )}
                    </div>
                    {isOverloaded ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        Overloaded
                      </span>
                    ) : (
                      selectedVehicle && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Safe Load
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Overload Error Info */}
              {isOverloaded && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-rose-800">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">
                      Overload Safety Violation
                    </span>
                    <span className="text-[11px] leading-relaxed mt-0.5">
                      The loaded weight ({calculatedWeight} Tons) exceeds the
                      authorized capacity of this vehicle (
                      {selectedVehicle?.capacity} Tons). Please reduce the
                      bundle count or assign a Category-3 heavy truck.
                    </span>
                  </div>
                </div>
              )}

              {/* Driver and Outward details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextBox
                  label="Driver Name"
                  name="driverName"
                  required
                  control={control}
                  placeholder="Enter full name"
                />
                <TextBox
                  label="Driver Mobile Number"
                  name="driverMobile"
                  required
                  control={control}
                  placeholder="Enter 10-digit mobile"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextBox
                  label="Gate Pass Outward No."
                  name="gatePassNo"
                  required
                  control={control}
                  placeholder="e.g. GP-9021"
                />
                <TextBox
                  label="Lorry Receipt (LR) No."
                  name="lrNumber"
                  required
                  control={control}
                  placeholder="e.g. LR-4029"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateBox
                  label="Dispatch Date"
                  name="dispatchDate"
                  required
                  control={control}
                />
                <div className="flex flex-col justify-end">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    SLA Countdown Trigger
                  </span>
                  <div className="border border-slate-200 bg-emerald-50/50 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle2
                      className="text-emerald-600 shrink-0"
                      size={16}
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      SLA timer starts automatically (+3 days) on authorization
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-3">
                <Button
                  type="submit"
                  label="Authorize Dispatch"
                  icon="check"
                  disabled={
                    !watchVehicleId ||
                    isOverloaded ||
                    addDispatchMutation.isPending ||
                    (!!selectedWorkOrder && validVehicles.length === 0)
                  }
                />
              </div>
            </Card>
          </form>
        </div>

        {/* Right Side: Quick info panel */}
        <div className="lg:col-span-1">
          <Card className="p-4 flex flex-col gap-4">
            <span className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
              <Info size={16} className="text-indigo-600" />
              Loading Terminal Rules
            </span>
            <div className="text-xs text-slate-600 flex flex-col gap-3 leading-relaxed">
              <div>
                <strong className="text-slate-800">
                  1. Vehicle Integrity:
                </strong>
                <p className="mt-0.5 text-slate-500">
                  Any truck with expired documents (RC, Insurance, PUC, Fitness,
                  or Permit) is automatically excluded from selection to prevent
                  highway detention penalties.
                </p>
              </div>
              <div>
                <strong className="text-slate-800">
                  2. Load Capacity Limit:
                </strong>
                <p className="mt-0.5 text-slate-500">
                  Each textbook bundle is weight-calculated at exactly 40
                  kilograms (0.04 Tons). Overloading above the vehicle's RTO
                  capacity is strictly blocked.
                </p>
              </div>
              <div>
                <strong className="text-slate-800">3. SLA Timer:</strong>
                <p className="mt-0.5 text-slate-500">
                  A 3-day countdown is initiated instantly upon dispatch. Any
                  delay past 3 days will trigger automatic penalties against the
                  transporter's final billing.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Dispatch History Grid */}
      <div className="mt-8">
        <Card className="p-5">
          <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
            <Truck className="text-indigo-600" size={20} />
            Recent Dispatch Logs
          </span>
          <GridPanel
            data={allDispatches}
            searchFields={[
              "lrNumber",
              "truckNo",
              "driverName",
              "district",
              "block",
            ]}
            columns={[
              {
                header: "LR Number",
                field: "lrNumber",
                width: "120px",
                cell: (row: FlatDispatch) => (
                  <span className="font-bold text-slate-800 text-xs">
                    {row.lrNumber}
                  </span>
                ),
              },
              {
                header: "Work Order",
                field: "workOrderId",
                width: "120px",
              },
              {
                header: "Destination Block",
                cell: (row: FlatDispatch) => (
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">
                      {row.block}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      District: {row.district}
                    </span>
                  </div>
                ),
              },
              {
                header: "Vehicle Number",
                field: "truckNo",
                width: "140px",
                cell: (row: FlatDispatch) => (
                  <span className="font-bold text-slate-700">
                    {row.truckNo}
                  </span>
                ),
              },
              {
                header: "Loaded Bundles",
                cell: (row: FlatDispatch) => (
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">
                      {row.bundlesLoaded}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Weight: {(row.bundlesLoaded * 0.04).toFixed(2)} Tons
                    </span>
                  </div>
                ),
                align: "right",
              },
              {
                header: "Driver Details",
                cell: (row: FlatDispatch) => (
                  <div className="flex flex-col text-xs text-slate-600">
                    <span>{row.driverName}</span>
                    <span className="text-[10px] text-slate-400">
                      {row.driverMobile}
                    </span>
                  </div>
                ),
              },
              {
                header: "Dispatch Date",
                field: "dispatchDate",
                width: "130px",
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
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
      </div>
    </Page>
  );
}
