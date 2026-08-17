import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import TransporterForm from "../components/TransporterForm";
import { useCreateTransporterMutation } from "../queries";

export default function Create() {
  const { mutateAsync, isPending } = useCreateTransporterMutation();
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  async function handleSubmit(form: Transportation.TransporterRegistration) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        if (result.technicalStatus === "Qualified") {
          ToastService.success(
            "Transporter registered successfully! Technical status: QUALIFIED",
          );
        } else {
          ToastService.warning(
            "Transporter registered. Technical status: NOT QUALIFIED (Turnover eligibility not met)",
          );
        }
        navigate("/master/transporter-registration");
      }
    } catch {
      ToastService.error(
        "An unexpected error occurred while registering transporter",
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

  return (
    <Page
      header="Register Transporter"
      subHeader="Enter company profile and owner details for tender evaluation."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6">
        <TransporterForm onSubmit={handleSubmit} isSaving={isPending} />
      </Card>
    </Page>
  );
}
