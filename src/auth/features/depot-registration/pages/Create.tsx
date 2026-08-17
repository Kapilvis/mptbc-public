import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import DepotRegistrationForm from "../components/DepotRegistrationForm";
import { useCreateDepotRegistrationMutation } from "../data";

export default function Create() {
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const createMutation = useCreateDepotRegistrationMutation();

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const handleSubmit = async (form: DepotRegistration.RegistrationForm) => {
    try {
      await createMutation.mutateAsync(form);
      ToastService.success(
        "Depot registration details submitted successfully!",
      );
      navigate("/mptbc/depot-registration");
    } catch {
      ToastService.error("Failed to submit depot registration details");
    }
  };

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/mptbc/depot-registration")}
      className="font-bold text-xs border-slate-300 hover:bg-slate-50"
    />
  );

  return (
    <Page
      header="Depot Registration"
      subHeader="Register a new warehouse/depot and assign division, capacity, and manager credentials."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6 border border-slate-100 shadow-sm">
        <DepotRegistrationForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/mptbc/depot-registration")}
          isSaving={createMutation.isPending}
        />
      </Card>
    </Page>
  );
}
