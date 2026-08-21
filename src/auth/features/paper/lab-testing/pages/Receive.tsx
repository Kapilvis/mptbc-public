import { useNavigate, useParams } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Loader } from "shared/components/progress";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  usePaperLabTestingQuery,
  useUpdatePaperLabTestingMutation,
} from "../queries";
import LabTestingForm from "../components/LabTestingForm";
import type { PaperLabTestingRecord } from "../data";

export default function ReceivePaperLabTesting() {
  const navigate = useNavigate();
  const { id } = useParams();
  const pageTitle = usePageTitle();

  const { data: initialData, isLoading } = usePaperLabTestingQuery(
    id || "",
    !!id,
  );
  const { mutateAsync: updateRecord, isPending } =
    useUpdatePaperLabTestingMutation(id || "");

  const handleSubmit = async (data: PaperLabTestingRecord) => {
    try {
      const isPass = data.parameters.every((p) => p.status === "PASS");
      await updateRecord({
        ...data,
        overallResult: isPass ? "PASS" : "FAIL",
        approvalStatus: isPass ? "Approved for Use" : "Rejected / Out of Spec",
      });
      ToastService.success(
        "Lab test report received and evaluated successfully!",
      );
      navigate("/paper/lab-testing");
    } catch {
      ToastService.error("Failed to save lab test report evaluation");
    }
  };

  if (isLoading) return <Loader type="relative" />;

  return (
    <Page
      header={`${pageTitle} - Receive Lab Test Report & Evaluate`}
      subHeader="Enter 10 key laboratory quality parameters from physical lab report to evaluate PASS / FAIL verdict."
    >
      <LabTestingForm
        mode="receive"
        onSubmit={handleSubmit}
        initialData={initialData}
        isSaving={isPending}
        onCancel={() => navigate("/paper/lab-testing")}
      />
    </Page>
  );
}
