import { ToastService } from "services";
import CasteForm from "../components/CasteForm";
import { useCreateCasteMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateCasteMutation();

  async function handleSubmit(form: Master.CasteForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Caste created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create caste");
    }
  }

  return <CasteForm onSubmit={handleSubmit} isSaving={isPending} />;
}
