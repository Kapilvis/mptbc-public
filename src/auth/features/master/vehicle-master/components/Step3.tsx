import type { Control, UseFormWatch } from "react-hook-form";
import { InputPanel, Card } from "shared/components/panels";
import { TextBox, DatePicker as DateBox } from "shared/components/forms";
import { useTransportersQuery } from "../../transporter-registration/queries";

interface Step3Props {
  control: Control<Transportation.VehicleForm>;
  watch: UseFormWatch<Transportation.VehicleForm>;
  registrationNoText: string;
  categoryText: string;
  capacityText: number;
  ownershipText: string;
  transporterIdVal: number;
}

export default function Step3({
  control,
  watch,
  registrationNoText,
  categoryText,
  capacityText,
  ownershipText,
  transporterIdVal,
}: Step3Props) {
  const { data: transporters = [] } = useTransportersQuery();
  const linkedTransporterName =
    transporters.find((t) => t.transporterId === Number(transporterIdVal))
      ?.transporterName || "-";

  // Watch document expiry dates to show warnings if expired
  const rcExp = watch("rcExpiry");
  const insExp = watch("insuranceExpiry");
  const fitExp = watch("fitnessExpiry");
  const perExp = watch("permitExpiry");
  const pucExp = watch("pucExpiry");

  const isExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getTime() < new Date().getTime();
  };

  const hasAnyExpired =
    isExpired(rcExp) ||
    isExpired(insExp) ||
    isExpired(fitExp) ||
    isExpired(perExp) ||
    isExpired(pucExp);

  return (
    <div className="step-container">
      <InputPanel
        title="Compliance & Expiry Certificates"
        description="Fill in legally mandated registration certificates and check their expiration thresholds."
        icon="id-card"
        orientation="horizontal"
        className="grid-3"
      >
        <TextBox
          label="RC Number"
          name="rcNo"
          control={control}
          required
          placeholder="Enter RC Number"
        />
        <DateBox
          label="RC Expiry Date"
          name="rcExpiry"
          control={control}
          required
          placeholder="Select Date"
        />

        <TextBox
          label="Insurance Policy No"
          name="insuranceNo"
          control={control}
          required
          placeholder="Enter Policy No"
        />
        <DateBox
          label="Insurance Expiry Date"
          name="insuranceExpiry"
          control={control}
          required
          placeholder="Select Date"
        />

        <TextBox
          label="Fitness Certificate No"
          name="fitnessNo"
          control={control}
          required
          placeholder="Enter Fitness No"
        />
        <DateBox
          label="Fitness Expiry Date"
          name="fitnessExpiry"
          control={control}
          required
          placeholder="Select Date"
        />

        <TextBox
          label="Permit Number"
          name="permitNo"
          control={control}
          required
          placeholder="Enter Permit No"
        />
        <DateBox
          label="Permit Expiry Date"
          name="permitExpiry"
          control={control}
          required
          placeholder="Select Date"
        />

        <TextBox
          label="PUC Number"
          name="pucNo"
          control={control}
          required
          placeholder="Enter PUC Number"
        />
        <DateBox
          label="PUC Expiry Date"
          name="pucExpiry"
          control={control}
          required
          placeholder="Select Date"
        />

        {/* Dynamic Expiry Alerts Box */}
        {hasAnyExpired && (
          <div className="input-panel-full-width eligibility-container">
            <div className="eligibility-panel not-qualified">
              <div className="eligibility-info">
                <span className="eligibility-icon">
                  <i className="pi pi-exclamation-triangle" />
                </span>
                <div className="eligibility-texts">
                  <p className="eligibility-title">
                    Document Expiry Alert detected
                  </p>
                  <p className="eligibility-subtitle">
                    Warning: Expired documents will lock this truck from being
                    selectable in the Depot Dispatch Terminal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </InputPanel>

      {/* Review Card */}
      <Card title="Review Vehicle Configuration Details">
        <div className="review-grid">
          <div className="review-field">
            <span className="review-label">Vehicle Registration No</span>
            <span className="review-value">{registrationNoText || "-"}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Vehicle Category</span>
            <span className="review-value">{categoryText || "-"}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Registered Capacity</span>
            <span className="review-value">
              {capacityText ? `${capacityText} Tons` : "-"}
            </span>
          </div>
          <div className="review-field">
            <span className="review-label">Ownership Status</span>
            <span className="review-value">{ownershipText || "-"}</span>
          </div>
          <div className="review-field full-width">
            <span className="review-label">Assigned Transporter</span>
            <span className="review-value">{linkedTransporterName}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
