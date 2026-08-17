import type { Control } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import { TextBox, DropDownList as SelectBox } from "shared/components/forms";
import { states } from "../data";

interface Step2Props {
  control: Control<Printer.RegistrationForm>;
  stateId: number;
  districtId: number;
  filteredDistricts: { text: string; id: number; stateId: number }[];
  filteredCities: { text: string; id: number; districtId: number }[];
}

export default function Step2({
  control,
  stateId,
  districtId,
  filteredDistricts,
  filteredCities,
}: Step2Props) {
  return (
    <InputPanel
      title="Office / Registered Address"
      description="Physical address of the printing press establishment."
      icon="map-marker"
      orientation="horizontal"
    >
      <div className="md:col-span-2">
        <TextBox
          label="Address Line 1"
          name="addressLine1"
          control={control}
          required
          placeholder="Plot number, industrial area"
        />
      </div>
      <div className="md:col-span-2">
        <TextBox
          label="Address Line 2"
          name="addressLine2"
          control={control}
          placeholder="Landmark, road"
        />
      </div>
      <SelectBox
        label="State"
        name="stateId"
        control={control}
        required
        data={states}
        optionValue="id"
        textField="text"
        defaultOptionText="Select state"
      />
      <SelectBox
        label="District"
        name="districtId"
        control={control}
        required
        data={filteredDistricts}
        optionValue="id"
        textField="text"
        defaultOptionText="Select district"
        disabled={!stateId}
      />
      <SelectBox
        label="City / Town"
        name="cityId"
        control={control}
        required
        data={filteredCities}
        optionValue="id"
        textField="text"
        defaultOptionText="Select city/town"
        disabled={!districtId}
      />
      <TextBox
        label="PIN Code"
        name="pinCode"
        control={control}
        required
        placeholder="6-digit PIN code"
        maxLength={6}
      />
    </InputPanel>
  );
}
