import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import NationalityForm from "../components/NationalityForm";
import { useNationalityQuery, useUpdateNationalityMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.NationalityItem;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useNationalityQuery(
    data.nationalityId,
  );
  const { mutateAsync, isPending } = useUpdateNationalityMutation(
    data.nationalityId,
  );

  async function handleSubmit(form: Master.NationalityForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Nationality updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update nationality");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <NationalityForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
