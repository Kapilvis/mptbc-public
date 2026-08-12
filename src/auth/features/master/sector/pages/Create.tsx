import { ToastService } from "services";
import SectorForm from "../components/SectorForm";
import { useCreateSectorMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateSectorMutation();

  async function handleSubmit(form: Master.SectorForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Sector created successfully");
        onSave();
      }
    } catch {
      ToastService.error("An unexpected error occurred while creating sector");
    }
  }

  return <SectorForm onSubmit={handleSubmit} isSaving={isPending} />;
}
