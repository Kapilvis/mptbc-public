import { ToastService } from "services";
import UserForm from "../components/UserForm";
import { useCreateUserMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateUserMutation();

  async function handleSubmit(form: UserManagement.UserForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("User created successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to create user");
    }
  }

  return <UserForm onSubmit={handleSubmit} isSaving={isPending} />;
}
