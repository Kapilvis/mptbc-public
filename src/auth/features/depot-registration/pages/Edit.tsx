import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import DepotRegistrationForm from "../components/DepotRegistrationForm";
import {
  useDepotRegistrationQuery,
  useUpdateDepotRegistrationMutation,
} from "../data";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const { data: registrationData, isLoading } = useDepotRegistrationQuery(
    Number(id),
  );
  const updateMutation = useUpdateDepotRegistrationMutation(Number(id));

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const handleSubmit = async (form: DepotRegistration.RegistrationForm) => {
    try {
      await updateMutation.mutateAsync(form);
      ToastService.success("Depot registration details updated successfully!");
      navigate("/mptbc/depot-registration");
    } catch {
      ToastService.error("Failed to update depot registration details");
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
      header="Edit Depot Profile"
      subHeader="Modify registration records, capacity metrics, and contact details."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6 border border-slate-100 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <i className="pi pi-spin pi-spinner text-3xl text-indigo-600" />
            <span className="ml-3 text-sm text-slate-500 font-semibold">
              Loading depot profile...
            </span>
          </div>
        ) : registrationData ? (
          <DepotRegistrationForm
            fetchData={registrationData}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/mptbc/depot-registration")}
            isSaving={updateMutation.isPending}
            isEditMode={true}
          />
        ) : (
          <div className="text-center py-12 text-slate-400 font-medium">
            Depot profile not found.
          </div>
        )}
      </Card>
    </Page>
  );
}
