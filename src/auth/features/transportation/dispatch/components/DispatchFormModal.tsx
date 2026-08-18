import { useMemo } from "react";
import { useForm } from "react-hook-form";
import Modal from "shared/components/popups/Modal";
import { Button } from "shared/components/buttons";
import {
  TextBox,
  NumberBox,
  DropDownList as SelectBox,
  DatePicker as DateBox,
} from "shared/components/forms";
import { ToastService } from "services";
import { AlertTriangle, Clock } from "lucide-react";
import { useAddDispatchMutation } from "../../work-order/queries";
import { useVehiclesQuery } from "../../../master/vehicle-master/queries";

interface DispatchFormModalProps {
  visible: boolean;
  onHide: () => void;
  workOrders: Transportation.WorkOrder[];
}

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

export default function DispatchFormModal({
  visible,
  onHide,
  workOrders,
}: DispatchFormModalProps) {
  const { data: vehicles = [] } = useVehiclesQuery();
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
      text: `${v.registrationNo} - ${v.manufacturer || ""} ${v.model} (${v.capacity}T Cap)`,
      id: String(v.vehicleId),
    }));
  }, [validVehicles]);

  const onSubmit = async (data: DispatchFormValues) => {
    if (!selectedWorkOrder) {
      ToastService.error("Please select an active work order.");
      return;
    }
    if (!selectedVehicle) {
      ToastService.error("Please select an authorized vehicle.");
      return;
    }
    if (isOverloaded) {
      ToastService.error(
        "Cargo exceeds maximum vehicle payload capacity. Reduce bundles before authorizing dispatch.",
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
          gatePassNo: data.gatePassNo,
          gpsDeviceId: selectedVehicle.gpsDeviceId || "GPS-ACTIVE",
        },
      });

      ToastService.success(
        `Dispatch authorized! LR #${data.lrNumber} generated with 3-day delivery SLA.`,
      );
      reset();
      onHide();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to authorize truck dispatch.";
      ToastService.error(errMsg);
    }
  };

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      size="medium"
      header="Create / Authorize Dispatch"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Row 1: Work Order & Loading Truck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectBox
            label="Select Active Work Order"
            name="workOrderId"
            required
            control={control}
            data={workOrderOptions}
            optionValue="id"
            textField="text"
          />

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
        </div>

        {/* Work Order Info Panel (if selected) */}
        {selectedWorkOrder && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Destination Details
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {selectedWorkOrder.district} - {selectedWorkOrder.block}
              </span>
              <span className="text-xs text-slate-600 block mt-1">
                Total Allocated: {selectedWorkOrder.totalBundles} bundles
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Allocated Transporter
              </span>
              <span className="font-bold text-slate-800 text-sm block">
                {selectedWorkOrder.transporterName}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase inline-flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Authorized Transporter
              </span>
            </div>
          </div>
        )}

        {/* Vehicle Document Warnings */}
        {selectedWorkOrder && (
          <div className="flex flex-col gap-2">
            {expiredCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-amber-800">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">
                    Fleet Maintenance Notice
                  </span>
                  <span className="text-xs leading-relaxed mt-0.5">
                    {expiredCount} fleet truck(s) belonging to{" "}
                    {selectedWorkOrder.transporterName} have expired documents
                    and cannot be selected.
                  </span>
                </div>
              </div>
            )}
            {validVehicles.length === 0 && transporterVehicles.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-rose-800">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase">
                    All Fleet Vehicles Locked
                  </span>
                  <span className="text-xs leading-relaxed mt-0.5">
                    No valid vehicles with up-to-date documents are available
                    for this transporter.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Row 2: Bundle Count Loaded & Calculated Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberBox
            label="Bundle Count Loaded"
            name="bundlesLoaded"
            required
            control={control}
            placeholder="Enter loading bundles count"
            disabled={!watchVehicleId}
          />

          <div>
            <span className="text-[11px] font-bold text-slate-700 block mb-1">
              Calculated Weight
            </span>
            <div
              className={`border rounded-lg h-[38px] px-3 flex items-center justify-between ${
                isOverloaded
                  ? "bg-rose-50 border-rose-300 text-rose-800"
                  : "bg-emerald-50/60 border-slate-200 text-slate-800"
              }`}
            >
              <span className="text-xs font-bold">
                {calculatedWeight} Metric Ton
                {selectedVehicle && (
                  <span className="text-slate-500 font-normal ml-2">
                    (Cap: {selectedVehicle.capacity} MT)
                  </span>
                )}
              </span>
              {isOverloaded ? (
                <span className="text-[10px] font-bold uppercase bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                  Overloaded
                </span>
              ) : (
                selectedVehicle && (
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    Safe Load
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Driver Name & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Row 4: Gate Pass Outward No & Lorry Receipt (LR) No */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Row 5: Dispatch Date & SLA Delivery Window */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateBox
            label="Dispatch Date"
            name="dispatchDate"
            required
            control={control}
          />
          <div>
            <span className="text-[11px] font-bold text-slate-700 block mb-1">
              SLA Delivery Window
            </span>
            <div className="border border-slate-200 bg-emerald-50/60 rounded-lg h-[38px] px-3 flex items-center gap-2">
              <Clock className="text-emerald-600 shrink-0" size={15} />
              <span className="text-xs font-semibold text-slate-800">
                3-Day Delivery SLA active upon dispatch
              </span>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
          <Button
            type="button"
            label="Cancel"
            onClick={onHide}
            variant="outlined"
          />
          <Button
            type="submit"
            label="Authorize Dispatch"
            icon="check"
            disabled={
              addDispatchMutation.isPending ||
              isOverloaded ||
              !watchVehicleId ||
              !watchBundlesLoaded
            }
          />
        </div>
      </form>
    </Modal>
  );
}
