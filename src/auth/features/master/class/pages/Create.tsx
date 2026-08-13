import { ToastService } from "services";
import ClassForm from "../components/ClassForm";
import { useCreateClassMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateClassMutation();

  async function handleSubmit(form: Master.ClassForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Class created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create class");
    }
  }

  return <ClassForm onSubmit={handleSubmit} isSaving={isPending} />;
}
