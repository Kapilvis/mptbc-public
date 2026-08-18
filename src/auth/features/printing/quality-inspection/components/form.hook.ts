import { useFormServerError } from "auth/hooks/useFormServerError";
import Joi from "joi";
import type { DefaultValues } from "react-hook-form";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import type { PrinterQualityInspection } from "../data";

export function createValidationSchema() {
  return validation.create<PrinterQualityInspection>((o) => ({
    inspectionId: o.string().optional().label("Inspection ID"),
    printerId: o.string().required().label("Printer ID"),
    printerName: o.string().required().label("Printer Name"),
    printerCode: o.string().required().label("Printer Name"),
    inspectionDate: o.string().required().label("Inspection Date"),
    academicYear: o.string().required().label("Academic Year"),
    remarks: o.string().optional().allow("", null).label("Remarks"),
    items: o
      .array()
      .items(
        Joi.object({
          titleId: Joi.string().required(),
          titleName: Joi.string().required(),
          titleCode: Joi.string().required(),
          className: Joi.string().required(),
          totalBooks: Joi.number().required(),
          screenPrintingScore: Joi.number()
            .min(0)
            .max(1)
            .required()
            .label("Registration & Print"),
          inkQualityScore: Joi.number()
            .min(0)
            .max(7)
            .required()
            .label("Ink & Imposition"),
          bindingScore: Joi.number()
            .min(0)
            .max(2)
            .required()
            .label("Binding & Trimming"),
          otherScore: Joi.string().optional().allow("", null).label("Others"),
          totalScore: Joi.number().optional(),
          status: Joi.string().optional(),
        }),
      )
      .required(),
    totalScore: o.number().optional(),
    maximumScore: o.number().optional(),
    percentage: o.number().optional(),
    grade: o.string().optional(),
    status: o.string().optional(),
    createdBy: o.string().optional(),
    createdDate: o.string().optional(),
    modifiedBy: o.string().optional(),
    modifiedDate: o.string().optional(),
    isActive: o.boolean().optional(),
  }));
}

export function useQualityInspectionForm(
  submitCallback: (data: PrinterQualityInspection) => Promise<void>,
  defaultValues?: Partial<PrinterQualityInspection>,
) {
  const schema = createValidationSchema();

  const form = useAppForm<PrinterQualityInspection>({
    defaultValues: (defaultValues ??
      {}) as DefaultValues<PrinterQualityInspection>,
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
