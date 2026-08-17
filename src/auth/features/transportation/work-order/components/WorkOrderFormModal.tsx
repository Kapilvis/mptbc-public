import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "shared/components/popups/Modal";
import { Button } from "shared/components/buttons";
import {
  NumberBox,
  DropDownList as SelectBox,
  DatePicker as DateBox,
} from "shared/components/forms";
import { ToastService } from "services";
import { useCreateWorkOrderMutation } from "../queries";
import { mockTenders } from "../../commercial-bid/data";
import {
  districts,
  tehsils,
} from "../../../master/transporter-registration/data";
import { AlertTriangle, Calendar } from "lucide-react";

interface WorkOrderFormModalProps {
  visible: boolean;
  onHide: () => void;
  transporters: Transportation.TransporterRegistration[];
}

interface FormValues {
  district: string;
  block: string;
  totalBundles: number;
  instructionDate: string;
  nineTonTrucksRequired: number;
  fourPointFiveTonTrucksRequired: number;
}

export default function WorkOrderFormModal({
  visible,
  onHide,
  transporters,
}: WorkOrderFormModalProps) {
  const createMutation = useCreateWorkOrderMutation();

  const todayStr = new Date().toISOString().split("T")[0];

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      district: "",
      block: "",
      totalBundles: 0,
      instructionDate: todayStr,
      nineTonTrucksRequired: 0,
      fourPointFiveTonTrucksRequired: 0,
    },
  });

  const watchDistrict = watch("district");
  const watchInstructionDate = watch("instructionDate");

  // Get active tender for the selected district
  const selectedTender = useMemo(() => {
    if (!watchDistrict) return null;
    return mockTenders.find((t) => t.district === watchDistrict);
  }, [watchDistrict]);

  const allocatedTransporter = useMemo(() => {
    const transporterId = selectedTender?.allocatedTransporterId;
    // Fallback: if no L1 allocated, use first available transporter for demo
    return (
      transporters.find((t) => t.transporterId === transporterId) ??
      transporters[0] ??
      null
    );
  }, [selectedTender, transporters]);

  // Filter tehsils (blocks) based on selected district
  const filteredBlocks = useMemo(() => {
    if (!watchDistrict) return [];
    const distObj = districts.find((d) => d.text === watchDistrict);
    if (!distObj) return [];
    return tehsils
      .filter((t) => t.districtId === distObj.id)
      .map((t) => ({ text: t.text, id: t.id }));
  }, [watchDistrict]);

  // Reset block value if district changes
  useEffect(() => {
    setValue("block", "");
  }, [watchDistrict, setValue]);

  // Calculate SLA due date
  const slaDueDate = useMemo(() => {
    if (!watchInstructionDate) return "-";
    try {
      const d = new Date(watchInstructionDate);
      if (isNaN(d.getTime())) return "-";
      d.setDate(d.getDate() + 3);
      return d.toISOString().split("T")[0];
    } catch {
      return "-";
    }
  }, [watchInstructionDate]);

  const onSubmit = async (data: FormValues) => {
    // Pick the resolved transporter ID (L1 or demo fallback)
    const resolvedTransporterId =
      selectedTender?.allocatedTransporterId ??
      allocatedTransporter?.transporterId ??
      1;

    try {
      await createMutation.mutateAsync({
        district: data.district,
        block: data.block,
        totalBundles: Number(data.totalBundles),
        instructionDate: data.instructionDate,
        nineTonTrucksRequired: Number(data.nineTonTrucksRequired),
        fourPointFiveTonTrucksRequired: Number(
          data.fourPointFiveTonTrucksRequired,
        ),
        allocatedTransporterId: resolvedTransporterId,
      });

      ToastService.success("Work Order generated successfully!");
      onHide();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to generate work order.";
      ToastService.error(errMsg);
    }
  };

  const districtOptions = useMemo(() => {
    return districts.map((d) => ({ text: d.text, id: d.text }));
  }, []);

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      size="medium"
      header="Create District Work Order & Allocation"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* District HQ */}
        <SelectBox
          label="District Headquarters"
          name="district"
          required
          control={control}
          data={districtOptions}
          optionValue="text"
          textField="text"
        />

        {/* Transporter Allocation Details Panel */}
        {watchDistrict && (
          <div className="rounded-xl overflow-hidden border p-4 bg-slate-50 border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Authorized Transporter Allocation
            </span>
            {allocatedTransporter ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-800 text-sm">
                  {allocatedTransporter.transporterName}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Type: {allocatedTransporter.transporterType} | Registration:{" "}
                  {allocatedTransporter.registrationNo}
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 mt-1 text-rose-600">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase">
                    Authorization Missing
                  </span>
                  <span className="text-[11px] text-rose-500 leading-relaxed mt-0.5">
                    No Prime Bidder has been authorized for {watchDistrict} yet.
                    Please complete L1 selection first.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Block HQ */}
        <SelectBox
          label="Block Headquarters"
          name="block"
          required
          control={control}
          data={filteredBlocks}
          optionValue="text"
          textField="text"
          disabled={!watchDistrict}
        />

        {/* Total Bundle Count */}
        <NumberBox
          label="Total Bundle Count (40KG standard)"
          name="totalBundles"
          required
          control={control}
          placeholder="Enter bundle count"
        />

        {/* Date and SLA Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateBox
            label="Dispatch Instruction Date"
            name="instructionDate"
            required
            control={control}
          />

          <div className="flex flex-col justify-end">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              SLA Delivery Due Date
            </span>
            <div className="border border-slate-200 bg-emerald-50/50 rounded-xl p-3 flex items-center gap-2">
              <Calendar className="text-emerald-600 shrink-0" size={16} />
              <span className="text-sm font-bold text-slate-800">
                {slaDueDate}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase ml-auto tracking-wider">
                (+3 Days)
              </span>
            </div>
          </div>
        </div>

        {/* Estimates / Truck counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberBox
            label="Est. Heavy Trucks (9-Ton) req."
            name="nineTonTrucksRequired"
            control={control}
            placeholder="0"
          />
          <NumberBox
            label="Est. Small Trucks (4.5-Ton) req."
            name="fourPointFiveTonTrucksRequired"
            control={control}
            placeholder="0"
          />
        </div>

        {/* Dialog Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-3">
          <Button
            type="button"
            label="Cancel"
            onClick={onHide}
            variant="outlined"
          />
          <Button
            type="submit"
            label="Generate Work Order"
            icon="file"
            disabled={!allocatedTransporter || createMutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
}
