import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { useCreatePaperLabTestingMutation } from "../queries";
import LabTestingForm from "../components/LabTestingForm";
import type { PaperLabTestingRecord } from "../data";

export default function CreatePaperLabTesting() {
  const navigate = useNavigate();
  const pageTitle = usePageTitle();
  const { mutateAsync: createRecord, isPending } =
    useCreatePaperLabTestingMutation();

  const handleSubmit = async (data: PaperLabTestingRecord) => {
    try {
      await createRecord(data);
      ToastService.success("Paper lab testing record created successfully!");
      navigate("/paper/lab-testing");
    } catch {
      ToastService.error("Failed to create paper lab testing record");
    }
  };

  return (
    <Page
      header={`${pageTitle} - Create Sample Test`}
      subHeader="Enter agency paper testing details and record the 10 key laboratory quality parameters."
    >
      <LabTestingForm
        onSubmit={handleSubmit}
        isSaving={isPending}
        onCancel={() => navigate("/paper/lab-testing")}
      />
    </Page>
  );
}
