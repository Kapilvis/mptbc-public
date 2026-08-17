import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import PrinterRegistrationForm from "../components/PrinterRegistrationForm";

export default function Create() {
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const handleSubmit = async (form: Printer.Registration) => {
    try {
      console.warn("Submitting printer details:", form);
      ToastService.success("Printer registration submitted successfully!");
      navigate("/mptbc/printer-registration");
    } catch {
      ToastService.error("Failed to submit printer registration");
    }
  };

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/mptbc/printer-registration")}
    />
  );

  return (
    <Page
      header="Printer Registration"
      subHeader="Empanelment and technical assessment for MPTBC Textbook Printer registration."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6">
        <PrinterRegistrationForm onSubmit={handleSubmit} />
      </Card>
    </Page>
  );
}
