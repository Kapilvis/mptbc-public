import { useEffect, useMemo } from "react";
import type { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import { TextBox, DropDownList as SelectBox } from "shared/components/forms";
import {
  commercialVehicleCategories,
  vehicleSubTypes,
  manufacturersList,
  fuelTypes,
} from "../data";
import { useTransportersQuery } from "../../transporter-registration/queries";

interface Step1Props {
  control: Control<Transportation.VehicleForm>;
  watch?: UseFormWatch<Transportation.VehicleForm>;
  setValue?: UseFormSetValue<Transportation.VehicleForm>;
}

export default function Step1({ control, watch, setValue }: Step1Props) {
  const { data: transporters = [] } = useTransportersQuery();

  const selectedCategory = watch ? watch("vehicleCategory") : undefined;
  const selectedSubTypeId = watch ? watch("subType") : undefined;
  const selectedManufacturer = watch ? watch("manufacturer") : undefined;

  // Filter Sub-types based on selected Vehicle Category (SCV / LCV / MCV / HCV)
  const filteredSubTypes = useMemo(() => {
    if (!selectedCategory) return vehicleSubTypes;
    return vehicleSubTypes.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Selected sub type object
  const activeSubTypeObj = useMemo(() => {
    return vehicleSubTypes.find(
      (item) =>
        item.id === selectedSubTypeId || item.text === selectedSubTypeId,
    );
  }, [selectedSubTypeId]);

  // Models list based on Sub-type or Manufacturer
  const availableModels = useMemo(() => {
    if (activeSubTypeObj?.models) {
      return activeSubTypeObj.models.map((m) => ({ text: m, id: m }));
    }
    return [];
  }, [activeSubTypeObj]);

  // Handle auto-population on Sub-Type selection
  useEffect(() => {
    if (activeSubTypeObj && setValue) {
      // Auto-set default capacity
      if (activeSubTypeObj.defaultCapacity) {
        setValue("capacity", activeSubTypeObj.defaultCapacity, {
          shouldValidate: true,
        });
      }

      // Auto-set manufacturer
      if (activeSubTypeObj.manufacturer) {
        setValue("manufacturer", activeSubTypeObj.manufacturer, {
          shouldValidate: true,
        });
      }

      // Auto-set model default if first model exists
      if (activeSubTypeObj.models && activeSubTypeObj.models.length > 0) {
        setValue("model", activeSubTypeObj.models[0], {
          shouldValidate: true,
        });
      }

      // Auto-set Rate Slab Category based on capacity
      const cap = activeSubTypeObj.defaultCapacity || 1.0;
      if (cap < 4.5) {
        setValue("category", "Cat-1", { shouldValidate: true });
      } else if (cap <= 9.0) {
        setValue("category", "Cat-2", { shouldValidate: true });
      } else {
        setValue("category", "Cat-3", { shouldValidate: true });
      }
    }
  }, [activeSubTypeObj, setValue]);

  return (
    <InputPanel
      title="Vehicle Core details"
      description="Select the transporter owner, vehicle category, sub-type, capacity, manufacturer, and model details."
      icon="truck"
      orientation="horizontal"
      className="grid-3"
    >
      {/* 1. Owner Transporter */}
      <SelectBox
        label="Owner Transporter"
        name="transporterId"
        required
        control={control}
        data={transporters}
        optionValue="transporterId"
        textField="transporterName"
      />

      {/* 2. Registration Number */}
      <TextBox
        label="Registration Number"
        name="registrationNo"
        control={control}
        required
        placeholder="e.g. MP-09-AB-1234"
      />

      {/* 3. Vehicle Category (SCV, LCV, MCV, HCV) */}
      <SelectBox
        label="Vehicle Category"
        name="vehicleCategory"
        required
        control={control}
        data={commercialVehicleCategories}
        optionValue="value"
        textField="text"
      />

      {/* 4. Vehicle Sub-Type (e.g. Tata Ace, Tata 407, Eicher Pro 2049) */}
      <SelectBox
        label="Vehicle Sub-Type"
        name="subType"
        required
        control={control}
        data={filteredSubTypes}
        optionValue="id"
        textField="text"
      />

      {/* 5. Capacity (Metric Ton) */}
      <TextBox
        label="Capacity (Metric Ton)"
        name="capacity"
        control={control}
        required
        placeholder="e.g. 1.5, 3.5, 4.5, 9.0"
      />

      {/* 6. Manufacturer */}
      {manufacturersList.length > 0 && selectedManufacturer ? (
        <SelectBox
          label="Manufacturer"
          name="manufacturer"
          required
          control={control}
          data={manufacturersList}
          optionValue="text"
          textField="text"
        />
      ) : (
        <TextBox
          label="Manufacturer"
          name="manufacturer"
          control={control}
          required
          placeholder="e.g. Tata Motors"
        />
      )}

      {/* 7. Vehicle Model */}
      {availableModels.length > 0 ? (
        <SelectBox
          label="Vehicle Model"
          name="model"
          required
          control={control}
          data={availableModels}
          optionValue="text"
          textField="text"
        />
      ) : (
        <TextBox
          label="Vehicle Model"
          name="model"
          control={control}
          required
          placeholder="e.g. Tata 407 Gold SFC"
        />
      )}

      {/* 8. Manufacturing Year */}
      <TextBox
        label="Manufacturing Year"
        name="manufacturingYear"
        control={control}
        required
        placeholder="e.g. 2023"
      />

      {/* 9. Fuel Type */}
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
