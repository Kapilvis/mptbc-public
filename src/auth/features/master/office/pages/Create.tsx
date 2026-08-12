import { ToastService } from "services";
import OfficeForm from "../components/OfficeForm";
import { useCreateOfficeMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateOfficeMutation();

  async function handleSubmit(form: Master.OfficeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Office created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create Office");
    }
  }

  return <OfficeForm onSubmit={handleSubmit} isSaving={isPending} />;
}
