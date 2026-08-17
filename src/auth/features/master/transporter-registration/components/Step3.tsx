import type { Control, UseFormWatch } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import { TextBox } from "shared/components/forms";

interface Step3Props {
  control: Control<Transportation.TransporterRegistrationForm>;
  watch: UseFormWatch<Transportation.TransporterRegistrationForm>;
}

export default function Step3({ control, watch }: Step3Props) {
  // Watch turnover values and certificate to calculate eligibility dynamically
  const t1 = Number(watch("turnoverFY2223") || 0);
  const t2 = Number(watch("turnoverFY2324") || 0);
  const t3 = Number(watch("turnoverFY2425") || 0);
  const caCertificate = watch("caCertificate");

  const hasHighTurnover = t1 >= 8000000 || t2 >= 8000000 || t3 >= 8000000;
  const isQualified = hasHighTurnover && !!caCertificate;

  return (
    <div className="step-container">
      <InputPanel
        title="Financial Eligibility Indicators"
        description="Declare annual turnover figures and upload verification certificates."
        icon="money-bill"
        orientation="horizontal"
        className="grid-3"
      >
        <TextBox
          label="Turnover FY 2022-23 (Rs.)"
          name="turnoverFY2223"
          control={control}
          required
          placeholder="e.g. 8500000"
        />
        <TextBox
          label="Turnover FY 2023-24 (Rs.)"
          name="turnoverFY2324"
          control={control}
          required
          placeholder="e.g. 9000000"
        />
        <TextBox
          label="Turnover FY 2024-25 (Rs.)"
          name="turnoverFY2425"
          control={control}
          required
          placeholder="e.g. 10200000"
        />
        <TextBox
          label="CA Certificate Document (Filename)"
          name="caCertificate"
          control={control}
          required
          placeholder="e.g. ca_certificate.pdf"
        />

        {/* Live Technical Qualification Check Panel */}
        <div className="input-panel-full-width eligibility-container">
          <div
            className={`eligibility-panel ${isQualified ? "qualified" : "not-qualified"}`}
          >
            <div className="eligibility-info">
              <span className="eligibility-icon">
                <i
                  className={`pi ${isQualified ? "pi-verified" : "pi-exclamation-triangle"}`}
                />
              </span>
              <div className="eligibility-texts">
                <p className="eligibility-title">
                  Technical Eligibility status:{" "}
                  {isQualified ? "QUALIFIED" : "NOT QUALIFIED"}
                </p>
                <p className="eligibility-subtitle">
                  Rule: Minimum turnover of ₹80,00,000 in at least one of the
                  three FY years and CA Certificate upload.
                </p>
              </div>
            </div>
            <div className="eligibility-status">
              <span
                className={`eligibility-badge ${isQualified ? "qualified" : "not-qualified"}`}
              >
                {isQualified ? "Bidding Unlocked" : "Bidding Locked"}
              </span>
            </div>
          </div>
        </div>
      </InputPanel>
    </div>
  );
}
