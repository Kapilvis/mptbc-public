import { ToastService } from "services";
import QualificationSubjectForm from "../components/QualificationSubjectForm";
import { useCreateQualificationSubjectMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateQualificationSubjectMutation();

  async function handleSubmit(form: Master.QualificationSubjectForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Qualification subject created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create qualification subject");
    }
  }

  return (
    <QualificationSubjectForm onSubmit={handleSubmit} isSaving={isPending} />
  );
}
