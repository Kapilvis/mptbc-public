import { ToastService } from "services";
import ProjectForm from "../components/ProjectForm";
import { useCreateProjectMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateProjectMutation();

  async function handleSubmit(form: Master.ProjectForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Project created successfully");
        onSave();
      }
    } catch {
      ToastService.error("An unexpected error occurred while creating project");
    }
  }

  return <ProjectForm onSubmit={handleSubmit} isSaving={isPending} />;
}
