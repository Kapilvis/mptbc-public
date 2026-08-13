import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import CasteForm from "../components/CasteForm";
import { useCasteQuery, useUpdateCasteMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.CasteList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useCasteQuery(data.casteId);
  const { mutateAsync, isPending } = useUpdateCasteMutation(data.casteId);

  async function handleSubmit(form: Master.CasteForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Caste updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update caste");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <CasteForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
