import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import PaperDispatchForm from "../components/PaperDispatchForm";
import {
  usePaperDispatchByIdQuery,
  useUpdatePaperDispatchMutation,
} from "../queries";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const dispatchId = Number(id);
  const navigate = useNavigate();

  const { data: dispatchItem, isLoading } =
    usePaperDispatchByIdQuery(dispatchId);
  const { mutateAsync: updateDispatch, isPending } =
    useUpdatePaperDispatchMutation();

  const handleCancel = () => {
    navigate("/paper/paper-supply-dispatch");
  };

  const handleSubmit = async (data: PaperSupplyDispatch.PaperDispatchForm) => {
    try {
      await updateDispatch({ id: dispatchId, form: data });
      ToastService.success(
        `Paper Dispatch "${data.challanNo}" updated successfully!`,
      );
      navigate("/paper/paper-supply-dispatch");
    } catch {
      ToastService.error("Failed to update Paper Dispatch.");
    }
  };

  if (isLoading) {
    return (
      <Page header="Edit Paper Supply & Dispatch Details">
        Loading paper dispatch details...
      </Page>
    );
  }

  if (!dispatchItem) {
    return (
      <Page header="Edit Paper Supply & Dispatch Details">
        <div className="p-8 text-center text-red-600 font-bold">
          Paper Dispatch record not found.
        </div>
      </Page>
    );
  }

  const formDataFunc: Forms.FetchDataFunc<
    PaperSupplyDispatch.PaperDispatchForm
  > = async () => ({
    challanNo: dispatchItem.challanNo,
    challanDate: dispatchItem.challanDate,
    orderNo: dispatchItem.orderNo,
    orderDate: dispatchItem.orderDate,
    dispatchDate: dispatchItem.dispatchDate,
    vendorId: dispatchItem.vendorId,
    paperMillName: dispatchItem.paperMillName,
    paperType: dispatchItem.paperType,
    consigneeName: dispatchItem.consigneeName,
    godownName: dispatchItem.godownName,
    reelCount: dispatchItem.reelCount,
    totalWeightTon: dispatchItem.totalWeightTon,
    truckNo: dispatchItem.truckNo,
    driverName: dispatchItem.driverName,
    driverMobile: dispatchItem.driverMobile,
    grNo: dispatchItem.grNo || "",
    grDate: dispatchItem.grDate || "",
    remarks: dispatchItem.remarks || "",
    challanCopyPath: dispatchItem.challanCopyPath || "",
  });

  return (
    <Page
      header="Edit Paper Supply & Dispatch Details"
      subHeader="Update paper reel delivery challan, transport vehicle, driver details, or warehouse allocation."
      showHeaderActions
    >
      <Card>
        <PaperDispatchForm
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
