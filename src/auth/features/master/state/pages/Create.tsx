import { ToastService } from "services";
import StateForm from "../components/StateForm";
import { useCreateStateMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateStateMutation();

  async function handleSubmit(form: Master.StateForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("State created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create state");
    }
  }

  return <StateForm onSubmit={handleSubmit} isSaving={isPending} />;
}
