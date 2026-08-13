import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import BookTypeForm from "../components/BookTypeForm";
import { useBookTypeQuery, useUpdateBookTypeMutation } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.BookTypeItem;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useBookTypeQuery(data.bookTypeId);
  const { mutateAsync, isPending } = useUpdateBookTypeMutation(data.bookTypeId);

  async function handleSubmit(form: Master.BookTypeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Book Type updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update book type");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <BookTypeForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
