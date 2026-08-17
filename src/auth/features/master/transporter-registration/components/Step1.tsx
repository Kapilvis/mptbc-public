import type { Control } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import {
  TextBox,
  DropDownList as SelectBox,
  DatePicker as DateBox,
} from "shared/components/forms";
import { transporterTypes, states } from "../data";

interface Step1Props {
  control: Control<Transportation.TransporterRegistrationForm>;
  stateId?: number;
  districtId?: number;
  filteredDistricts: { text: string; id: number }[];
  filteredTehsils: { text: string; id: number }[];
}

export default function Step1({
  control,
  stateId,
  districtId,
  filteredDistricts,
  filteredTehsils,
}: Step1Props) {
  return (
    <InputPanel
      title="Profile & Company Details"
      description="Enter the core company identifiers, legal status, and address details."
      icon="building"
      orientation="horizontal"
      className="grid-3"
    >
      <SelectBox
        label="Transporter Type"
        name="transporterType"
        required
        control={control}
        data={transporterTypes}
        optionValue="text"
        textField="text"
      />
      <TextBox
        label="Transporter Name"
        name="transporterName"
        control={control}
        required
        placeholder="Enter Transporter Name"
      />
      <TextBox
        label="Firm/Company Name"
        name="firmName"
        control={control}
        required
        placeholder="Enter Registered Firm Name"
      />
      <TextBox
        label="PAN Number"
        name="panNumber"
        control={control}
        required
        placeholder="e.g. ABCDE1234F"
      />
      <TextBox
        label="GSTIN"
        name="gstin"
        control={control}
        required
        placeholder="15-character GSTIN number"
      />
      <DateBox
        label="Registration Date"
        name="registrationDate"
        control={control}
        required
        placeholder="Select Date"
      />
      <SelectBox
        label="State"
        name="stateId"
        required
        control={control}
        data={states}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="District"
        name="districtId"
        required
        control={control}
        data={filteredDistricts}
        optionValue="id"
        textField="text"
        disabled={!stateId}
      />
      <SelectBox
        label="Tehsil/Block"
        name="tehsilId"
        required
        control={control}
        data={filteredTehsils}
        optionValue="id"
        textField="text"
        disabled={!districtId}
      />
      <TextBox
        label="PIN Code"
        name="pinCode"
        control={control}
        required
        placeholder="6-digit ZIP/PIN code"
      />
    </InputPanel>
  );
}
