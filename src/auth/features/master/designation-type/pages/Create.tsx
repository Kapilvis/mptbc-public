import { ToastService } from "services";
import DesignationTypeForm from "../components/DesignationTypeForm";
import { useCreateDesignationTypeMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateDesignationTypeMutation();

  async function handleSubmit(form: Master.DesignationTypeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Designation Type created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create designation type");
    }
  }

  return <DesignationTypeForm onSubmit={handleSubmit} isSaving={isPending} />;
}
