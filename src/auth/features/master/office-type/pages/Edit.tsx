import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import OfficeTypeForm from "../components/OfficeTypeForm";
import { useOfficeTypeQuery, useUpdateOfficeTypeMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.OfficeTypeList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useOfficeTypeQuery(data.officeTypeId);
  const { mutateAsync, isPending } = useUpdateOfficeTypeMutation(
    data.officeTypeId,
  );

  async function handleSubmit(form: Master.OfficeTypeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Office type updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update office type");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <OfficeTypeForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
