import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import PaperOrderForm from "../components/PaperOrderForm";
import {
  usePaperOrderByIdQuery,
  useUpdatePaperOrderMutation,
} from "../queries";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const navigate = useNavigate();

  const { data: order, isLoading } = usePaperOrderByIdQuery(orderId);
  const { mutateAsync: updateOrder, isPending } = useUpdatePaperOrderMutation();

  const handleCancel = () => {
    navigate("/paper/paper-order-allocation");
  };

  const handleSubmit = async (data: PaperOrder.PaperSupplyOrderForm) => {
    try {
      await updateOrder({ id: orderId, form: data });
      ToastService.success(
        `Paper Order "${data.orderNo}" updated successfully!`,
      );
      navigate("/paper/paper-order-allocation");
    } catch {
      ToastService.error("Failed to update Paper Order.");
    }
  };

  if (isLoading) {
    return (
      <Page header="Edit Paper Order Details">
        Loading paper order details...
      </Page>
    );
  }

  if (!order) {
    return (
      <Page header="Edit Paper Order Details">
        <div className="p-8 text-center text-red-600 font-bold">
          Paper Order record not found.
        </div>
      </Page>
    );
  }

  const formDataFunc: Forms.FetchDataFunc<
    PaperOrder.PaperSupplyOrderForm
  > = async () => ({
    orderNo: order.orderNo,
    orderDate: order.orderDate,
    vendorId: order.vendorId,
    vendorName: order.vendorName,
    paperMillName: order.paperMillName,
    paperTypeId: order.paperTypeId,
    paperType: order.paperType,
    orderedQtyMT: order.orderedQtyMT,
    ratePerMT: order.ratePerMT,
    basicAmount: order.basicAmount,
    gstPercent: order.gstPercent,
    totalAmount: order.totalAmount,
    deliveryLocation: order.deliveryLocation,
    deliveryDate: order.deliveryDate,
    millBillNo: order.millBillNo || "",
    billDate: order.billDate || "",
    billCopyPath: order.billCopyPath || "",
  });

  return (
    <Page
      header="Edit Paper Order Details"
      subHeader="Update paper mill purchase order quantity, rates, delivery schedule, or bill attachments."
      showHeaderActions
    >
      <Card>
        <PaperOrderForm
          isEditMode
          fetchData={formDataFunc}
          onSubmit={handleSubmit}
          isSaving={isPending}
          onCancel={handleCancel}
        />
      </Card>
    </Page>
  );
}
