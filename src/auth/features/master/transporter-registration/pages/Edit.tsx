import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import TransporterForm from "../components/TransporterForm";
import { useTransporterQuery, useUpdateTransporterMutation } from "../queries";

export default function Edit() {
  const { transporterId } = useParams<{ transporterId: string }>();
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const { data: transporter, isLoading } = useTransporterQuery(
    Number(transporterId),
    !!transporterId,
  );

  const { mutateAsync: updateTransporter, isPending } =
    useUpdateTransporterMutation(Number(transporterId));

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  if (isLoading) return <Loader />;

  async function handleSubmit(form: Transportation.TransporterRegistration) {
    try {
      const result = await updateTransporter(form);
      if (result) {
        ToastService.success("Transporter details updated successfully");
        navigate("/master/transporter-registration");
      }
    } catch {
      ToastService.error(
        "An unexpected error occurred while updating transporter details",
      );
    }
  }

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/master/transporter-registration")}
    />
  );

  const fetchTransporterData = async () => {
    return transporter as Transportation.TransporterRegistration;
  };

  return (
    <Page
      header="Edit Transporter Details"
      subHeader={`Update registration details for ${transporter?.transporterName || ""}`}
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6">
        {transporter ? (
          <TransporterForm
            onSubmit={handleSubmit}
            fetchData={fetchTransporterData}
            isSaving={isPending}
            isEditMode
          />
        ) : (
          <div className="text-center p-6 text-rose-500 font-bold">
            Transporter not found
          </div>
        )}
      </Card>
    </Page>
  );
}
