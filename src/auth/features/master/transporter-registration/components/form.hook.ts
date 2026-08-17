import { useFormServerError } from "auth/hooks/useFormServerError";
import type { DefaultValues } from "react-hook-form";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<Transportation.TransporterRegistrationForm>(
  (o) => ({
    transporterType: o.string().required().label("Transporter Type"),
    transporterName: o.string().required().label("Transporter Name"),
    firmName: o.string().required().label("Firm/Company Name"),

    panNumber: o
      .string()
      .required()
      .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      .messages({
        "string.pattern.base": "Invalid PAN format (e.g. ABCDE1234F)",
      })
      .label("PAN Number"),

    gstin: o
      .string()
      .required()
      .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .messages({
        "string.pattern.base": "Invalid GSTIN format (e.g. 23ABCDE1234F1Z5)",
      })
      .label("GSTIN"),

    registrationDate: o.any().required().label("Registration Date"),

    stateId: o.number().required().label("State"),
    districtId: o.number().required().label("District"),
    tehsilId: o.number().required().label("Tehsil/Block"),

    pinCode: o
      .string()
      .required()
      .pattern(/^[0-9]{6}$/)
      .messages({
        "string.pattern.base": "PIN Code must be exactly 6 digits",
      })
      .label("PIN Code"),

    ownerName: o.string().required().label("Owner Name"),
    fatherName: o.string().required().label("Father/Husband Name"),

    mobile: o
      .string()
      .required()
      .pattern(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": "Mobile number must be exactly 10 digits",
      })
      .label("Owner Mobile"),

    alternateMobile: o
      .string()
      .optional()
      .allow("", null)
      .pattern(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": "Mobile number must be exactly 10 digits",
      })
      .label("Alternate Mobile"),

    email: o
      .string()
      .required()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Please enter a valid Email",
      })
      .label("Owner Email"),

    aadhaar: o
      .string()
      .required()
      .pattern(/^[0-9]{12}$/)
      .messages({
        "string.pattern.base": "Aadhaar must be exactly 12 digits",
      })
      .label("Aadhaar Number"),

    authorizedPerson: o.string().required().label("Authorized Person Name"),
    authorizedMobile: o
      .string()
      .required()
      .pattern(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": "Mobile number must be exactly 10 digits",
      })
      .label("Authorized Person Mobile"),

    authorizedEmail: o
      .string()
      .required()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Please enter a valid Email",
      })
      .label("Authorized Person Email"),

    turnoverFY2223: o.number().min(0).required().label("Turnover FY 22-23"),
    turnoverFY2324: o.number().min(0).required().label("Turnover FY 23-24"),
    turnoverFY2425: o.number().min(0).required().label("Turnover FY 24-25"),
    caCertificate: o
      .string()
      .optional()
      .allow("", null)
      .label("CA Certificate"),
  }),
);

export function useTransporterRegistrationForm(
  submitCallback: Forms.SubmitFunc<Transportation.TransporterRegistrationForm>,
  defaultValues?: Partial<Transportation.TransporterRegistrationForm>,
) {
  const form = useAppForm<Transportation.TransporterRegistrationForm>({
    defaultValues: (defaultValues ??
      {}) as unknown as DefaultValues<Transportation.TransporterRegistrationForm>,
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
