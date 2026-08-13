import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import MediumForm from "../components/MediumForm";
import { useMediumQuery, useUpdateMediumMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.MediumItem;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useMediumQuery(data.mediumId);
  const { mutateAsync, isPending } = useUpdateMediumMutation(data.mediumId);

  async function handleSubmit(form: Master.MediumForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Medium updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update medium");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <MediumForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
