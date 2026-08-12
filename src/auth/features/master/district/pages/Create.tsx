import { ToastService } from "services";
import DistrictForm from "../components/DistrictForm";
import { useCreateDistrictMutation } from "../queries";

export default function Create({ onSave }: { onSave: () => void }) {
  const { mutateAsync, isPending } = useCreateDistrictMutation();

  async function handleSubmit(form: Master.DistrictForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("District created successfully");
        onSave();
      }
    } catch {
      ToastService.error(
        "An unexpected error occurred while creating district",
      );
    }
  }

  return <DistrictForm onSubmit={handleSubmit} isSaving={isPending} />;
}
