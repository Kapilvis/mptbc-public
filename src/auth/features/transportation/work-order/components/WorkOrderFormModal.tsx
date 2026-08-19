import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "shared/components/popups/Modal";
import { Button } from "shared/components/buttons";
import {
  DropDownList as SelectBox,
  DatePicker as DateBox,
} from "shared/components/forms";
import InputBlock from "shared/components/forms/InputBlock";
import { MultiSelect } from "primereact/multiselect";
import { ToastService } from "services";
import { useCreateWorkOrderMutation } from "../queries";
import { useTendersQuery } from "../../tender-details/queries";
import {
  districts,
  tehsils,
} from "../../../master/transporter-registration/data";
import { Calendar } from "lucide-react";

interface WorkOrderFormModalProps {
  visible: boolean;
  onHide: () => void;
  transporters: Transportation.TransporterRegistration[];
}

interface FormValues {
  tenderId: string;
  transporterId: number;
  district: string;
  selectedBlocks: string[];
  instructionDate: string;
}

export default function WorkOrderFormModal({
  visible,
  onHide,
  transporters,
}: WorkOrderFormModalProps) {
  const createMutation = useCreateWorkOrderMutation();
  const { data: tenders = [] } = useTendersQuery();

  const todayStr = new Date().toISOString().split("T")[0];
  const firstTender = tenders[0];

  const [blockCapacities, setBlockCapacities] = useState<
    Record<string, number>
  >({
    INDORE: 20,
  });

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      tenderId: firstTender ? firstTender.tenderId : "",
      transporterId: transporters[0] ? transporters[0].transporterId : 1,
      district: "Indore",
      selectedBlocks: ["INDORE"],
      instructionDate: todayStr,
    },
  });

  const watchTenderId = watch("tenderId");
  const watchDistrict = watch("district");
  const watchInstructionDate = watch("instructionDate");
  const watchSelectedBlocks = watch("selectedBlocks") || [];

  // Initialize capacities for newly selected blocks
  useEffect(() => {
    setBlockCapacities((prev) => {
      const next = { ...prev };
      watchSelectedBlocks.forEach((block) => {
        if (next[block] === undefined) {
          next[block] = 20; // default 20 Metric Ton
        }
      });
      return next;
    });
  }, [watchSelectedBlocks]);

  // Selected tender object
  const selectedTender = useMemo(() => {
    return (
      tenders.find((t) => t.tenderId === watchTenderId) || tenders[0] || null
    );
  }, [watchTenderId, tenders]);

  // Transporters mapped to the selected tender
  const mappedTransporters = useMemo(() => {
    if (!selectedTender || !selectedTender.allocations?.length) {
      return transporters;
    }
    const mappedIds = selectedTender.allocations.map((a) => a.transporterId);
    const filtered = transporters.filter((t) =>
      mappedIds.includes(t.transporterId),
    );
    return filtered.length > 0 ? filtered : transporters;
  }, [selectedTender, transporters]);

  // Update selected transporter if mapped list changes
  useEffect(() => {
    if (mappedTransporters.length > 0) {
      setValue("transporterId", mappedTransporters[0].transporterId);
    }
  }, [mappedTransporters, setValue]);

  // Filter tehsils (blocks) based on selected district
  const districtBlocks = useMemo(() => {
    if (!watchDistrict) return [];
    const distObj = districts.find((d) => d.text === watchDistrict);
    if (!distObj) return [];
    return tehsils
      .filter((t) => t.districtId === distObj.id)
      .map((t) => ({ label: t.text, value: t.text }));
  }, [watchDistrict]);

  // Reset selected blocks when district changes
  useEffect(() => {
    if (districtBlocks.length > 0) {
      setValue("selectedBlocks", [districtBlocks[0].value]);
    } else {
      setValue("selectedBlocks", []);
    }
  }, [districtBlocks, setValue]);

  // Calculate SLA due date (5 days delivery SLA)
  const slaDueDate = useMemo(() => {
    if (!watchInstructionDate) return "-";
    try {
      const d = new Date(watchInstructionDate);
      if (isNaN(d.getTime())) return "-";
      d.setDate(d.getDate() + 5);
      return d.toISOString().split("T")[0];
    } catch {
      return "-";
    }
  }, [watchInstructionDate]);

  // Total metric tons and total bundles across all selected blocks
  const totalMetricTons = useMemo(() => {
    return watchSelectedBlocks.reduce(
      (sum, block) => sum + (Number(blockCapacities[block]) || 0),
      0,
    );
  }, [watchSelectedBlocks, blockCapacities]);

  const totalBundles = Math.round(totalMetricTons * 25);

  const onSubmit = async (data: FormValues) => {
    const blocks = data.selectedBlocks || [];
    if (blocks.length === 0) {
      ToastService.error("Please select at least one block.");
      return;
    }

    if (totalMetricTons <= 0) {
      ToastService.error(
        "Please enter a valid capacity in Metric Ton for each block.",
      );
      return;
    }

    try {
      for (let i = 0; i < blocks.length; i++) {
        const blockName = blocks[i];
        const blockMT = Number(blockCapacities[blockName]) || 0;
        const bundles = Math.round(blockMT * 25);
        const nineT = Math.floor(blockMT / 9);
        const rem = blockMT % 9;
        const four5T = rem > 0 ? Math.ceil(rem / 4.5) : 0;

        await createMutation.mutateAsync({
          tenderId: data.tenderId,
          district: data.district,
          block: blockName,
          totalBundles: bundles,
          instructionDate: data.instructionDate,
          nineTonTrucksRequired: nineT,
          fourPointFiveTonTrucksRequired: four5T,
          allocatedTransporterId: Number(data.transporterId) || 1,
        });
      }

      ToastService.success(
        `Work Order for ${blocks.length} block(s) generated successfully! Total Weight: ${Math.round(totalMetricTons)} MT (${totalBundles} Bundles)`,
      );
      onHide();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to generate work order.";
      ToastService.error(errMsg);
    }
  };

  const tenderOptions = useMemo(() => {
    return tenders.map((t) => ({
      text: `${t.tenderRefNo} (${t.financialYear})`,
      id: t.tenderId,
    }));
  }, [tenders]);

  const districtOptions = useMemo(() => {
    return districts.map((d) => ({
      text: d.text,
      id: d.text,
    }));
  }, []);

  const transporterOptions = useMemo(() => {
    return mappedTransporters.map((t) => ({
      text: t.transporterName,
      id: t.transporterId,
    }));
  }, [mappedTransporters]);

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      size="medium"
      header="Create Work Order"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Row 1: Tender and Transporter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectBox
            label="Select Tender"
            name="tenderId"
            required
            control={control}
            data={tenderOptions}
            optionValue="id"
            textField="text"
          />
          <SelectBox
            label="Select Transporter"
            name="transporterId"
            required
            control={control}
            data={transporterOptions}
            optionValue="id"
            textField="text"
          />
        </div>

        {/* Row 2: District and Multi-Block Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectBox
            label="District"
            name="district"
            required
            control={control}
            data={districtOptions}
            optionValue="id"
            textField="text"
          />

          <InputBlock label="Select Block / Tehsil (Multiple)" required>
            <MultiSelect
              value={watchSelectedBlocks}
              options={districtBlocks}
              onChange={(e) => setValue("selectedBlocks", e.value || [])}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Block(s)"
              filter
              display="comma"
              className="w-full form-dropdown-input"
              panelClassName="form-dropdown-panel"
              appendTo={document.body}
            />
          </InputBlock>
        </div>

        {/* Row 3: Dynamic Block-Wise Capacity Inputs in 2-column grid (Above Dates) */}
        {watchSelectedBlocks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {watchSelectedBlocks.map((blockName) => (
              <div key={blockName}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {blockName} Capacity{" "}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-xs text-slate-500 font-semibold">
                    {Math.round((Number(blockCapacities[blockName]) || 0) * 25)}{" "}
                    Bundles
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={blockCapacities[blockName] ?? 20}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setBlockCapacities((prev) => ({
                        ...prev,
                        [blockName]: val,
                      }));
                    }}
                    className="w-full h-[38px] pl-3 pr-24 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    placeholder="Enter capacity"
                  />
                  <span className="absolute right-3 text-xs font-bold text-slate-600 pointer-events-none">
                    Metric Ton
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Row 4: Dispatch Instruction Date and SLA Delivery Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateBox
            label="Dispatch Instruction Date"
            name="instructionDate"
            required
            control={control}
          />
          <div>
            <span className="text-[11px] font-bold text-slate-700 block mb-1">
              Delivery Due Date
            </span>
            <div className="border border-slate-200 bg-emerald-50/60 rounded-lg h-[38px] px-3 flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <Calendar size={14} className="text-emerald-600" />
                {slaDueDate}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                (+5 DAYS)
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
          <Button
            type="button"
            label="Cancel"
            onClick={onHide}
            variant="outlined"
          />
          <Button
            type="submit"
            label="Generate Work Order"
            icon="check"
            disabled={createMutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
}
