import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import PaperDispatchForm from "../components/PaperDispatchForm";
import { useCreatePaperDispatchMutation } from "../queries";

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync: createDispatch, isPending } =
    useCreatePaperDispatchMutation();

  const handleCancel = () => {
    navigate("/paper/paper-supply-dispatch");
  };

  const handleSubmit = async (data: PaperSupplyDispatch.PaperDispatchForm) => {
    try {
      await createDispatch(data);
      ToastService.success(
        `Paper Dispatch "${data.challanNo}" created successfully!`,
      );
      navigate("/paper/paper-supply-dispatch");
    } catch {
      ToastService.error("Failed to create Paper Dispatch.");
    }
  };

  return (
    <Page
      header="Create Paper Supply & Dispatch Details"
      subHeader="Generate delivery challan for paper reels dispatched to Central Depot or Printers."
      showHeaderActions
    >
      <Card>
        <PaperDispatchForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          onCancel={handleCancel}
        />
      </Card>
    </Page>
  );
}
