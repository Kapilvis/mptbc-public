import { ToastService } from "services";
import UserRoleForm from "../components/UserRoleForm";
import { useCreateUserRoleMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateUserRoleMutation();

  async function handleSubmit(form: UserManagement.UserRoleForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Role created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create role");
    }
  }

  return <UserRoleForm onSubmit={handleSubmit} isSaving={isPending} />;
}
