import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { Button, ButtonPanel } from "shared/components/buttons";
import {
  DatePicker,
  DropDownList,
  FileUpload,
  FormDivider,
  NumberBox,
  TextBox,
} from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { usePaperDispatchForm } from "./form.hook";

interface Props {
  onSubmit: (data: PaperSupplyDispatch.PaperDispatchForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<PaperSupplyDispatch.PaperDispatchForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export default function PaperDispatchForm(props: Props) {
  const { register, handleSubmit, reset, control, setValue } =
    usePaperDispatchForm(props.onSubmit, props.fetchData);

  const workOrderOptions = [
    {
      label: "WO/TBC/2026-27/0358 - A.B. Paper Mills (170 GSM Art Card)",
      value: "WO/TBC/2026-27/0358",
      orderDate: "2026-04-04",
      mill: "A.B. Paper Mills",
      vendorId: 1,
      type: "170 GSM Art Card Sheet Paper",
    },
    {
      label: "WO/TBC/2026-27/0364 - T.N.P.L. (120 GSM Maplitho)",
      value: "WO/TBC/2026-27/0364",
      orderDate: "2026-04-02",
      mill: "T.N.P.L.",
      vendorId: 2,
      type: "120 GSM Maplitho Reel Paper",
    },
    {
      label: "WO/TBC/2026-27/0370 - Ballarpur Industries (70 GSM Maplitho)",
      value: "WO/TBC/2026-27/0370",
      orderDate: "2026-08-14",
      mill: "Ballarpur Industries (BILT)",
      vendorId: 3,
      type: "70 GSM Maplitho Reel Paper",
    },
    {
      label: "WO/TBC/2026-27/0376 - ITC Limited (58 GSM Maplitho)",
      value: "WO/TBC/2026-27/0376",
      orderDate: "2026-12-24",
      mill: "ITC Limited",
      vendorId: 4,
      type: "58 GSM Maplitho Reel Paper",
    },
  ];

  const consigneeOptions = [
    {
      label: "Central Paper Depot, Bhopal",
      value: "Central Paper Depot, Bhopal",
    },
    {
      label: "M/s Jayesh Offset Printers, Indore",
      value: "M/s Jayesh Offset Printers, Indore",
    },
    {
      label: "M/s Alok Packaging, Gwalior",
      value: "M/s Alok Packaging, Gwalior",
    },
    {
      label: "M/s Fine Art Printers, Jabalpur",
      value: "M/s Fine Art Printers, Jabalpur",
    },
  ];

  const godownOptions = [
    {
      label: "Godown 1 - Central Paper Depot",
      value: "Godown 1 - Central Paper Depot",
    },
    {
      label: "Godown 2 - Central Paper Depot",
      value: "Godown 2 - Central Paper Depot",
    },
    {
      label: "Godown 3 - Central Paper Depot",
      value: "Godown 3 - Central Paper Depot",
    },
    {
      label: "Regional Depot Storage - Ujjain",
      value: "Regional Depot Storage - Ujjain",
    },
  ];

  useEffect(() => {
    if (!props.isEditMode && !props.fetchData) {
      const todayStr = new Date().toISOString().split("T")[0];
      setValue("challanNo", "CHL/2026/0160");
      setValue("dispatchDate", todayStr);
      setValue("challanDate", todayStr);
      setValue("grDate", todayStr);
    }
  }, [props.isEditMode, props.fetchData, setValue]);

  const selectedOrderNo = useWatch({ control, name: "orderNo" });

  useEffect(() => {
    if (selectedOrderNo) {
      const selected = workOrderOptions.find(
        (o) => o.value === selectedOrderNo,
      );
      if (selected) {
        setValue("orderDate", selected.orderDate, { shouldValidate: true });
        setValue("paperMillName", selected.mill, { shouldValidate: true });
        setValue("vendorId", selected.vendorId, { shouldValidate: true });
        setValue("paperType", selected.type, { shouldValidate: true });
      }
    }
  }, [selectedOrderNo, setValue]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormDivider title="Dispatch & Work Order Basic Details" />

      <InputPanel orientation="horizontal">
        <DatePicker
          label="Dispatch Date"
          name="dispatchDate"
          control={control}
          required
        />

        <DropDownList
          label="Paper Order Number"
          required
          data={workOrderOptions}
          name="orderNo"
          control={control}
          textField="label"
          optionValue="value"
          placeholder="Select Work Order"
        />

        <DatePicker label="Order Date" name="orderDate" control={control} />

        <TextBox
          label="Paper Mill Name"
          disabled
          {...register("paperMillName")}
          placeholder="Auto filled from order"
        />

        <TextBox
          label="Paper Specification"
          disabled
          {...register("paperType")}
          placeholder="Auto filled from order"
        />
      </InputPanel>

      <FormDivider title="Shipment Quantity & Reel Specifications" />

      <InputPanel orientation="horizontal">
        <DropDownList
          label="Printer / Consignee Name"
          required
          data={consigneeOptions}
          name="consigneeName"
          control={control}
          textField="label"
          optionValue="value"
          placeholder="Select Consignee Depot / Printer"
        />

        <NumberBox
          control={control}
          name="reelCount"
          label="Reel / Bundle Count"
          subLabel="(Reels)"
          required
          maxFractionDigits={0}
          placeholder="e.g. 120"
        />

        <NumberBox
          control={control}
          name="totalWeightTon"
          label="Total Weight"
          subLabel="(in MT)"
          required
          maxFractionDigits={3}
          placeholder="e.g. 45.500"
        />
      </InputPanel>

      <FormDivider title="Challan, Vehicle & Transport Information" />

      <InputPanel orientation="horizontal">
        <TextBox
          label="Challan Number"
          required
          {...register("challanNo")}
          placeholder="e.g. CHL/2026/0160"
        />

        <DatePicker
          label="Challan Date"
          name="challanDate"
          control={control}
          required
        />

        <TextBox
          label="Truck Number"
          required
          {...register("truckNo")}
          placeholder="e.g. MP-04-HE-4821"
        />

        <TextBox
          label="Driver Name"
          required
          {...register("driverName")}
          placeholder="e.g. Ramesh Kumar"
        />

        <TextBox
          label="Driver Mobile No."
          required
          {...register("driverMobile")}
          placeholder="e.g. 9826012345"
        />

        <TextBox
          label="G.R. Number"
          {...register("grNo")}
          placeholder="e.g. GR/2026/9021"
        />

        <DatePicker label="G.R. Date" name="grDate" control={control} />
      </InputPanel>

      <FormDivider title="Warehouse Location & Remarks" />

      <InputPanel orientation="horizontal">
        <DropDownList
          label="Godown / Warehouse"
          required
          data={godownOptions}
          name="godownName"
          control={control}
          textField="label"
          optionValue="value"
          placeholder="Select Depot Warehouse Godown"
        />

        <TextBox
          label="Remarks"
          {...register("remarks")}
          placeholder="Enter transport or condition remarks"
        />
      </InputPanel>

      <FormDivider title="Official Delivery Challan Soft Copy" />

      <InputPanel orientation="horizontal">
        <div className="w-full">
          <FileUpload
            name="challanCopyPath"
            control={control}
            label="Upload Delivery Challan Soft Copy (PDF / JPG)"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      </InputPanel>

      <ButtonPanel>
        <Button
          label={props.isEditMode ? "Update" : "Save"}
          type="submit"
          isLoading={props.isSaving}
          disabled={props.isSaving}
          icon="pi pi-save"
        />

        <Button
          type="button"
          label={props.isEditMode ? "Reset" : "Clear"}
          icon="pi pi-refresh"
          onClick={() => reset()}
          disabled={props.isSaving}
        />

        {props.onCancel && (
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            onClick={props.onCancel}
            disabled={props.isSaving}
          />
        )}
      </ButtonPanel>
    </form>
  );
}
