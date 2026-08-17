import type { UseFormWatch } from "react-hook-form";
import { Card } from "shared/components/panels";

interface Step4Props {
  watch: UseFormWatch<Transportation.TransporterRegistrationForm>;
  transporterNameText: string;
  transporterTypeText: string;
  panNumberText: string;
  gstinText: string;
  addressText: string;
  ownerNameText: string;
  mobileText: string;
}

export default function Step4({
  watch,
  transporterNameText,
  transporterTypeText,
  panNumberText,
  gstinText,
  addressText,
  ownerNameText,
  mobileText,
}: Step4Props) {
  const t1 = Number(watch("turnoverFY2223") || 0);
  const t2 = Number(watch("turnoverFY2324") || 0);
  const t3 = Number(watch("turnoverFY2425") || 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="step-container">
      <Card title="Review Transporter Profile Information">
        <div className="review-grid">
          <div className="review-field">
            <span className="review-label">Transporter Name</span>
            <span className="review-value">{transporterNameText || "-"}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Transporter Type</span>
            <span className="review-value">{transporterTypeText || "-"}</span>
          </div>
          <div className="review-field">
            <span className="review-label">PAN Number</span>
            <span className="review-value">{panNumberText || "-"}</span>
          </div>
          <div className="review-field">
            <span className="review-label">GSTIN</span>
            <span className="review-value">{gstinText || "-"}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Owner Name</span>
            <span className="review-value">{ownerNameText || "-"}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Primary Mobile</span>
            <span className="review-value">{mobileText || "-"}</span>
          </div>
          <div className="review-field full-width">
            <span className="review-label">Company Address</span>
            <span className="review-value">{addressText || "-"}</span>
          </div>
          <div className="review-field full-width">
            <span className="review-label">Financial Turnovers Declared</span>
            <div className="turnover-grid">
              <div className="turnover-item">FY22-23: {formatCurrency(t1)}</div>
              <div className="turnover-item">FY23-24: {formatCurrency(t2)}</div>
              <div className="turnover-item">FY24-25: {formatCurrency(t3)}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
