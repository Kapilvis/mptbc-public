import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import DesignationTypeForm from "../components/DesignationTypeForm";
import {
  useDesignationTypeQuery,
  useUpdateDesignationTypeMutation,
} from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.DesignationTypeList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useDesignationTypeQuery(
    data.designationTypeId,
  );
  const { mutateAsync, isPending } = useUpdateDesignationTypeMutation(
    data.designationTypeId,
  );

  async function handleSubmit(form: Master.DesignationTypeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Designation Type updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update designation type");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <DesignationTypeForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
