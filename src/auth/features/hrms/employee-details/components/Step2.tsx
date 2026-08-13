import type { Control } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import { TextBox, DropDownList as SelectBox } from "shared/components/forms";
import { nationalities, categories, religions, states } from "../data";

interface Step2Props {
  control: Control<HRMS.EmployeeRegistrationForm>;
  stateId?: number;
  districtId?: number;
  filteredDistricts: { text: string; id: number }[];
  filteredCities: { text: string; id: number }[];
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
      title="Contact & Address"
      description="Verify and populate contact channels and regional indicators."
      icon="phone"
      orientation="horizontal"
      className="grid-3"
    >
      <TextBox
        label="Mobile Number"
        name="mobileNumber"
        control={control}
        required
        placeholder="10-digit number"
      />
      <TextBox
        label="Alternate Mobile"
        name="alternateMobile"
        control={control}
        placeholder="10-digit number"
      />
      <TextBox
        label="Personal Email"
        name="personalEmail"
        control={control}
        required
        placeholder="personal@domain.com"
      />
      <TextBox
        label="Official Email"
        name="officialEmail"
        control={control}
        placeholder="official@company.com"
      />
      <TextBox
        label="Aadhaar Number"
        name="aadhaarNumber"
        control={control}
        required
        placeholder="12-digit number"
      />
      <TextBox
        label="PAN Number"
        name="panNumber"
        control={control}
        placeholder="ABCDE1234F"
      />
      <SelectBox
        label="Nationality"
        name="nationality"
        control={control}
        data={nationalities}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="Category"
        name="category"
        control={control}
        data={categories}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="Religion"
        name="religion"
        control={control}
        data={religions}
        optionValue="id"
        textField="text"
      />
      <div className="input-panel-full-width">
        <TextBox
          label="Address Line 1"
          name="addressLine1"
          control={control}
          required
          placeholder="House/Plot/Apartment No, Block"
        />
      </div>
      <div className="input-panel-full-width">
        <TextBox
          label="Address Line 2"
          name="addressLine2"
          control={control}
          placeholder="Street, Locality, Area Name"
        />
      </div>
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
        label="City"
        name="cityId"
        required
        control={control}
        data={filteredCities}
        optionValue="id"
        textField="text"
        disabled={!districtId}
      />
      <TextBox
        label="PIN Code"
        name="pinCode"
        control={control}
        required
        placeholder="6-digit ZIP/PIN Code"
      />
    </InputPanel>
  );
}
