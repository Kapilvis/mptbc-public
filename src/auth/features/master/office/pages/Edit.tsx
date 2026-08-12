import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import OfficeForm from "../components/OfficeForm";
import { useOfficeQuery, useUpdateOfficeMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.OfficeItem;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useOfficeQuery(data.officeId);
  const { mutateAsync, isPending } = useUpdateOfficeMutation(data.officeId);

  const handleSubmit = async (form: Master.OfficeForm) => {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Office updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update Office");
    }
  };

  if (isLoading) return <Loader type="relative" />;

  return (
    <OfficeForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
