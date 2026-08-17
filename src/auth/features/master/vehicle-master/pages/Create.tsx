import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import VehicleForm from "../components/VehicleForm";
import { useCreateVehicleMutation } from "../queries";

export default function Create() {
  const { mutateAsync, isPending } = useCreateVehicleMutation();
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  async function handleSubmit(form: Transportation.Vehicle) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Vehicle registered successfully!");
        navigate("/master/vehicle-master");
      }
    } catch {
      ToastService.error(
        "An unexpected error occurred while registering vehicle",
      );
    }
  }

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/master/vehicle-master")}
    />
  );

  return (
    <Page
      header="Register Vehicle"
      subHeader="Enter structural identifiers and registration details for dispatch check."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6">
        <VehicleForm onSubmit={handleSubmit} isSaving={isPending} />
      </Card>
    </Page>
  );
}
