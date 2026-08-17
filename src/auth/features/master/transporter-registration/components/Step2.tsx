import type { Control } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import { TextBox } from "shared/components/forms";

interface Step2Props {
  control: Control<Transportation.TransporterRegistrationForm>;
}

export default function Step2({ control }: Step2Props) {
  return (
    <div className="space-y-6">
      <InputPanel
        title="Owner / Promoter Details"
        description="Enter the legal owner or promoter identifying details and primary contact channels."
        icon="user"
        orientation="horizontal"
        className="grid-3"
      >
        <TextBox
          label="Owner Name"
          name="ownerName"
          control={control}
          required
          placeholder="Enter Owner Full Name"
        />
        <TextBox
          label="Father/Husband Name"
          name="fatherName"
          control={control}
          required
          placeholder="Enter Father's or Husband's Name"
        />
        <TextBox
          label="Mobile Number"
          name="mobile"
          control={control}
          required
          placeholder="10-digit mobile number"
        />
        <TextBox
          label="Alternate Mobile"
          name="alternateMobile"
          control={control}
          placeholder="Optional second number"
        />
        <TextBox
          label="Email Address"
          name="email"
          control={control}
          required
          placeholder="owner@company.com"
        />
        <TextBox
          label="Aadhaar Number"
          name="aadhaar"
          control={control}
          required
          placeholder="12-digit Aadhaar number"
        />
      </InputPanel>

      <InputPanel
        title="Authorized Representative / Contact Person"
        description="Provide details of the person authorized to sign contracts and manage dispatch."
        icon="briefcase"
        orientation="horizontal"
        className="grid-3"
      >
        <TextBox
          label="Authorized Person Name"
          name="authorizedPerson"
          control={control}
          required
          placeholder="Representative Name"
        />
        <TextBox
          label="Contact Mobile"
          name="authorizedMobile"
          control={control}
          required
          placeholder="10-digit contact number"
        />
        <TextBox
          label="Contact Email"
          name="authorizedEmail"
          control={control}
          required
          placeholder="representative@company.com"
        />
      </InputPanel>
    </div>
  );
}
