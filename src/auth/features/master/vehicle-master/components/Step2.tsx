import type { Control, UseFormWatch } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import { TextBox, DropDownList as SelectBox } from "shared/components/forms";
import { ownershipStatuses } from "../data";

interface Step2Props {
  control: Control<Transportation.VehicleForm>;
  watch: UseFormWatch<Transportation.VehicleForm>;
}

export default function Step2({ control, watch }: Step2Props) {
  const ownership = watch("ownershipStatus");
  const isLeased = ownership === "Leased";

  return (
    <InputPanel
      title="Identifiers & Ownership Status"
      description="Enter structural chassis numbers and lease validation agreements if applicable."
      icon="cog"
      orientation="horizontal"
      className="grid-3"
    >
      <TextBox
        label="Chassis Number"
        name="chassisNo"
        control={control}
        required
        placeholder="17-character alphanumeric"
      />
      <TextBox
        label="Engine Number"
        name="engineNo"
        control={control}
        required
        placeholder="Enter Engine Number"
      />
      <SelectBox
        label="Ownership Status"
        name="ownershipStatus"
        required
        control={control}
        data={ownershipStatuses}
        optionValue="value"
        textField="text"
      />
      {isLeased && (
        <TextBox
          label="Lease Agreement (Filename)"
          name="leasedAgreementDoc"
          control={control}
          required
          placeholder="e.g. lease_agreement_signed.pdf"
        />
      )}
    </InputPanel>
  );
}
