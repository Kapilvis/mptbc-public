import { ToastService } from "services";
import BlockForm from "../components/BlockForm";
import { useCreateBlockMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateBlockMutation();

  async function handleSubmit(form: Master.BlockForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Block created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create block");
    }
  }

  return <BlockForm onSubmit={handleSubmit} isSaving={isPending} />;
}
