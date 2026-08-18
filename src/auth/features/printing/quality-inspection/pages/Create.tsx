import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import QualityInspectionForm from "../components/Form";
import type { PrinterQualityInspection } from "../data";
import { initialInspections } from "../data";

export default function Create() {
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const handleSubmit = async (formData: PrinterQualityInspection) => {
    try {
      // Retrieve current inspections
      const saved = sessionStorage.getItem("mptbc_inspections");
      const currentList: PrinterQualityInspection[] = saved
        ? JSON.parse(saved)
        : initialInspections;

      // Generate a new inspection ID
      const newId = `INSP-${Date.now().toString().slice(-6)}`;

      const newRecord: PrinterQualityInspection = {
        ...formData,
        inspectionId: newId,
        createdDate: new Date().toISOString().split("T")[0],
        createdBy: "System Admin",
      };

      currentList.unshift(newRecord); // Prepend to show on top
      sessionStorage.setItem("mptbc_inspections", JSON.stringify(currentList));

      ToastService.success(
        `Inspection report for ${newRecord.printerName} saved successfully.`,
      );
      navigate("/printing/quality-inspection");
    } catch {
      ToastService.error(
        "An error occurred while saving the inspection report.",
      );
    }
  };

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="outlined"
      onClick={() => navigate("/printing/quality-inspection")}
      className="font-bold text-xs"
    />
  );

  return (
    <Page
      header="Quality Inspection"
      subHeader="Evaluate and register textbook offset print quality against standard criteria parameters."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6 border border-slate-100">
        <QualityInspectionForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/printing/quality-inspection")}
        />
      </Card>
    </Page>
  );
}
