import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import QualificationTypeForm from "../components/QualificationTypeForm";
import {
  useQualificationTypeQuery,
  useUpdateQualificationTypeMutation,
} from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.QualificationTypeList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useQualificationTypeQuery(
    data.qualificationTypeId,
  );
  const { mutateAsync, isPending } = useUpdateQualificationTypeMutation(
    data.qualificationTypeId,
  );

  async function handleSubmit(form: Master.QualificationTypeForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Qualification Type updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update qualification type");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <QualificationTypeForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
