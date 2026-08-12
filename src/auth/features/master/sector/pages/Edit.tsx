import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import SectorForm from "../components/SectorForm";
import { useSectorQuery, useUpdateSectorMutation } from "../queries";

interface EditProps {
  onSave: () => void;
  data: Master.SectorItem;
}

export default function Edit({ onSave, data: listItem }: EditProps) {
  const sectorId = listItem.sectorId;

  const { data, isLoading } = useSectorQuery(sectorId);
  const { mutateAsync, isPending } = useUpdateSectorMutation(sectorId);

  if (isLoading) return <Loader />;

  const handleSubmit = async (form: Master.SectorForm) => {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Sector updated successfully");
        onSave();
      }
    } catch {
      ToastService.error("An unexpected error occurred while updating sector");
    }
  };

  return (
    <SectorForm
      fetchData={data}
      isSaving={isPending}
      onSubmit={handleSubmit}
      isEditMode
    />
  );
}
