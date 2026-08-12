import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import UserForm from "../components/UserForm";
import { useUpdateUserMutation, useUserQuery } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: UserManagement.UserList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useUserQuery(data.id);
  const { mutateAsync, isPending } = useUpdateUserMutation(data.id);

  async function handleSubmit(form: UserManagement.UserForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("User updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update user");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <UserForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
