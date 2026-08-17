import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import BookPaperRequirementForm from "../components/BookPaperRequirementForm";
import PaperCalculationPreview from "../components/PaperCalculationPreview";
import {
  getGsmOptions,
  createBookPaperRequirement,
  useBookPaperRequirement,
} from "../bookPaperRequirementService";

export default function Create() {
  const navigate = useNavigate();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const { data: gsmOptions = [] } = useQuery({
    queryKey: ["gsm-options"],
    queryFn: getGsmOptions,
  });

  const createMutation = useMutation({
    mutationFn: createBookPaperRequirement,
    onSuccess: () => {
      ToastService.success("Book paper requirement saved successfully");
      navigate("/book-paper-requirement");
    },
    onError: () => {
      ToastService.error("Failed to save book paper requirement");
    },
  });

  const onSubmit = async (formValues: BookPaperRequirement.Form) => {
    const pagesGsm = gsmOptions.find(
      (g) => g.gsmId === Number(formValues.pagesGsmId),
    );
    const coverGsm = gsmOptions.find(
      (g) => g.gsmId === Number(formValues.coverGsmId),
    );

    if (!pagesGsm || !coverGsm) {
      ToastService.error("Please select valid GSM values");
      return;
    }

    const { innerPaperMt, coverPaperMt } = liveCalculations;

    const payload = {
      title: formValues.title,
      numberOfBooks: Number(formValues.numberOfBooks),
      pagesPerBook: Number(formValues.pagesPerBook),
      pagesGsmId: Number(formValues.pagesGsmId),
      coverGsmId: Number(formValues.coverGsmId),
      pagesGsmName: pagesGsm.title,
      coverGsmName: coverGsm.title,
      innerPaperMt,
      coverPaperMt,
    };

    await createMutation.mutateAsync(payload);
  };

  const { register, handleSubmit, reset, liveCalculations } =
    useBookPaperRequirement(onSubmit, gsmOptions);

  const handleReset = () => {
    reset({
      title: "",
      numberOfBooks: undefined as unknown as number,
      pagesPerBook: undefined as unknown as number,
      pagesGsmId: undefined as unknown as number,
      coverGsmId: undefined as unknown as number,
    });
  };

  const backButton = (
    <Button
      label="Back"
      icon="pi pi-arrow-left"
      className="p-button-secondary"
      onClick={() => navigate("/book-paper-requirement")}
    />
  );

  return (
    <Page
      header="Calculate Book Paper Requirement"
      subHeader="Enter Textbook specifications to estimate print paper metric ton details."
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <Card className="border border-gray-100 shadow-sm p-4 bg-white">
        <BookPaperRequirementForm
          register={register}
          gsmOptions={gsmOptions}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isSaving={createMutation.isPending}
        />

        <PaperCalculationPreview
          innerPaperMt={liveCalculations.innerPaperMt}
          coverPaperMt={liveCalculations.coverPaperMt}
        />
      </Card>
    </Page>
  );
}
