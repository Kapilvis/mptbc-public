import { useState, useMemo, useEffect } from "react";
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
import { FileText, AlertTriangle, ShieldAlert } from "lucide-react";
import {
  useWorkOrdersQuery,
  useSubmitPodMutation,
} from "../../work-order/queries";

interface FlatPodDispatch extends Transportation.Dispatch {
  district: string;
  block: string;
  transporterName: string;
}

interface PodFormValues {
  dispatchRef: string; // "workOrderId|dispatchId"
  deliveryDate: string;
  goodBundles: number;
  receiverName: string;
  receiverDesignation: string;
  signatureFile: string;
  challanFile: string;
}

export default function PodSubmissionPage() {
  const { data: workOrders = [], isLoading } = useWorkOrdersQuery();
  const submitPodMutation = useSubmitPodMutation();

  const todayStr = new Date().toISOString().split("T")[0];
  const [isLost, setIsLost] = useState(false);

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<PodFormValues>({
      defaultValues: {
        dispatchRef: "",
        deliveryDate: todayStr,
        goodBundles: 0,
        receiverName: "",
        receiverDesignation: "",
        signatureFile: "",
        challanFile: "",
      },
    });

  const watchDispatchRef = watch("dispatchRef");
  const watchGoodBundles = watch("goodBundles");

  // Get in-transit dispatches
  const activeDispatches = useMemo(() => {
    return workOrders.flatMap((wo) =>
      (wo.dispatches || [])
        .filter((d) => d.status === "In Transit")
        .map((d) => ({
          ...d,
          district: wo.district,
          block: wo.block,
          transporterName: wo.transporterName,
          workOrderDetails: `${wo.workOrderId} [${wo.district} (${wo.block})]`,
        })),
    );
  }, [workOrders]);

  // Get delivered dispatches for history grid
  const deliveredDispatches = useMemo(() => {
    return workOrders.flatMap((wo) =>
      (wo.dispatches || [])
        .filter((d) => d.status === "Delivered")
        .map((d) => ({
          ...d,
          district: wo.district,
          block: wo.block,
          transporterName: wo.transporterName,
        })),
    );
  }, [workOrders]);

  const selectedDispatch = useMemo(() => {
    if (!watchDispatchRef) return null;
    const [woId, dId] = watchDispatchRef.split("|");
    return (
      activeDispatches.find(
        (d) => d.workOrderId === woId && d.dispatchId === dId,
      ) || null
    );
  }, [watchDispatchRef, activeDispatches]);

  // Set default values when selection changes
  useEffect(() => {
    if (selectedDispatch) {
      setValue("goodBundles", selectedDispatch.bundlesLoaded);
      setIsLost(false);
    }
  }, [selectedDispatch, setValue]);

  // Auto-calculated damaged/missing bundles
  const damagedBundles = useMemo(() => {
    if (!selectedDispatch) return 0;
    if (isLost) return selectedDispatch.bundlesLoaded;
    const loaded = selectedDispatch.bundlesLoaded;
    const good = Number(watchGoodBundles) || 0;
    return Math.max(0, loaded - good);
  }, [selectedDispatch, watchGoodBundles, isLost]);

  // Handle lost toggle
  const handleLostToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsLost(checked);
    if (checked) {
      setValue("goodBundles", 0);
    } else if (selectedDispatch) {
      setValue("goodBundles", selectedDispatch.bundlesLoaded);
    }
  };

  // Dropdown options
  const dispatchOptions = useMemo(() => {
    return activeDispatches.map((d) => ({
      text: `${d.lrNumber} - ${d.transporterName} (Truck: ${d.truckNo})`,
      id: `${d.workOrderId}|${d.dispatchId}`,
    }));
  }, [activeDispatches]);

  // SLA due date for selected dispatch
  const slaDueDateStr = useMemo(() => {
    if (!selectedDispatch) return "";
    const date = new Date(selectedDispatch.dispatchDate);
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  }, [selectedDispatch]);

  const onSubmit = async (data: PodFormValues) => {
    if (!selectedDispatch) {
      ToastService.error("Please select an active dispatch.");
      return;
    }

    const dispatchDate = new Date(selectedDispatch.dispatchDate);
    const deliveryDate = new Date(data.deliveryDate);
    if (deliveryDate < dispatchDate) {
      ToastService.error("Delivery date cannot be before the dispatch date.");
      return;
    }

    const goodQty = Number(data.goodBundles);
    const totalQty = selectedDispatch.bundlesLoaded;
    if (!isLost && (goodQty < 0 || goodQty > totalQty)) {
      ToastService.error(
        `Good bundles count must be between 0 and ${totalQty}.`,
      );
      return;
    }

    try {
      const [woId, dId] = data.dispatchRef.split("|");
      await submitPodMutation.mutateAsync({
        workOrderId: woId,
        dispatchId: dId,
        actualDeliveryDate: data.deliveryDate,
        podFilePath: "mock_uploads/pod_signed_challan.pdf",
      });

      ToastService.success(
        `Proof of Delivery (POD) confirmed for LR ${selectedDispatch.lrNumber}!`,
      );
      setIsLost(false);
      reset({
        dispatchRef: "",
        deliveryDate: todayStr,
        goodBundles: 0,
        receiverName: "",
        receiverDesignation: "",
        signatureFile: "",
        challanFile: "",
      });
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to confirm POD submission.";
      ToastService.error(errMsg);
    }
  };

  if (isLoading) {
    return (
      <Page header="POD Submission" subHeader="Please wait...">
        <div className="flex items-center justify-center min-h-[300px] text-slate-500 font-medium">
          Loading in-transit logs and dispatch records...
        </div>
      </Page>
    );
  }

  return (
    <Page
      header="Proof of Delivery (POD) Submission"
      subHeader="वितरण का प्रमाण — Record textbook receiving logs, audit stock counts, and upload signed delivery challans."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="flex flex-col gap-5 p-5">
              <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <FileText className="text-emerald-600" size={20} />
                POD Submission Details
              </span>

              {/* Select Active Dispatch Dropdown */}
              <SelectBox
                label="Select Active Shipment / Dispatch"
                name="dispatchRef"
                required
                control={control}
                data={dispatchOptions}
                optionValue="id"
                textField="text"
              />

              {/* Dynamic Dispatch Info Card */}
              {selectedDispatch && (
                <div className="bg-slate-50 border rounded-xl p-4 flex flex-col gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-3 border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Work Order & Route
                      </span>
                      <span className="font-bold text-slate-800 text-xs block">
                        {selectedDispatch.workOrderDetails}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Transporter & Truck No
                      </span>
                      <span className="font-bold text-slate-800 text-xs block">
                        {selectedDispatch.transporterName} (
                        {selectedDispatch.truckNo})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">
                        Dispatched Qty:
                      </span>
                      <strong className="text-slate-700 block text-sm">
                        {selectedDispatch.bundlesLoaded} Bundles
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        Weight:{" "}
                        {(selectedDispatch.bundlesLoaded * 0.04).toFixed(2)}{" "}
                        Tons
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">
                        Dispatch Date:
                      </span>
                      <strong className="text-slate-700 block text-sm">
                        {selectedDispatch.dispatchDate}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">
                        SLA Due Date:
                      </span>
                      <strong className="text-rose-600 block text-sm font-semibold">
                        {slaDueDateStr}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Mark as LOST Checkbox */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <input
                  type="checkbox"
                  id="lostCheckbox"
                  checked={isLost}
                  onChange={handleLostToggle}
                  className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500 cursor-pointer"
                  disabled={!selectedDispatch}
                />
                <label
                  htmlFor="lostCheckbox"
                  className="text-xs font-bold text-slate-700 cursor-pointer select-none"
                >
                  Shipment declared LOST (All books damaged, hijacked, or
                  missing in transit)
                </label>
              </div>

              {/* Quantity Audits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Good Bundles Received"
                  name="goodBundles"
                  required
                  control={control}
                  placeholder="Enter good bundles"
                  disabled={!selectedDispatch || isLost}
                />

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Damaged / Missing Bundles
                  </span>
                  <div
                    className={`border rounded-xl p-3 flex items-center justify-between ${
                      damagedBundles > 0
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                    }`}
                  >
                    <span className="text-sm font-bold">
                      {damagedBundles} Bundles
                    </span>
                    {damagedBundles > 0 ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        {isLost ? "Declared Lost" : "Shortage/Damage"}
                      </span>
                    ) : (
                      selectedDispatch && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Perfect Delivery
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Loss Warning */}
              {damagedBundles > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-rose-800">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div className="flex flex-col text-xs">
                    <span className="font-bold">
                      Deduction Recovery Warning
                    </span>
                    <span className="leading-relaxed mt-0.5">
                      {isLost
                        ? "Lost shipment: 1.5x of total book value will be recovered from the transporter's final bill."
                        : `${damagedBundles} missing/damaged bundles will be recovered at unit book price from transporter freight.`}
                    </span>
                  </div>
                </div>
              )}

              {/* Officer details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextBox
                  label="Receiving Officer Name"
                  name="receiverName"
                  required
                  control={control}
                  placeholder="e.g. Block Resource Coordinator (BRC)"
                  disabled={!selectedDispatch}
                />
                <TextBox
                  label="Officer Designation"
                  name="receiverDesignation"
                  required
                  control={control}
                  placeholder="e.g. BRC, Sanwer Block"
                  disabled={!selectedDispatch}
                />
              </div>

              {/* Delivery Date */}
              <DateBox
                label="Actual Date of Delivery"
                name="deliveryDate"
                required
                control={control}
                disabled={!selectedDispatch}
              />

              {/* Mock Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Upload Signed Delivery Challan (PDF/JPG){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="file"
                    className="border border-slate-200 rounded-xl p-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer bg-white"
                    disabled={!selectedDispatch}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Upload Receiver Signature Stamp (JPG){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="file"
                    className="border border-slate-200 rounded-xl p-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer bg-white"
                    disabled={!selectedDispatch}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-3">
                <Button
                  type="submit"
                  label="Confirm Delivery"
                  icon="check"
                  disabled={!watchDispatchRef || submitPodMutation.isPending}
                />
              </div>
            </Card>
          </form>
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-1">
          <Card className="p-4 flex flex-col gap-4">
            <span className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5 font-sans">
              <ShieldAlert size={16} className="text-rose-600" />
              POD Submission Policy
            </span>
            <div className="text-xs text-slate-600 flex flex-col gap-3 leading-relaxed">
              <div>
                <strong className="text-slate-800">
                  1. Quantity Reconciliation:
                </strong>
                <p className="mt-0.5 text-slate-500">
                  Total Dispatched Quantity must equal Good Received Qty +
                  Damaged/Missing Qty. Discrepancies block form submission.
                </p>
              </div>
              <div>
                <strong className="text-slate-800">
                  2. Financial Recoveries:
                </strong>
                <p className="mt-0.5 text-slate-500">
                  Any missing/damaged count triggers automatic billing
                  recoveries during step 4 of payment settlement:
                  <ul className="list-disc pl-4 mt-1 text-[11px]">
                    <li>Lost Shipment: 150% of Book Cost recovered.</li>
                    <li>Damaged books: 100% of Book Cost recovered.</li>
                  </ul>
                </p>
              </div>
              <div>
                <strong className="text-slate-800">
                  3. Delay Calculations:
                </strong>
                <p className="mt-0.5 text-slate-500">
                  Comparing Dispatch Date and Delivery Date yields delay days.
                  Delay penalties slab rate:
                  <ul className="list-disc pl-4 mt-1 text-[11px]">
                    <li>Days 1-4: 5% of freight per day.</li>
                    <li>Days 5-9: 10% of freight per day.</li>
                  </ul>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Proof of Delivery History Grid */}
      <div className="mt-8">
        <Card className="p-5">
          <span className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
            <FileText className="text-emerald-600" size={20} />
            Delivered Shipments & POD Log
          </span>
          <GridPanel
            data={deliveredDispatches}
            searchFields={[
              "lrNumber",
              "truckNo",
              "transporterName",
              "district",
              "block",
            ]}
            columns={[
              {
                header: "LR Number",
                field: "lrNumber",
                width: "120px",
                cell: (row: FlatPodDispatch) => (
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
                cell: (row: FlatPodDispatch) => (
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
                header: "Transporter & Truck",
                cell: (row: FlatPodDispatch) => (
                  <div className="flex flex-col text-xs text-slate-600">
                    <span>{row.transporterName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {row.truckNo}
                    </span>
                  </div>
                ),
              },
              {
                header: "Delivered Load",
                cell: (row: FlatPodDispatch) => (
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-slate-800">
                      {row.bundlesLoaded} Bundles
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Weight: {(row.bundlesLoaded * 0.04).toFixed(2)} Tons
                    </span>
                  </div>
                ),
                align: "right",
                width: "130px",
              },
              {
                header: "Delivery Timeline",
                cell: (row: FlatPodDispatch) => (
                  <div className="flex flex-col text-xs">
                    <span>Delivered: {row.actualDeliveryDate}</span>
                    <span className="text-[10px] text-slate-400">
                      Dispatched: {row.dispatchDate}
                    </span>
                  </div>
                ),
              },
              {
                header: "SLA Delay Status",
                align: "center",
                width: "140px",
                cell: (row: FlatPodDispatch) => {
                  const delay = row.deliveryDelayDays || 0;
                  return (
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        delay > 0
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {delay > 0 ? `DELAYED BY ${delay} DAYS` : "ON TIME"}
                    </span>
                  );
                },
              },
              {
                header: "Signed Challan",
                width: "130px",
                align: "center",
                cell: (row: FlatPodDispatch) => (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      ToastService.success(
                        `Downloading signed challan for LR ${row.lrNumber}`,
                      );
                    }}
                    className="text-emerald-600 hover:text-emerald-800 text-xs font-bold flex items-center gap-1 justify-center"
                  >
                    <FileText size={14} />
                    View Receipt
                  </a>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </Page>
  );
}
