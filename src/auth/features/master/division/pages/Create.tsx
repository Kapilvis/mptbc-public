import { ToastService } from "services";
import DivisionForm from "../components/DivisionForm";
import { useCreateDivisionMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateDivisionMutation();

  async function handleSubmit(form: Master.DivisionForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Division created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create division");
    }
  }

  return <DivisionForm onSubmit={handleSubmit} isSaving={isPending} />;
}
