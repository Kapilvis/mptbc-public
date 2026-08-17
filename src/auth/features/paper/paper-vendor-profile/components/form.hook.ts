import { useEffect } from "react";
import { useFormServerError } from "auth/hooks/useFormServerError";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<PaperVendor.VendorForm>((o) => ({
  vendorName: o.string().required().label("Paper Vendor Name").max(100),
  paperMillName: o.string().required().label("Paper Mill Name").max(100),
  address: o.string().required().label("Address").max(250),
  contactNo: o
    .string()
    .required()
    .pattern(/^[0-9+\-\s]{10,15}$/)
    .messages({
      "string.pattern.base": "Enter a valid 10-digit contact number",
    })
    .label("Contact Number"),
  emailId: o.string().required().email().label("Email ID"),
  academicYear: o.string().required().label("Agreement Year"),
  approvedTon: o
    .number()
    .required()
    .greater(0)
    .messages({
      "any.required": "Approved Quantity in Ton is required",
      "number.greater": "Approved Quantity must be greater than 0",
    })
    .label("Approved Quantity Ton"),
  suppliedTon: o.number().optional().allow(null, "").label("Supplied Ton"),
  ratePerMt: o
    .number()
    .required()
    .greater(0)
    .messages({
      "any.required": "Rate per MT is required",
      "number.greater": "Rate per MT must be greater than 0",
    })
    .label("Rate per MT"),
  securityDeposit: o
    .number()
    .required()
    .min(0)
    .messages({
      "any.required": "Security Deposit is required",
    })
    .label("Security Deposit"),
  agreementDocUrl: o
    .string()
    .optional()
    .allow("", null)
    .label("Agreement Document"),
}));

export function usePaperVendorForm(
  submitCallback: Forms.SubmitFunc<PaperVendor.VendorForm>,
  defaultValues?: Forms.FetchDataFunc<PaperVendor.VendorForm>,
) {
  const form = useAppForm<PaperVendor.VendorForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, control, setError, setValue, watch } =
    form;

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as PaperVendor.VendorForm);
    }
  }, [defaultValues, reset]);

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    control,
    setError,
    setValue,
    watch,
  };
}
