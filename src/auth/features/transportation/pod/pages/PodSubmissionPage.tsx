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
import InputBlock from "shared/components/forms/InputBlock";
import { ToastService } from "services";
import { FileText, AlertTriangle } from "lucide-react";
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
      text: `${d.lrNumber} - ${d.transporterName} (${d.district} - ${d.block})`,
      id: `${d.workOrderId}|${d.dispatchId}`,
    }));
  }, [activeDispatches]);

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
      subHeader="Record textbook receiving logs, audit stock counts, and upload signed delivery challans."
    >
      <div className="flex flex-col gap-6">
        {/* Full-width Form Card with Generous Spacing */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6 flex flex-col gap-6">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-base font-bold text-slate-800 tracking-tight">
                POD Submission Details
              </span>
            </div>

            {/* Form Fields Container with clean vertical and horizontal gaps */}
            <div className="flex flex-col gap-6">
              {/* Row 1: 3 Items (Dispatch, Good Bundles, Damaged/Missing) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectBox
                  label="Select Active Shipment / Dispatch"
                  name="dispatchRef"
                  required
                  control={control}
                  data={dispatchOptions}
                  optionValue="id"
                  textField="text"
                />

                <NumberBox
                  label="Good Bundles Received"
                  name="goodBundles"
                  required
                  control={control}
                  placeholder="Enter good bundles"
                  disabled={!selectedDispatch || isLost}
                />

                <InputBlock label="Damaged / Missing Bundles">
                  <div
                    className={`border rounded-lg h-[38px] px-3 flex items-center justify-between transition-colors ${
                      damagedBundles > 0
                        ? "bg-rose-50 border-rose-300 text-rose-800"
                        : "bg-emerald-50/60 border-slate-200 text-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">
                      {damagedBundles} Bundles
                    </span>
                    {damagedBundles > 0 ? (
                      <span className="text-[10px] font-bold uppercase bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                        {isLost ? "Declared Lost" : "Shortage"}
                      </span>
                    ) : (
                      selectedDispatch && (
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Full Delivery
                        </span>
                      )
                    )}
                  </div>
                </InputBlock>
              </div>

              {/* Row 2: 3 Items (Officer Name, Designation, Delivery Date) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextBox
                  label="Receiving Officer Name"
                  name="receiverName"
                  required
                  control={control}
                  placeholder="e.g. Block Resource Coordinator"
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

                <DateBox
                  label="Actual Date of Delivery"
                  name="deliveryDate"
                  required
                  control={control}
                  disabled={!selectedDispatch}
                />
              </div>

              {/* Row 3: 3 Items (Upload Challan, Upload Signature, Lost Checkbox) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputBlock label="Upload Delivery Challan (PDF/JPG)" required>
                  <input
                    type="file"
                    className="w-full h-[38px] px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-700 cursor-pointer focus:border-emerald-500 focus:outline-none"
                    disabled={!selectedDispatch}
                    required
                  />
                </InputBlock>

                <InputBlock label="Upload Signature Stamp (JPG)" required>
                  <input
                    type="file"
                    className="w-full h-[38px] px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-700 cursor-pointer focus:border-emerald-500 focus:outline-none"
                    disabled={!selectedDispatch}
                    required
                  />
                </InputBlock>

                <InputBlock label="Shipment Status">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg h-[38px] px-3 bg-gray-50">
                    <input
                      type="checkbox"
                      id="lostCheckbox"
                      checked={isLost}
                      onChange={handleLostToggle}
                      className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
                      disabled={!selectedDispatch}
                    />
                    <label
                      htmlFor="lostCheckbox"
                      className="text-xs font-semibold text-gray-700 cursor-pointer select-none"
                    >
                      Declare Shipment as LOST
                    </label>
                  </div>
                </InputBlock>
              </div>
            </div>

            {/* Deduction Warning if Damaged */}
            {damagedBundles > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-rose-800">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="flex flex-col text-xs">
                  <span className="font-bold">Deduction Recovery Notice</span>
                  <span className="leading-relaxed mt-0.5">
                    {isLost
                      ? "Lost shipment: 1.5x of book value will be recovered from the transporter's final bill."
                      : `${damagedBundles} missing/damaged bundles will be recovered at unit book price from freight.`}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 mt-2">
              <Button
                type="submit"
                label="Confirm Delivery"
                icon="check"
                disabled={!watchDispatchRef || submitPodMutation.isPending}
              />
            </div>
          </Card>
        </form>

        {/* History Grid - Standard Card and Size matching other master pages */}
        <Card>
          <GridPanel
            title="Recent Verified POD Records"
            data={deliveredDispatches}
            searchFields={[
              "lrNumber",
              "truckNo",
              "district",
              "block",
              "transporterName",
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
                header: "Delivered Bundles",
                field: "bundlesLoaded",
                sortable: true,
                align: "center",
                width: "140px",
              },
              {
                header: "Delivered Weight",
                cell: (row: FlatPodDispatch) => (
                  <span className="font-semibold text-slate-700">
                    {(row.bundlesLoaded * 0.04).toFixed(2)} T
                  </span>
                ),
                align: "center",
                width: "130px",
              },
              {
                header: "Dispatch Date",
                field: "dispatchDate",
                sortable: true,
                width: "120px",
              },
              {
                header: "Delivery Date",
                field: "actualDeliveryDate",
                sortable: true,
                width: "120px",
              },
              {
                header: "SLA Delay Status",
                align: "center",
                width: "150px",
                cell: (row: FlatPodDispatch) => {
                  const delay = row.deliveryDelayDays || 0;
                  return (
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap inline-block ${
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
                width: "140px",
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
                    className="text-emerald-600 hover:text-emerald-800 text-xs font-bold flex items-center gap-1 justify-center whitespace-nowrap"
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
