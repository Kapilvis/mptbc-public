import { ToastService } from "services";
import UserAssignmentForm from "../components/UserAssignmentForm";
import { useCreateUserAssignmentMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateUserAssignmentMutation();

  async function handleSubmit(form: UserManagement.UserAssignmentForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("User assigned successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to assign user");
    }
  }

  return <UserAssignmentForm onSubmit={handleSubmit} isSaving={isPending} />;
}
