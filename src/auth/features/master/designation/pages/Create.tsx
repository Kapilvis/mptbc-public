import { ToastService } from "services";
import DesignationForm from "../components/DesignationForm";
import { useCreateDesignationMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateDesignationMutation();

  async function handleSubmit(form: Master.DesignationForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Designation created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create designation");
    }
  }

  return <DesignationForm onSubmit={handleSubmit} isSaving={isPending} />;
}
