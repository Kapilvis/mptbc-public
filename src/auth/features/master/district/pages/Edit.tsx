import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import DistrictForm from "../components/DistrictForm";
import { useDistrictQuery, useUpdateDistrictMutation } from "../queries";

interface EditProps {
  onSave: () => void;
  data: Master.DistrictItem;
}

export default function Edit({ onSave, data: listItem }: EditProps) {
  const districtId = listItem.districtId;

  const { data, isLoading } = useDistrictQuery(districtId);
  const { mutateAsync, isPending } = useUpdateDistrictMutation(districtId);

  if (isLoading) return <Loader />;

  const handleSubmit = async (form: Master.DistrictForm) => {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("District updated successfully");
        onSave();
      }
    } catch {
      ToastService.error(
        "An unexpected error occurred while updating district",
      );
    }
  };

  return (
    <DistrictForm
      fetchData={data}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
