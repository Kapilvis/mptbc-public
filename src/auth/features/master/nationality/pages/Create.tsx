import { ToastService } from "services";
import NationalityForm from "../components/NationalityForm";
import { useCreateNationalityMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateNationalityMutation();

  async function handleSubmit(form: Master.NationalityForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Nationality created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create nationality");
    }
  }

  return <NationalityForm onSubmit={handleSubmit} isSaving={isPending} />;
}
