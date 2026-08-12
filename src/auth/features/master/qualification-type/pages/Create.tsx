import { ToastService } from "services";
import QualificationTypeForm from "../components/QualificationTypeForm";
import { useCreateQualificationTypeMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateQualificationTypeMutation();

  async function handleSubmit(form: Master.QualificationTypeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Qualification Type created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create qualification type");
    }
  }

  return <QualificationTypeForm onSubmit={handleSubmit} isSaving={isPending} />;
}
