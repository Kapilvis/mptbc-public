import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import UserRoleForm from "../components/UserRoleForm";
import { useUpdateUserRoleMutation, useUserRoleQuery } from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: UserManagement.UserRoleList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useUserRoleQuery(data.id);
  const { mutateAsync, isPending } = useUpdateUserRoleMutation(data.id);

  async function handleSubmit(form: UserManagement.UserRoleForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Role updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update role");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <UserRoleForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
