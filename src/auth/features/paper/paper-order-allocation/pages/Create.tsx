import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import PaperOrderForm from "../components/PaperOrderForm";
import { useCreatePaperOrderMutation } from "../queries";

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync: createOrder, isPending } = useCreatePaperOrderMutation();

  const handleCancel = () => {
    navigate("/paper/paper-order-allocation");
  };

  const handleSubmit = async (data: PaperOrder.PaperSupplyOrderForm) => {
    try {
      await createOrder(data);
      ToastService.success(
        `Paper Order "${data.orderNo}" created successfully!`,
      );
      navigate("/paper/paper-order-allocation");
    } catch {
      ToastService.error("Failed to create Paper Order.");
    }
  };

  return (
    <Page
      header="Create Paper Order Details"
      subHeader="Issue binding purchase work order to paper mill vendor and set supply allocation parameters."
      showHeaderActions
    >
      <Card>
        <PaperOrderForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          onCancel={handleCancel}
        />
      </Card>
    </Page>
  );
}
