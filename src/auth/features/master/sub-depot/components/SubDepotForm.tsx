import { TextBox, CheckBox, DropDownList } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { Button, ButtonPanel } from "shared/components/buttons";
import { useSubDepotForm } from "./form.hook";
import { getSubDepots, depotOptions } from "../data";

interface SubDepotFormProps {
  onSubmit: (data: Master.SubDepotForm) => Promise<void>;
  fetchData?: Master.SubDepot;
  isSaving?: boolean;
  isEditMode?: boolean;
  onCancel: () => void;
}

export default function SubDepotForm({
  onSubmit,
  fetchData,
  isSaving,
  isEditMode = false,
  onCancel,
}: SubDepotFormProps) {
  const { handleSubmit, control, setError } = useSubDepotForm(async (data) => {
    const subDepots = getSubDepots();
    const isDuplicate = subDepots.some(
      (sd) =>
        sd.depotId === Number(data.depotId) &&
        sd.name.trim().toUpperCase() === data.name.trim().toUpperCase() &&
        sd.subDepotId !== fetchData?.subDepotId,
    );
    if (isDuplicate) {
      setError("name", {
        type: "manual",
        message: "Combination of Depot + Sub Depot Name must be unique",
      });
      return;
    }
    await onSubmit(data);
  }, fetchData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputPanel orientation="horizontal">
        <DropDownList
          data={depotOptions}
          textField="label"
          optionValue="value"
          name="depotId"
          control={control}
          label="Depot"
          required
          placeholder="Select Depot"
        />
        <TextBox
          label="Sub Depot Name"
          required
          name="name"
          control={control}
          placeholder="Enter Sub Depot Name"
        />
        <TextBox
          label="Code"
          name="code"
          control={control}
          placeholder="Enter Sub Depot Code"
          maxLength={10}
        />
        {isEditMode && (
          <CheckBox label="Active" name="isActive" control={control} />
        )}
      </InputPanel>

      <ButtonPanel>
        <Button
          label={isEditMode ? "Update" : "Save"}
          type="submit"
          icon="save"
          variant="primary"
          isLoading={isSaving}
          className="font-bold text-xs"
        />
        <Button
          type="button"
          label="Cancel"
          icon="times"
          variant="outlined"
          onClick={onCancel}
          className="font-bold text-xs"
        />
      </ButtonPanel>
    </form>
  );
}
