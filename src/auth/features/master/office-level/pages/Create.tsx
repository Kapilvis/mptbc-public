import { ToastService } from "services";
import OfficeLevelForm from "../components/OfficeLevelForm";
import { useCreateOfficeLevelMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateOfficeLevelMutation();

  async function handleSubmit(form: Master.OfficeLevelForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Office level created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create office level");
    }
  }

  return <OfficeLevelForm onSubmit={handleSubmit} isSaving={isPending} />;
}
