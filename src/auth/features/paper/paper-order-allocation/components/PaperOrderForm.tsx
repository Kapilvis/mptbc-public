import { useEffect } from "react";
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
import { usePaperOrderForm } from "./form.hook";

interface Props {
  onSubmit: (data: PaperOrder.PaperSupplyOrderForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<PaperOrder.PaperSupplyOrderForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export default function PaperOrderForm(props: Props) {
  const { register, handleSubmit, reset, control, setValue } =
    usePaperOrderForm(props.onSubmit, props.fetchData);

  const vendorOptions = [
    {
      label: "A.B. Paper Mills (A.B. Paper Mills Pvt Ltd)",
      value: 1,
      name: "A.B. Paper Mills Pvt Ltd",
      mill: "A.B. Paper Mills",
    },
    {
      label: "T.N.P.L. (Tamil Nadu Newsprint & Papers Ltd)",
      value: 2,
      name: "Tamil Nadu Newsprint & Papers Ltd",
      mill: "T.N.P.L.",
    },
    {
      label: "Ballarpur Industries (BILT)",
      value: 3,
      name: "Ballarpur Industries Limited",
      mill: "Ballarpur Industries (BILT)",
    },
    {
      label: "ITC Limited (ITC Limited - Paperboards)",
      value: 4,
      name: "ITC Limited - Paperboards & Specialty Papers",
      mill: "ITC Limited",
    },
    {
      label: "J.K. Paper Mills (J.K. Paper Limited)",
      value: 5,
      name: "J.K. Paper Limited",
      mill: "J.K. Paper Mills",
    },
    {
      label: "Century Pulp & Paper",
      value: 6,
      name: "Century Pulp & Paper",
      mill: "Century Pulp & Paper",
    },
  ];

  const paperTypeOptions = [
    {
      label: "58 GSM Maplitho Reel Paper",
      value: "58 GSM Maplitho Reel Paper",
    },
    {
      label: "70 GSM Maplitho Reel Paper",
      value: "70 GSM Maplitho Reel Paper",
    },
    {
      label: "120 GSM Maplitho Reel Paper",
      value: "120 GSM Maplitho Reel Paper",
    },
    {
      label: "170 GSM Art Card Sheet Paper",
      value: "170 GSM Art Card Sheet Paper",
    },
    {
      label: "200 GSM Art Card Sheet Paper",
      value: "200 GSM Art Card Sheet Paper",
    },
    {
      label: "250 GSM Art Card Sheet Paper",
      value: "250 GSM Art Card Sheet Paper",
    },
  ];

  useEffect(() => {
    if (!props.isEditMode && !props.fetchData) {
      setValue("orderNo", "WO/TBC/2026-27/0359");
      setValue("gstPercent", 18);
    }
  }, [props.isEditMode, props.fetchData, setValue]);

  const handleVendorChange = (vendorIdVal: unknown) => {
    const selected = vendorOptions.find((v) => v.value === Number(vendorIdVal));
    if (selected) {
      setValue("vendorId", selected.value);
      setValue("vendorName", selected.name);
      setValue("paperMillName", selected.mill);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormDivider title="Purchase Work Order Basic Information" />

      <InputPanel orientation="horizontal">
        <TextBox
          label="Order Number"
          subLabel="(Auto Generated)"
          disabled
          {...register("orderNo")}
          placeholder="WO/TBC/2026-27/0359"
        />

        <DatePicker
          label="Order Date"
          name="orderDate"
          control={control}
          required
        />

        <DropDownList
          label="Paper Mill / Vendor Name"
          required
          data={vendorOptions}
          name="vendorId"
          control={control}
          onChange={(val) => handleVendorChange(val)}
          textField="label"
          optionValue="value"
          placeholder="Select Paper Mill / Vendor"
        />

        <DropDownList
          label="Paper Type / Specification"
          required
          data={paperTypeOptions}
          name="paperType"
          control={control}
          textField="label"
          optionValue="value"
          placeholder="Select Paper Specification / Type"
        />
      </InputPanel>

      <FormDivider title="Quantity & Valuation Parameters" />

      <InputPanel orientation="horizontal">
        <NumberBox
          control={control}
          name="orderedQtyMT"
          label="Ordered Quantity"
          subLabel="(in MT)"
          required
          maxFractionDigits={3}
          placeholder="Enter quantity in MT (e.g. 500)"
        />

        <NumberBox
          control={control}
          name="ratePerMT"
          label="Rate per MT"
          subLabel="(in ₹)"
          required
          maxFractionDigits={2}
          placeholder="Enter rate per MT (e.g. 50000)"
        />

        <NumberBox
          control={control}
          name="basicAmount"
          label="Basic Amount"
          subLabel="(₹ Auto Calc)"
          disabled
          placeholder="0.00"
        />

        <NumberBox
          control={control}
          name="gstPercent"
          label="GST Percentage"
          subLabel="(%)"
          required
          maxFractionDigits={2}
          placeholder="18"
        />

        <NumberBox
          control={control}
          name="totalAmount"
          label="Total Amount"
          subLabel="(₹ Incl GST)"
          disabled
          placeholder="0.00"
        />
      </InputPanel>

      <FormDivider title="Delivery Location & Schedule" />

      <InputPanel orientation="horizontal">
        <TextBox
          label="Place of Delivery"
          required
          {...register("deliveryLocation")}
          placeholder="e.g. Central Paper Depot, Bhopal"
        />

        <DatePicker
          label="Delivery Deadline Date"
          name="deliveryDate"
          control={control}
          required
        />

        <TextBox
          label="Vendor Bill No."
          {...register("millBillNo")}
          placeholder="e.g. INV/2026/089"
        />

        <DatePicker label="Bill Date" name="billDate" control={control} />
      </InputPanel>

      <FormDivider title="Vendor Invoice & Despatch Bill Soft Copy" />

      <InputPanel orientation="horizontal">
        <div className="w-full">
          <FileUpload
            name="billCopyPath"
            control={control}
            label="Upload Vendor Invoice / Bill Copy (PDF / JPG)"
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
