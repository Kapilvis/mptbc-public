import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import VehicleForm from "../components/VehicleForm";
import { useVehicleQuery, useUpdateVehicleMutation } from "../queries";

export default function Edit() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const { data: vehicle, isLoading } = useVehicleQuery(
    Number(vehicleId),
    !!vehicleId,
  );

  const { mutateAsync: updateVehicle, isPending } = useUpdateVehicleMutation(
    Number(vehicleId),
  );

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  if (isLoading) return <Loader />;

  async function handleSubmit(form: Transportation.Vehicle) {
    try {
      const result = await updateVehicle(form);
      if (result) {
        ToastService.success("Vehicle details updated successfully");
        navigate("/master/vehicle-master");
      }
    } catch {
      ToastService.error(
        "An unexpected error occurred while updating vehicle details",
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

  const fetchVehicleData = async () => {
    return vehicle as Transportation.Vehicle;
  };

  return (
    <Page
      header="Edit Vehicle Details"
      subHeader={`Update registration details for ${vehicle?.registrationNo || ""}`}
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6">
        {vehicle ? (
          <VehicleForm
            onSubmit={handleSubmit}
            fetchData={fetchVehicleData}
            isSaving={isPending}
            isEditMode
          />
        ) : (
          <div className="text-center p-6 text-rose-500 font-bold">
            Vehicle not found
          </div>
        )}
      </Card>
    </Page>
  );
}
