import type { Control } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import { TextBox, DropDownList as SelectBox } from "shared/components/forms";
import { vehicleCategories, fuelTypes } from "../data";
import { useTransportersQuery } from "../../transporter-registration/queries";

interface Step1Props {
  control: Control<Transportation.VehicleForm>;
}

export default function Step1({ control }: Step1Props) {
  const { data: transporters = [] } = useTransportersQuery();

  return (
    <InputPanel
      title="Vehicle Core details"
      description="Select the transporter owner, vehicle capacity, category, and model details."
      icon="truck"
      orientation="horizontal"
      className="grid-3"
    >
      <SelectBox
        label="Owner Transporter"
        name="transporterId"
        required
        control={control}
        data={transporters}
        optionValue="transporterId"
        textField="transporterName"
      />
      <TextBox
        label="Registration Number"
        name="registrationNo"
        control={control}
        required
        placeholder="e.g. MP-09-AB-1234"
      />
      <SelectBox
        label="Vehicle Category"
        name="category"
        required
        control={control}
        data={vehicleCategories}
        optionValue="value"
        textField="text"
      />
      <TextBox
        label="Capacity (Tons)"
        name="capacity"
        control={control}
        required
        placeholder="e.g. 10.5"
      />
      <TextBox
        label="Vehicle Model"
        name="model"
        control={control}
        required
        placeholder="e.g. Tata Prima 2825"
      />
      <TextBox
        label="Manufacturer"
        name="manufacturer"
        control={control}
        required
        placeholder="e.g. Tata Motors"
      />
      <TextBox
        label="Manufacturing Year"
        name="manufacturingYear"
        control={control}
        required
        placeholder="e.g. 2023"
      />
      <SelectBox
        label="Fuel Type"
        name="fuelType"
        required
        control={control}
        data={fuelTypes}
        optionValue="text"
        textField="text"
      />
    </InputPanel>
  );
}
