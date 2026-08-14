import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import BlockForm from "../components/BlockForm";
import { useBlockQuery, useUpdateBlockMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.BlockItem;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useBlockQuery(data.blockId);
  const { mutateAsync, isPending } = useUpdateBlockMutation(data.blockId);

  async function handleSubmit(form: Master.BlockForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Block updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update block");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <BlockForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
