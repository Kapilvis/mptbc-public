import { useFormServerError } from "auth/hooks/useFormServerError";
import type { DefaultValues } from "react-hook-form";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<HRMS.EmployeeRegistrationForm>((o) => ({
  employeeCode: o.string().when("hasExistingEmployeeCode", {
    is: "Yes",
    then: o.string().required().label("Employee Code"),
    otherwise: o.string().optional().allow("", null).label("Employee Code"),
  }),
  salutation: o.string().optional().allow("", null).label("Salutation"),
  firstName: o.string().required().label("First Name"),
  middleName: o.string().optional().allow("", null).label("Middle Name"),
  lastName: o.string().required().label("Last Name"),
  gender: o.string().required().label("Gender"),
  dateOfBirth: o.any().required().label("Date of Birth"),
  fatherName: o.string().required().label("Father Name"),

  mobileNumber: o
    .string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
    })
    .label("Mobile Number"),
  alternateMobile: o
    .string()
    .optional()
    .allow("", null)
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
    })
    .label("Alternate Mobile"),
  personalEmail: o
    .string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({ "string.email": "Personal Email must be a valid email" })
    .label("Personal Email"),
  officialEmail: o
    .string()
    .optional()
    .allow("", null)
    .email({ tlds: { allow: false } })
    .messages({ "string.email": "Official Email must be a valid email" })
    .label("Official Email"),
  aadhaarNumber: o
    .string()
    .required()
    .pattern(/^[0-9]{12}$/)
    .messages({
      "string.pattern.base": "Aadhaar number must be exactly 12 digits",
    })
    .label("Aadhaar Number"),
  panNumber: o
    .string()
    .optional()
    .allow("", null)
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .messages({ "string.pattern.base": "Invalid PAN format (e.g. ABCDE1234F)" })
    .label("PAN Number"),
  nationality: o.string().optional().allow("", null).label("Nationality"),
  category: o.string().optional().allow("", null).label("Category"),
  religion: o.string().optional().allow("", null).label("Religion"),

  addressLine1: o.string().required().label("Address Line 1"),
  addressLine2: o.string().optional().allow("", null).label("Address Line 2"),
  stateId: o.number().required().label("State"),
  districtId: o.number().required().label("District"),
  cityId: o.number().required().label("City"),
  pinCode: o
    .string()
    .required()
    .pattern(/^[0-9]{6}$/)
    .messages({ "string.pattern.base": "PIN Code must be exactly 6 digits" })
    .label("PIN Code"),

  hasExistingEmployeeCode: o
    .string()
    .required()
    .label("Has Existing Employee Code?"),
  employeeType: o.string().required().label("Employee Type"),
  natureOfEmployment: o.string().required().label("Nature of Employment"),
  organizationUnitId: o.number().required().label("Organization Unit"),
  campusName: o.string().optional().allow("", null).label("Campus Name"),
  departmentId: o.number().required().label("Department"),
  hrSection: o.string().optional().allow("", null).label("HR Section"),
  employeeClass: o.string().optional().allow("", null).label("Class"),
  designationId: o.number().required().label("Designation"),
  typeOfPost: o.string().optional().allow("", null).label("Type of Post"),
  joiningDate: o.any().required().label("Joining Date"),
  reportingManager: o
    .string()
    .optional()
    .allow("", null)
    .label("Reporting Manager"),
  workLocation: o.string().optional().allow("", null).label("Work Location"),
  employmentStatus: o.string().required().label("Employment Status"),

  maritalStatus: o.string().optional().allow("", null).label("Marital Status"),
  bloodGroup: o.string().optional().allow("", null).label("Blood Group"),
  physicalDisability: o
    .string()
    .optional()
    .allow("", null)
    .label("Physical Disability"),
  criticalIllness: o
    .string()
    .optional()
    .allow("", null)
    .label("Critical Illness"),

  emergencyContactName: o.string().required().label("Emergency Contact Name"),
  emergencyRelation: o.string().required().label("Emergency Relation"),
  emergencyMobileNumber: o
    .string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
    })
    .label("Emergency Mobile Number"),

  bankName: o.string().optional().allow("", null).label("Bank Name"),
  accountNumber: o
    .string()
    .optional()
    .allow("", null)
    .pattern(/^[0-9]{9,18}$/)
    .messages({
      "string.pattern.base": "Account number must be 9 to 18 digits",
    })
    .label("Account Number"),
  ifscCode: o
    .string()
    .optional()
    .allow("", null)
    .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/i)
    .messages({ "string.pattern.base": "Invalid IFSC code format" })
    .label("IFSC Code"),
  branchName: o.string().optional().allow("", null).label("Branch Name"),

  remarks: o.string().optional().allow("", null).label("Remarks"),
}));

export function useEmployeeRegistrationForm(
  submitCallback: Forms.SubmitFunc<HRMS.EmployeeRegistrationForm>,
  defaultValues?: Partial<HRMS.EmployeeRegistrationForm>,
) {
  const form = useAppForm<HRMS.EmployeeRegistrationForm>({
    defaultValues: (defaultValues ?? {
      hasExistingEmployeeCode: "No",
    }) as unknown as DefaultValues<HRMS.EmployeeRegistrationForm>,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState,
    control,
    trigger,
  } = form;

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
    setValue,
    formState,
    control,
    trigger,
  };
}
