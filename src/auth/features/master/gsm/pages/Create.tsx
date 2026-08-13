import { ToastService } from "services";
import GsmForm from "../components/GsmForm";
import { useCreateGsmMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateGsmMutation();

  async function handleSubmit(form: Master.GsmForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("GSM specification created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create GSM specification");
    }
  }

  return <GsmForm onSubmit={handleSubmit} isSaving={isPending} />;
}
