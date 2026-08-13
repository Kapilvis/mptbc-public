import type { Control } from "react-hook-form";
import { InputPanel } from "shared/components/panels";
import {
  TextBox,
  DropDownList as SelectBox,
  DatePicker as DateBox,
} from "shared/components/forms";
import {
  employeeTypes,
  natureOfEmploymentOptions,
  organizationUnits,
  departments,
  hrSections,
  designations,
  postTypes,
  employmentStatuses,
} from "../data";

interface Step3Props {
  control: Control<HRMS.EmployeeRegistrationForm>;
}

export default function Step3({ control }: Step3Props) {
  return (
    <InputPanel
      title="Employment Profile"
      description="Define the organization unit roles and status."
      icon="briefcase"
      orientation="horizontal"
      className="grid-3"
    >
      <SelectBox
        label="Employee Type"
        name="employeeType"
        required
        control={control}
        data={employeeTypes}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="Nature of Employment"
        name="natureOfEmployment"
        required
        control={control}
        data={natureOfEmploymentOptions}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="Organization Unit"
        name="organizationUnitId"
        required
        control={control}
        data={organizationUnits}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="Department"
        name="departmentId"
        required
        control={control}
        data={departments}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="HR Section"
        name="hrSection"
        control={control}
        data={hrSections}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="Designation"
        name="designationId"
        required
        control={control}
        data={designations}
        optionValue="id"
        textField="text"
      />
      <SelectBox
        label="Type of Post"
        name="typeOfPost"
        control={control}
        data={postTypes}
        optionValue="id"
        textField="text"
      />
      <DateBox
        label="Joining Date"
        name="joiningDate"
        control={control}
        required
        placeholder="Select Date of Joining"
      />
      <TextBox
        label="Reporting Manager"
        name="reportingManager"
        control={control}
        placeholder="Manager Name"
      />
      <TextBox
        label="Work Location"
        name="workLocation"
        control={control}
        placeholder="Room/Cabin Number"
      />
      <SelectBox
        label="Employment Status"
        name="employmentStatus"
        required
        control={control}
        data={employmentStatuses}
        optionValue="id"
        textField="text"
      />
    </InputPanel>
  );
}
