import type { Control } from "react-hook-form";
import { InputPanel, Card } from "shared/components/panels";
import { TextBox, DropDownList as SelectBox } from "shared/components/forms";
import { maritalStatuses, bloodGroups, yesNoOptions } from "../data";

interface Step4Props {
  control: Control<HRMS.EmployeeRegistrationForm>;
  fullName: string;
  mobileNumber: string;
  deptText: string;
  desigText: string;
  joiningDateText: string;
  statusText: string;
  addressText: string;
}

export default function Step4({
  control,
  fullName,
  mobileNumber,
  deptText,
  desigText,
  joiningDateText,
  statusText,
  addressText,
}: Step4Props) {
  return (
    <>
      <InputPanel
        title="Emergency & Health Declarations"
        description="Specify emergency links and health declarations."
        icon="heart"
        orientation="horizontal"
        className="grid-3"
      >
        <SelectBox
          label="Marital Status"
          name="maritalStatus"
          control={control}
          data={maritalStatuses}
          optionValue="id"
          textField="text"
        />
        <SelectBox
          label="Blood Group"
          name="bloodGroup"
          control={control}
          data={bloodGroups}
          optionValue="id"
          textField="text"
        />
        <SelectBox
          label="Physical Disability"
          name="physicalDisability"
          control={control}
          data={yesNoOptions}
          optionValue="id"
          textField="text"
        />
        <SelectBox
          label="Critical Illness"
          name="criticalIllness"
          control={control}
          data={yesNoOptions}
          optionValue="id"
          textField="text"
        />
        <TextBox
          label="Emergency Contact Name"
          name="emergencyContactName"
          control={control}
          required
          placeholder="Contact Full Name"
        />
        <TextBox
          label="Emergency Relation"
          name="emergencyRelation"
          control={control}
          required
          placeholder="e.g. Spouse, Brother, Mother"
        />
        <TextBox
          label="Emergency Contact Mobile"
          name="emergencyMobileNumber"
          control={control}
          required
          placeholder="10-digit number"
        />
      </InputPanel>

      <InputPanel
        title="Bank Details"
        description="Provide bank details for salary disbursements."
        icon="credit-card"
        orientation="horizontal"
        className="grid-3"
      >
        <TextBox
          label="Bank Name"
          name="bankName"
          control={control}
          placeholder="State Bank of India..."
        />
        <TextBox
          label="Account Number"
          name="accountNumber"
          control={control}
          placeholder="Savings/Current account No"
        />
        <TextBox
          label="IFSC Code"
          name="ifscCode"
          control={control}
          placeholder="IFSC code (11 chars)"
        />
        <TextBox
          label="Branch Name"
          name="branchName"
          control={control}
          placeholder="Branch name and address"
        />
        <div className="input-panel-full-width">
          <TextBox
            label="Remarks"
            name="remarks"
            control={control}
            placeholder="Add special notes or remarks"
          />
        </div>
      </InputPanel>

      {/* Review Summary */}
      <Card title="Review Registration Summary">
        <div className="review-grid">
          <div className="review-field">
            <span className="review-label">Employee Name</span>
            <span className="review-value">{fullName}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Mobile Number</span>
            <span className="review-value">{mobileNumber}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Department</span>
            <span className="review-value">{deptText}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Designation</span>
            <span className="review-value">{desigText}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Joining Date</span>
            <span className="review-value">{joiningDateText}</span>
          </div>
          <div className="review-field">
            <span className="review-label">Employment Status</span>
            <span className="review-value">{statusText}</span>
          </div>
          <div className="review-field full-width">
            <span className="review-label">Address</span>
            <span className="review-value">{addressText}</span>
          </div>
        </div>
      </Card>
    </>
  );
}
