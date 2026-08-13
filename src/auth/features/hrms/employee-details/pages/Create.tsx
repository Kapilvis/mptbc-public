import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import EmployeeForm from "../components/EmployeeForm";
import { useCreateEmployeeMutation } from "../queries";

export default function Create() {
  const { mutateAsync, isPending } = useCreateEmployeeMutation();
  const navigate = useNavigate();

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  async function handleSubmit(form: HRMS.EmployeeRegistration) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Employee registered successfully");
        navigate("/hrms/employee-details");
      }
    } catch {
      ToastService.error(
        "An unexpected error occurred while registering employee",
      );
    }
  }

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/hrms/employee-details")}
    />
  );

  return (
    <Page
      header="Add Employee"
      subHeader="Register a new employee record."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6">
        <EmployeeForm onSubmit={handleSubmit} isSaving={isPending} />
      </Card>
    </Page>
  );
}
