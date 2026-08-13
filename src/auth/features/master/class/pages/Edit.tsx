import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import ClassForm from "../components/ClassForm";
import { useClassQuery, useUpdateClassMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.ClassItem;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useClassQuery(data.classId);
  const { mutateAsync, isPending } = useUpdateClassMutation(data.classId);

  async function handleSubmit(form: Master.ClassForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Class updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update class");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <ClassForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
