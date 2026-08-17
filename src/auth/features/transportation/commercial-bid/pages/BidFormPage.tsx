import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { ToastService } from "services";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { ConfirmDialog, useConfirmDialog } from "shared/components/popups";
import { Loader } from "shared/components/progress";
import BidForm from "../components/BidForm";
import {
  useTendersQuery,
  useBidsQuery,
  useSubmitBidMutation,
} from "../queries";

interface BidFormPageProps {
  currentTransporterId: number;
}

export default function BidFormPage({
  currentTransporterId,
}: BidFormPageProps) {
  const { tenderId } = useParams<{ tenderId: string }>();
  const decodedTenderId = decodeURIComponent(tenderId || "");
  const navigate = useNavigate();
  const { confirmAction } = useConfirmDialog();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const { data: tenders = [], isLoading: loadingTenders } = useTendersQuery();
  const { data: bids = [], isLoading: loadingBids } =
    useBidsQuery(currentTransporterId);
  const { mutateAsync: submitBidMutation, isPending: submitting } =
    useSubmitBidMutation();

  const selectedTender = tenders.find((t) => t.tenderId === decodedTenderId);
  const existingBid = bids.find((b) => b.tenderId === decodedTenderId);
  const isLocked = existingBid?.status === "Submitted";

  useEffect(() => {
    setPortalTarget(document.getElementById("page-header-actions"));
  }, []);

  const handleFormSubmit = async (values: {
    rateCat1: number;
    rateCat2: number;
    rateCat3: number;
  }) => {
    if (isLocked) {
      ToastService.error("This bid has already been submitted and locked.");
      return;
    }

    confirmAction({
      message:
        "Rates CANNOT be modified or retracted once submitted. Are you sure you want to permanently submit these bid rates?",
      header: "Submit Bid Confirmation",
      icon: "lock",
      acceptLabel: "Confirm & Submit",
      rejectLabel: "Cancel",
      onAccept: async () => {
        try {
          await submitBidMutation({
            tenderId: decodedTenderId,
            transporterId: currentTransporterId,
            rateCat1: Number(values.rateCat1),
            rateCat2: Number(values.rateCat2),
            rateCat3: Number(values.rateCat3),
            status: "Submitted",
          });
          ToastService.success(
            "Commercial bid rates submitted and locked successfully!",
          );
          navigate("/transport/commercial-bid");
        } catch {
          ToastService.error("Failed to submit commercial bid rates.");
        }
      },
    });
  };

  if (loadingTenders || loadingBids) return <Loader />;

  if (!selectedTender) {
    return (
      <Page header="Tender Not Found" showHeaderActions>
        <Card>
          <p>Tender record not found.</p>
        </Card>
      </Page>
    );
  }

  const backButton = (
    <Button
      label="Back"
      icon="arrow-left"
      variant="primary"
      onClick={() => navigate("/transport/commercial-bid")}
    />
  );

  return (
    <Page
      header="Commercial Bid Submission"
      subHeader={`Tender Reference: ${selectedTender.tenderId}`}
      showHeaderActions
    >
      {portalTarget && createPortal(backButton, portalTarget)}
      <ConfirmDialog />

      <div>
        {/* GST Reminder Card Panel */}
        <Card title="GST Exclusion Reminder">
          <p>
            All transportation rates quoted below must be EXCLUSIVE of GST. GST
            will be handled separately as per corporate policy.
          </p>
        </Card>

        {/* Lock Warning Card Panel */}
        {isLocked && (
          <Card title="Bid Submission Locked">
            <p>
              This bid was submitted on{" "}
              <strong>{existingBid.submittedAt}</strong>. Quote rates are now
              read-only and locked against further edits.
            </p>
          </Card>
        )}

        <Card>
          <BidForm
            onSubmit={handleFormSubmit}
            selectedTender={selectedTender}
            existingBid={existingBid}
            isLocked={isLocked}
            submitting={submitting}
          />
        </Card>
      </div>
    </Page>
  );
}
