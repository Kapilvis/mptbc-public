import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import ProjectForm from "../components/ProjectForm";
import { useProjectQuery, useUpdateProjectMutation } from "../queries";

interface EditProps {
  onSave: () => void;
  data: Master.ProjectItem;
}

export default function Edit({ onSave, data: listItem }: EditProps) {
  const projectId = listItem.projectId;

  const { data, isLoading } = useProjectQuery(projectId);
  const { mutateAsync, isPending } = useUpdateProjectMutation(projectId);

  if (isLoading) return <Loader />;

  const handleSubmit = async (form: Master.ProjectForm) => {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Project updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("An unexpected error occurred while updating project");
    }
  };

  return (
    <ProjectForm
      fetchData={data}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
