import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import DesignationForm from "../components/DesignationForm";
import { useDesignationsQuery, useUpdateDesignationMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.DesignationList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useDesignationsQuery(
    data.designationId,
  );
  const { mutateAsync, isPending } = useUpdateDesignationMutation(
    data.designationId,
  );

  async function handleSubmit(form: Master.DesignationForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Designation updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update designation");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <DesignationForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
