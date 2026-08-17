import { useEffect } from "react";
import { Card, InputPanel } from "shared/components/panels";
import { TextBox } from "shared/components/forms";
import { Button } from "shared/components/buttons";
import { useBidForm } from "./form.hook";
import type { Tender, Bid } from "../data";

interface BidFormProps {
  onSubmit: (values: {
    rateCat1: number;
    rateCat2: number;
    rateCat3: number;
  }) => Promise<void>;
  selectedTender: Tender;
  existingBid?: Bid;
  isLocked: boolean;
  submitting: boolean;
}

export default function BidForm({
  onSubmit,
  selectedTender,
  existingBid,
  isLocked,
  submitting,
}: BidFormProps) {
  const { handleSubmit, control, reset } = useBidForm(onSubmit, {
    rateCat1: existingBid?.rateCat1 || 0,
    rateCat2: existingBid?.rateCat2 || 0,
    rateCat3: existingBid?.rateCat3 || 0,
  });

  // Reset/sync form values once existing bid loads
  useEffect(() => {
    if (existingBid) {
      reset({
        rateCat1: existingBid.rateCat1,
        rateCat2: existingBid.rateCat2,
        rateCat3: existingBid.rateCat3,
      });
    }
  }, [existingBid, reset]);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <Card title="Distribution Zone details">
        {/* Reusing existing global layout review-grid classes */}
        <div className="review-grid">
          <div className="review-field">
            <span className="review-label">District / Zone</span>
            <span className="review-value">{selectedTender.district}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Last Submission Date</span>
            <span className="review-value">{selectedTender.lastDate}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Bid Opening Date</span>
            <span className="review-value">{selectedTender.openingDate}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Tender Title</span>
            <span className="review-value">{selectedTender.title}</span>
          </div>
        </div>
      </Card>

      <InputPanel
        title="Quoted Rates per Metric Ton (₹)"
        description="Enter specific route rates for textbook transportation categories."
        icon="wallet"
        orientation="horizontal"
        className="grid-3"
      >
        <TextBox
          label="Category 3 (>= 9 Ton Capacity) (Rs/Ton)"
          name="rateCat3"
          control={control}
          required
          disabled={isLocked}
          placeholder="e.g. 550"
        />
        <TextBox
          label="Category 2 (4.5 - 9 Ton Capacity) (Rs/Ton)"
          name="rateCat2"
          control={control}
          required
          disabled={isLocked}
          placeholder="e.g. 400"
        />
        <TextBox
          label="Category 1 (1 - 4.5 Ton Capacity) (Rs/Ton)"
          name="rateCat1"
          control={control}
          required
          disabled={isLocked}
          placeholder="e.g. 300"
        />
      </InputPanel>

      {!isLocked && (
        <div className="stepper-footer">
          <div className="stepper-footer-actions">
            <Button
              type="submit"
              label="Submit Commercial Bid"
              icon="check"
              disabled={submitting}
              variant="success"
              className="font-bold shadow-md"
            />
          </div>
        </div>
      )}
    </form>
  );
}
