import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import PaperVendorForm from "../components/PaperVendorForm";
import { useCreatePaperVendorMutation } from "../queries";

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync: createVendor, isPending } =
    useCreatePaperVendorMutation();

  const handleCancel = () => {
    navigate("/paper/paper-vendor-profile");
  };

  const handleSubmit = async (data: PaperVendor.VendorForm) => {
    try {
      await createVendor(data);
      ToastService.success(
        `Paper Vendor "${data.paperMillName}" created successfully!`,
      );
      navigate("/paper/paper-vendor-profile");
    } catch {
      ToastService.error("Failed to create Paper Vendor.");
    }
  };

  return (
    <Page
      header="Create Paper Vendor Details"
      subHeader="Enter paper mill vendor information, agreement parameters, and commercial details."
      showHeaderActions
    >
      <Card>
        <PaperVendorForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          onCancel={handleCancel}
        />
      </Card>
    </Page>
  );
}
