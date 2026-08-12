import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import OfficeLevelForm from "../components/OfficeLevelForm";
import { useOfficeLevelQuery, useUpdateOfficeLevelMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.OfficeLevelList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useOfficeLevelQuery(
    data.officeLevelId,
  );
  const { mutateAsync, isPending } = useUpdateOfficeLevelMutation(
    data.officeLevelId,
  );

  async function handleSubmit(form: Master.OfficeLevelForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Office level updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update office level");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <OfficeLevelForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
