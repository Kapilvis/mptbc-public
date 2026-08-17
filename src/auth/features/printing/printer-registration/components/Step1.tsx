import type { Control } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import {
  TextBox,
  DropDownList as SelectBox,
  FileUpload,
} from "shared/components/forms";
import { printerCategories } from "../data";

interface Step1Props {
  control: Control<Printer.RegistrationForm>;
}

export default function Step1({ control }: Step1Props) {
  return (
    <InputPanel
      title="Printer & Authorized Person Details"
      description="Basic details of the printing press and the authorized representative."
      icon="building"
      orientation="horizontal"
    >
      <TextBox
        label="Printer / Press Name"
        name="printerName"
        control={control}
        required
        placeholder="e.g. M/s Ajanta Packaging"
      />
      <TextBox
        label="Firm Registration Number"
        name="firmRegistrationNo"
        control={control}
        required
        placeholder="Enter Registration No."
      />
      <SelectBox
        label="Printer Category / Type"
        name="printerType"
        control={control}
        required
        data={printerCategories}
        optionValue="id"
        textField="text"
        defaultOptionText="Select category"
      />
      <TextBox
        label="GSTIN Number"
        name="gstinNo"
        control={control}
        required
        placeholder="15-character GSTIN"
        maxLength={15}
      />
      <TextBox
        label="PAN Number"
        name="panNo"
        control={control}
        required
        placeholder="10-character PAN"
        maxLength={10}
      />
      <TextBox
        label="Firm Owner Name"
        name="ownerName"
        control={control}
        required
        placeholder="Enter owner's full name"
      />
      <TextBox
        label="Authorized Person Name"
        name="authPersonName"
        control={control}
        required
        placeholder="Enter full name"
      />
      <TextBox
        label="Designation / Role"
        name="designation"
        control={control}
        required
        placeholder="e.g. Managing Director"
      />
      <TextBox
        label="Mobile Number"
        name="mobileNo"
        control={control}
        required
        placeholder="10-digit mobile number"
        maxLength={10}
        keyfilter="pnum"
      />
      <TextBox
        label="Email Address"
        name="email"
        control={control}
        required
        placeholder="representative@domain.com"
      />
      <div className="md:col-span-2">
        <FileUpload
          label="License / Registration Certificate Upload"
          name="licenseCertificateUrl"
          control={control}
          required
        />
      </div>
    </InputPanel>
  );
}
