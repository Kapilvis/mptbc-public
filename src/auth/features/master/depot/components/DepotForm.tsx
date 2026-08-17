import { TextBox, CheckBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { Button, ButtonPanel } from "shared/components/buttons";
import { useDepotForm } from "./form.hook";
import { getDepots } from "../data";

interface DepotFormProps {
  onSubmit: (data: Master.DepotForm) => Promise<void>;
  fetchData?: Master.Depot;
  isSaving?: boolean;
  isEditMode?: boolean;
  onCancel: () => void;
}

export default function DepotForm({
  onSubmit,
  fetchData,
  isSaving,
  isEditMode = false,
  onCancel,
}: DepotFormProps) {
  const { handleSubmit, control, setError } = useDepotForm(async (data) => {
    const depots = getDepots();
    const isDuplicate = depots.some(
      (d) =>
        d.name.trim().toUpperCase() === data.name.trim().toUpperCase() &&
        d.depotId !== fetchData?.depotId,
    );
    if (isDuplicate) {
      setError("name", {
        type: "manual",
        message: "Depot Name already exists",
      });
      return;
    }
    await onSubmit(data);
  }, fetchData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputPanel orientation="horizontal">
        <TextBox
          label="Depot Name"
          required
          name="name"
          control={control}
          placeholder="Enter Depot Name"
        />
        <TextBox
          label="Code"
          name="code"
          control={control}
          placeholder="Enter Depot Code"
          maxLength={10}
        />
        {isEditMode && (
          <div className="flex items-center h-full pt-4">
            <CheckBox label="Active" name="isActive" control={control} />
          </div>
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
