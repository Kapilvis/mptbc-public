import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import StateForm from "../components/StateForm";
import { useStateQuery, useUpdateStateMutation } from "../queries";

interface EditProps {
  onSave: () => void;
  data: Master.StateItem;
}

export default function Edit({ onSave, data: listItem }: EditProps) {
  const stateId = listItem.stateId;

  const { data, isLoading } = useStateQuery(stateId);
  const { mutateAsync, isPending } = useUpdateStateMutation(stateId);

  if (isLoading) return <Loader />;

  const handleSubmit = async (form: Master.StateForm) => {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("State updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("Failed to update state");
    }
  };

  return (
    <StateForm
      fetchData={data}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
