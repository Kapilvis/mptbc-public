import { ToastService } from "services";
import BookTypeForm from "../components/BookTypeForm";
import { useCreateBookTypeMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateBookTypeMutation();

  async function handleSubmit(form: Master.BookTypeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Book Type created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create book type");
    }
  }

  return <BookTypeForm onSubmit={handleSubmit} isSaving={isPending} />;
}
