import { ToastService } from "services";
import QualificationForm from "../components/QualificationForm";
import { useCreateQualificationMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateQualificationMutation();

  async function handleSubmit(form: Master.QualificationForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Qualification created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create qualification");
    }
  }

  return <QualificationForm onSubmit={handleSubmit} isSaving={isPending} />;
}
