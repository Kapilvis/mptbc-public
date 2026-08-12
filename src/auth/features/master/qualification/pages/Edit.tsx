import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import QualificationForm from "../components/QualificationForm";
import {
  useQualificationsQuery,
  useUpdateQualificationMutation,
} from "../queries";

export default function Edit({
  data,
  onSave,
}: {
  data: Master.QualificationList;
  onSave: () => void;
}) {
  const { data: fetchData, isLoading } = useQualificationsQuery(
    data.qualificationId,
  );
  const { mutateAsync, isPending } = useUpdateQualificationMutation(
    data.qualificationId,
  );

  async function handleSubmit(form: Master.QualificationForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Qualification updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update qualification");
    }
  }

  if (isLoading) return <Loader type="relative" />;

  return (
    <QualificationForm
      fetchData={fetchData}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
