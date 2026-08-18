import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import QualityInspectionForm from "../components/Form";
import type { PrinterQualityInspection } from "../data";
import { initialInspections } from "../data";

export default function Edit() {
  const navigate = useNavigate();
  const { inspectionId } = useParams();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [inspection, setInspection] = useState<PrinterQualityInspection | null>(
    null,
  );

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  // Fetch the inspection report to edit
  useEffect(() => {
    const saved = sessionStorage.getItem("mptbc_inspections");
    const currentList: PrinterQualityInspection[] = saved
      ? JSON.parse(saved)
      : initialInspections;

    const found = currentList.find((i) => i.inspectionId === inspectionId);
    if (!found) {
      ToastService.error(`Inspection report ${inspectionId} not found.`);
      navigate("/printing/quality-inspection");
      return;
    }

    // Normalize date field if necessary
    setInspection({
      ...found,
      inspectionDate: found.inspectionDate
        ? new Date(found.inspectionDate).toISOString().split("T")[0]
        : "",
    });
  }, [inspectionId, navigate]);

  const handleSubmit = async (formData: PrinterQualityInspection) => {
    try {
      const saved = sessionStorage.getItem("mptbc_inspections");
      const currentList: PrinterQualityInspection[] = saved
        ? JSON.parse(saved)
        : initialInspections;

      const updatedList = currentList.map((item) => {
        if (item.inspectionId === inspectionId) {
          return {
            ...item,
            ...formData,
            modifiedDate: new Date().toISOString().split("T")[0],
            modifiedBy: "System Admin",
          };
        }
        return item;
      });

      sessionStorage.setItem("mptbc_inspections", JSON.stringify(updatedList));
      ToastService.success(
        `Inspection report for ${formData.printerName} updated successfully.`,
      );
      navigate("/printing/quality-inspection");
    } catch {
      ToastService.error(
        "An error occurred while updating the inspection report.",
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

  if (!inspection) return null;

  return (
    <Page
      header="Edit Quality Inspection"
      subHeader={`Modify quality scoring metrics for printer: ${inspection.printerName}`}
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="p-6 border border-slate-100">
        <QualityInspectionForm
          onSubmit={handleSubmit}
          initialData={inspection}
          onCancel={() => navigate("/printing/quality-inspection")}
        />
      </Card>
    </Page>
  );
}
