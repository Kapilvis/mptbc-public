import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import EmployeeForm from "../components/EmployeeForm";
import { useEmployeeQuery, useUpdateEmployeeMutation } from "../queries";

export default function Edit() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const empId = Number(employeeId);

  const { data, isLoading } = useEmployeeQuery(empId);
  const { mutateAsync, isPending } = useUpdateEmployeeMutation(empId);
  const navigate = useNavigate();

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  if (isLoading) return <Loader />;

  const handleSubmit = async (form: HRMS.EmployeeRegistration) => {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Employee details updated successfully");
        navigate("/hrms/employee-details");
      }
    } catch {
      ToastService.error(
        "An unexpected error occurred while updating employee details",
      );
    }
  };

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
      header="Edit Employee"
      subHeader="Modify employee profile and details."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6">
        <EmployeeForm
          fetchData={data}
          isSaving={isPending}
          onSubmit={handleSubmit}
          isEditMode
        />
      </Card>
    </Page>
  );
}
