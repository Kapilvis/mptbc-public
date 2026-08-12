import { ToastService } from "services";
import OfficeTypeForm from "../components/OfficeTypeForm";
import { useCreateOfficeTypeMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateOfficeTypeMutation();

  async function handleSubmit(form: Master.OfficeTypeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Office type created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create office type");
    }
  }

  return <OfficeTypeForm onSubmit={handleSubmit} isSaving={isPending} />;
}
