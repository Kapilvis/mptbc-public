import { Button, ButtonPanel } from "shared/components/buttons";
import { NumberBox, TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useGsmForm } from "./form.hook";
import { getGsms } from "../api";

interface Props {
  onSubmit: (data: Master.GsmForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.GsmForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export default function GsmForm(props: Props) {
  const { register, handleSubmit, reset, setError } = useGsmForm(
    async (data) => {
      // Perform duplicate check: combination of GSM + Reel Width + Cutoff + Sheet Size
      const list = await getGsms();
      const isDuplicate = list.some(
        (item) =>
          item.gsm === Number(data.gsm) &&
          item.reelWidth === Number(data.reelWidth) &&
          item.cutoff === Number(data.cutoff) &&
          item.sheetSize.trim().toLowerCase() ===
            data.sheetSize.trim().toLowerCase() &&
          (!props.isEditMode ||
            item.gsmId !==
              (props.fetchData as unknown as Master.GsmItem)?.gsmId),
      );

      if (isDuplicate) {
        const errorMsg =
          "Duplicate record: Combination of GSM, Reel Width, Cutoff, and Sheet Size already exists.";
        setError("gsm", { type: "manual", message: errorMsg });
        setError("reelWidth", { type: "manual", message: errorMsg });
        setError("cutoff", { type: "manual", message: errorMsg });
        setError("sheetSize", { type: "manual", message: errorMsg });
        return;
      }

      await props.onSubmit(data);
    },
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputPanel orientation="horizontal">
        <NumberBox
          label="GSM"
          required
          {...register("gsm")}
          placeholder="Enter GSM (e.g., 80)"
        />
        <NumberBox
          label="Reel Width"
          required
          maxFractionDigits={2}
          {...register("reelWidth")}
          placeholder="Enter Reel Width (e.g., 84)"
        />
        <NumberBox
          label="Cutoff"
          required
          {...register("cutoff")}
          placeholder="Enter Cutoff (e.g., 578)"
        />
        <TextBox
          label="Sheet Size"
          required
          {...register("sheetSize")}
          placeholder="Enter Sheet Size (e.g., 57.8 × 84)"
        />
        <NumberBox
          label="Area"
          required
          maxFractionDigits={5}
          {...register("area")}
          placeholder="Enter Area (e.g., 0.48552)"
        />
        <NumberBox
          label="Sheet Weight in GM"
          required
          maxFractionDigits={4}
          {...register("sheetWeightInGM")}
          placeholder="Enter Sheet Weight in GM (e.g., 38.8416)"
        />
        <NumberBox
          label="Ream Weight in KG"
          required
          maxFractionDigits={4}
          {...register("reamWeightInKG")}
          placeholder="Enter Ream Weight in KG (e.g., 19.4208)"
        />
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
            className="p-button-secondary"
            onClick={props.onCancel}
            disabled={props.isSaving}
          />
        )}
      </ButtonPanel>
    </form>
  );
}
