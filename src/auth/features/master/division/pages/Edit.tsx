import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import DivisionForm from "../components/DivisionForm";
import { useDivisionQuery, useUpdateDivisionMutation } from "../queries";

interface EditProps {
  onSave: () => void;
  data: Master.DivisionItem;
}

export default function Edit({ onSave, data: listItem }: EditProps) {
  const divisionId = listItem.divisionId;
  const { data, isLoading } = useDivisionQuery(divisionId);
  const { mutateAsync, isPending } = useUpdateDivisionMutation(divisionId);

  if (isLoading) return <Loader />;

  const handleSubmit = async (form: Master.DivisionForm) => {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Division updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update division");
    }
  };

  return (
    <DivisionForm
      fetchData={data}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
