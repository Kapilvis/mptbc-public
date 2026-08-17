import { Button, ButtonPanel } from "shared/components/buttons";
import {
  DropDownList,
  FileUpload,
  FormDivider,
  NumberBox,
  TextBox,
} from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { usePaperVendorForm } from "./form.hook";

interface Props {
  onSubmit: (data: PaperVendor.VendorForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<PaperVendor.VendorForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export default function PaperVendorForm(props: Props) {
  const { register, handleSubmit, reset, control } = usePaperVendorForm(
    props.onSubmit,
    props.fetchData,
  );

  const academicYearOptions = [
    { label: "2026-2027", value: "2026-2027" },
    { label: "2025-2026", value: "2025-2026" },
    { label: "2024-2025", value: "2024-2025" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormDivider title="Vendor & Paper Mill Basic Information" />

      {/* Row 1: Basic Vendor Details */}
      <InputPanel orientation="horizontal">
        <TextBox
          label="Paper Vendor Name"
          required
          {...register("vendorName")}
          placeholder="Enter Paper Vendor Company Name"
        />

        <TextBox
          label="Paper Mill Name"
          required
          {...register("paperMillName")}
          placeholder="Enter Paper Mill Name"
        />

        <TextBox
          label="Contact Number"
          required
          {...register("contactNo")}
          placeholder="Enter 10-digit mobile number"
        />

        <TextBox
          label="Email ID"
          required
          {...register("emailId")}
          placeholder="Enter corporate email address"
        />

        <TextBox
          label="Address"
          required
          {...register("address")}
          placeholder="Enter registered factory/office address"
        />
      </InputPanel>

      <FormDivider title="Agreement & Commercial Parameters" />

      {/* Row 2: Commercial & Agreement Info */}
      <InputPanel orientation="horizontal">
        <DropDownList
          label="Agreement Year"
          required
          data={academicYearOptions}
          {...register("academicYear")}
          textField="label"
          optionValue="value"
        />

        <NumberBox
          label="Approved Quantity"
          subLabel="(in Ton)"
          required
          maxFractionDigits={3}
          {...register("approvedTon")}
          placeholder="e.g. 500"
        />

        <NumberBox
          label="Rate per MT"
          subLabel="(in ₹)"
          required
          maxFractionDigits={2}
          {...register("ratePerMt")}
          placeholder="e.g. 50000"
        />

        <NumberBox
          label="Security Deposit"
          subLabel="(in ₹)"
          required
          maxFractionDigits={2}
          {...register("securityDeposit")}
          placeholder="e.g. 500000"
        />
      </InputPanel>

      <FormDivider title="Agreement Soft Copy Document" />

      <InputPanel orientation="horizontal">
        <div className="w-full">
          <FileUpload
            name="agreementDocUrl"
            control={control}
            label="Upload Agreement PDF / Soft Copy"
            accept=".pdf,.doc,.docx"
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
