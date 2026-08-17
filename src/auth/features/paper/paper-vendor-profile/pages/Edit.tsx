import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import PaperVendorForm from "../components/PaperVendorForm";
import {
  usePaperVendorByIdQuery,
  useUpdatePaperVendorMutation,
} from "../queries";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const vendorId = Number(id);
  const navigate = useNavigate();

  const { data: vendor, isLoading } = usePaperVendorByIdQuery(vendorId);
  const { mutateAsync: updateVendor, isPending } =
    useUpdatePaperVendorMutation();

  const handleCancel = () => {
    navigate("/paper/paper-vendor-profile");
  };

  const handleSubmit = async (data: PaperVendor.VendorForm) => {
    try {
      await updateVendor({ id: vendorId, form: data });
      ToastService.success(
        `Paper Vendor "${data.paperMillName}" updated successfully!`,
      );
      navigate("/paper/paper-vendor-profile");
    } catch {
      ToastService.error("Failed to update Paper Vendor.");
    }
  };

  if (isLoading) {
    return (
      <Page header="Edit Paper Vendor Details">
        Loading paper vendor profile details...
      </Page>
    );
  }

  if (!vendor) {
    return (
      <Page header="Edit Paper Vendor Details">
        <div className="p-8 text-center text-red-600 font-bold">
          Paper Vendor record not found.
        </div>
      </Page>
    );
  }

  const formDataFunc: Forms.FetchDataFunc<
    PaperVendor.VendorForm
  > = async () => ({
    vendorName: vendor.vendorName,
    paperMillName: vendor.paperMillName,
    address: vendor.address,
    contactNo: vendor.contactNo,
    emailId: vendor.emailId,
    academicYear: vendor.academicYear,
    approvedTon: vendor.approvedTon,
    suppliedTon: vendor.suppliedTon,
    ratePerMt: vendor.ratePerMt,
    securityDeposit: vendor.securityDeposit,
    agreementDocUrl: vendor.agreementDocUrl || "",
  });

  return (
    <Page
      header="Edit Paper Vendor Details"
      subHeader="Update paper mill vendor information, agreement parameters, and commercial details."
      showHeaderActions
    >
      <Card>
        <PaperVendorForm
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
