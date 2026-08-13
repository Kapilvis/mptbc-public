import { useNavigate } from "react-router-dom";
import { ToastService } from "services";
import { masterUrls } from "auth/features/master/urls";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import TitleForm from "../components/TitleForm";
import { useCreateTitleMutation } from "../queries";

export default function Create() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateTitleMutation();

  const handleCancel = () => {
    navigate(masterUrls.title.root);
  };

  async function handleSubmit(form: Master.TitleForm) {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success("Title created successfully");
        navigate(masterUrls.title.root);
      }
    } catch {
      ToastService.error("Failed to create title");
    }
  }

  return (
    <Page
      header="Create Title Details"
      subHeader="Enter book title information, parent category mappings, page breakdown, and paper dimensions."
      showHeaderActions
    >
      <Card>
        <TitleForm
          onSubmit={handleSubmit}
          isSaving={isPending}
          onCancel={handleCancel}
        />
      </Card>
    </Page>
  );
}
