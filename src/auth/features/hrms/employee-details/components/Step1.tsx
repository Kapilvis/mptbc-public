import type { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "shared/components/buttons";
import { InputPanel } from "shared/components/panels";
import {
  TextBox,
  DropDownList as SelectBox,
  DatePicker as DateBox,
} from "shared/components/forms";
import { salutations, genders, yesNoOptions } from "../data";

interface Step1Props {
  control: Control<HRMS.EmployeeRegistrationForm>;
  watch: UseFormWatch<HRMS.EmployeeRegistrationForm>;
  setValue: UseFormSetValue<HRMS.EmployeeRegistrationForm>;
  onSearchExisting: () => void;
}

export default function Step1({
  control,
  watch,
  onSearchExisting,
}: Step1Props) {
  const hasExistingEmployeeCode = watch("hasExistingEmployeeCode") === "Yes";

  return (
    <InputPanel
      title="Identity Details"
      description="Fill in the core employee identification details."
      icon="id-card"
      orientation="horizontal"
      className="grid-3"
    >
      <SelectBox
        label="Has Existing Employee Code?"
        name="hasExistingEmployeeCode"
        required
        control={control}
        data={yesNoOptions}
        optionValue="id"
        textField="text"
      />
      {hasExistingEmployeeCode && (
        <div className="employee-code-row">
          <div className="employee-code-input">
            <TextBox
              label="Employee Code"
              name="employeeCode"
              control={control}
              required
              placeholder="Enter Employee Code"
            />
          </div>
          <Button
            type="button"
            label="Search"
            icon="search"
            variant="outlined"
            size="small"
            onClick={onSearchExisting}
          />
        </div>
      )}
      <SelectBox
        label="Salutation"
        name="salutation"
        control={control}
        data={salutations}
        optionValue="id"
        textField="text"
      />
      <TextBox
        label="First Name"
        name="firstName"
        control={control}
        required
        placeholder="Enter First Name"
      />
      <TextBox
        label="Middle Name"
        name="middleName"
        control={control}
        placeholder="Enter Middle Name"
      />
      <TextBox
        label="Last Name"
        name="lastName"
        control={control}
        required
        placeholder="Enter Last Name"
      />
      <SelectBox
        label="Gender"
        name="gender"
        required
        control={control}
        data={genders}
        optionValue="id"
        textField="text"
      />
      <DateBox
        label="Date of Birth"
        name="dateOfBirth"
        control={control}
        required
        placeholder="Select Date of Birth"
      />
      <TextBox
        label="Father Name"
        name="fatherName"
        control={control}
        required
        placeholder="Enter Father's Name"
      />
    </InputPanel>
  );
}
