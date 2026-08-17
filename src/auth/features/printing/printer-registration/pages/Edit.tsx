import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import PrinterRegistrationForm from "../components/PrinterRegistrationForm";

import { getPrinterMockDetails } from "../data";

export default function Edit() {
  const { printerCode } = useParams<{ printerCode: string }>();
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const fetchData = async (): Promise<Printer.Registration> => {
    return getPrinterMockDetails(printerCode);
  };

  const handleSubmit = async (form: Printer.Registration) => {
    try {
      console.warn("Updating printer details:", form);
      ToastService.success(
        "Printer registration details updated successfully!",
      );
      navigate("/printing/printer-registration");
    } catch {
      ToastService.error("Failed to update printer registration");
    }
  };

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/printing/printer-registration")}
    />
  );

  return (
    <Page
      header="Edit Printer Profile"
      subHeader="Modify textbook printer press registration and infrastructure details."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6">
        <PrinterRegistrationForm
          fetchData={fetchData}
          onSubmit={handleSubmit}
        />
      </Card>
    </Page>
  );
}
