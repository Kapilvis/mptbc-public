import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import QualificationSubjectForm from "../components/QualificationSubjectForm";
import {
  useQualificationSubjectQuery,
  useUpdateQualificationSubjectMutation,
} from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.QualificationSubjectList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useQualificationSubjectQuery(
    data.qualificationSubjectId,
  );
  const { mutateAsync, isPending } = useUpdateQualificationSubjectMutation(
    data.qualificationSubjectId,
  );

  async function handleSubmit(form: Master.QualificationSubjectForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Qualification subject updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update qualification subject");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <QualificationSubjectForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
