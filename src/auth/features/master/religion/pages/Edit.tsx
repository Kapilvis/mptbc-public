import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import ReligionForm from "../components/ReligionForm";
import { useReligionQuery, useUpdateReligionMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.ReligionItem;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useReligionQuery(data.religionId);
  const { mutateAsync, isPending } = useUpdateReligionMutation(data.religionId);

  async function handleSubmit(form: Master.ReligionForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Religion updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update religion");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <ReligionForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
