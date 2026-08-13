import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import GsmForm from "../components/GsmForm";
import { useGsmQuery, useUpdateGsmMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.GsmItem;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useGsmQuery(data.gsmId);
  const { mutateAsync, isPending } = useUpdateGsmMutation(data.gsmId);

  async function handleSubmit(form: Master.GsmForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("GSM specification updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update GSM specification");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <GsmForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
