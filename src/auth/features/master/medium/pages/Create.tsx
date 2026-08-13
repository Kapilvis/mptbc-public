import { ToastService } from "services";
import MediumForm from "../components/MediumForm";
import { useCreateMediumMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateMediumMutation();

  async function handleSubmit(form: Master.MediumForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Medium created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create medium");
    }
  }

  return <MediumForm onSubmit={handleSubmit} isSaving={isPending} />;
}
