import { ToastService } from "services";
import ReligionForm from "../components/ReligionForm";
import { useCreateReligionMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateReligionMutation();

  async function handleSubmit(form: Master.ReligionForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Religion created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create religion");
    }
  }

  return <ReligionForm onSubmit={handleSubmit} isSaving={isPending} />;
}
