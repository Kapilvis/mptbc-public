import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Modal from "shared/components/popups/Modal";
import { Button } from "shared/components/buttons";
import {
  TextBox,
  DropDownList as SelectBox,
  DatePicker as DateBox,
} from "shared/components/forms";
import InputBlock from "shared/components/forms/InputBlock";
import { MultiSelect } from "primereact/multiselect";
import { ToastService } from "services";
import { useCreateTenderMutation, useUpdateTenderMutation } from "../queries";
import type { TenderRecord, DistrictTransporterAllocation } from "../data";
import { useTransportersQuery } from "../../../master/transporter-registration/queries";

interface TenderFormModalProps {
  visible: boolean;
  onHide: () => void;
  tenderToEdit?: TenderRecord | null;
}

interface FormValues {
  tenderRefNo: string;
  title: string;
  financialYear: string;
  agreementDate: string;
  validTill: string;
}

export default function TenderFormModal({
  visible,
  onHide,
  tenderToEdit,
}: TenderFormModalProps) {
  const createMutation = useCreateTenderMutation();
  const updateMutation = useUpdateTenderMutation();
  const { data: registeredTransporters = [] } = useTransportersQuery();

  const todayStr = new Date().toISOString().split("T")[0];
  const nextYearStr = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1),
  )
    .toISOString()
    .split("T")[0];

  const [selectedTransporters, setSelectedTransporters] = useState<number[]>(
    [],
  );

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      tenderRefNo: "",
      title: "",
      financialYear: "2026-27",
      agreementDate: todayStr,
      validTill: nextYearStr,
    },
  });

  useEffect(() => {
    if (tenderToEdit) {
      reset({
        tenderRefNo: tenderToEdit.tenderRefNo,
        title: tenderToEdit.title,
        financialYear: tenderToEdit.financialYear,
        agreementDate: tenderToEdit.agreementDate,
        validTill: tenderToEdit.validTill,
      });
      const existingIds = (tenderToEdit.allocations || []).map(
        (a) => a.transporterId,
      );
      setSelectedTransporters(Array.from(new Set(existingIds)));
    } else {
      reset({
        tenderRefNo: "",
        title: "",
        financialYear: "2026-27",
        agreementDate: todayStr,
        validTill: nextYearStr,
      });
      setSelectedTransporters([]);
    }
  }, [
    tenderToEdit,
    reset,
    todayStr,
    nextYearStr,
    visible,
    registeredTransporters,
  ]);

  const onSubmit = async (data: FormValues) => {
    if (selectedTransporters.length === 0) {
      ToastService.error("Please select at least one transporter.");
      return;
    }

    const allocations: DistrictTransporterAllocation[] =
      selectedTransporters.map((tId, idx) => {
        const found = registeredTransporters.find(
          (t) => t.transporterId === Number(tId),
        );
        return {
          id: `ALLOC-${Date.now()}-${idx}`,
          district: found?.district || "Madhya Pradesh",
          transporterId: Number(tId),
          transporterName: found
            ? found.transporterName
            : `Transporter #${tId}`,
          contractRole: "Primary",
          rates: { cat1: 330, cat2: 480, cat3: 620 },
        };
      });

    try {
      if (tenderToEdit) {
        await updateMutation.mutateAsync({
          ...tenderToEdit,
          tenderRefNo: data.tenderRefNo,
          title: data.title,
          financialYear: data.financialYear,
          agreementDate: data.agreementDate,
          validTill: data.validTill,
          status: tenderToEdit.status || "Active",
          nitDate: tenderToEdit.nitDate || todayStr,
          allocations,
        });
        ToastService.success("Tender details updated successfully!");
      } else {
        await createMutation.mutateAsync({
          tenderRefNo: data.tenderRefNo,
          title: data.title,
          financialYear: data.financialYear,
          agreementDate: data.agreementDate,
          validTill: data.validTill,
          status: "Active",
          nitDate: todayStr,
          allocations,
        });
        ToastService.success("Tender details created successfully!");
      }
      onHide();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save tender details.";
      ToastService.error(msg);
    }
  };

  const financialYearOptions = [
    { text: "2026-27", id: "2026-27" },
    { text: "2025-26", id: "2025-26" },
    { text: "2027-28", id: "2027-28" },
  ];

  const transporterOptions = useMemo(
    () =>
      registeredTransporters.map((t) => ({
        text: t.transporterName,
        id: t.transporterId,
      })),
    [registeredTransporters],
  );

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      size="medium"
      header={tenderToEdit ? "Edit Tender Details" : "Add Tender Details"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Row 1: Ref No & Academic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextBox
            label="Tender Ref No"
            name="tenderRefNo"
            required
            control={control}
            placeholder="Enter Tender Ref No"
          />
          <SelectBox
            label="Academic"
            name="financialYear"
            required
            control={control}
            data={financialYearOptions}
            optionValue="id"
            textField="text"
          />
        </div>

        {/* Row 2: Title & Transporter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextBox
            label="Tender Title"
            name="title"
            required
            control={control}
            placeholder="Enter Tender Title"
          />

          <InputBlock label="Transporter" required>
            <MultiSelect
              value={selectedTransporters}
              options={transporterOptions}
              onChange={(e) => setSelectedTransporters(e.value || [])}
              optionLabel="text"
              optionValue="id"
              placeholder="Select Transporter"
              filter
              display="comma"
              className="w-full form-dropdown-input"
              panelClassName="form-dropdown-panel"
              appendTo={document.body}
            />
          </InputBlock>
        </div>

        {/* Row 4: Agreement & Valid Till Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateBox
            label="Agreement Date"
            name="agreementDate"
            required
            control={control}
          />
          <DateBox
            label="Valid Till Date"
            name="validTill"
            required
            control={control}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-1">
          <Button
            type="button"
            label="Cancel"
            onClick={onHide}
            variant="outlined"
          />
          <Button
            type="submit"
            label={tenderToEdit ? "Update Tender" : "Save Tender"}
            icon="check"
            disabled={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
}
