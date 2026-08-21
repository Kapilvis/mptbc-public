import { useFormServerError } from "auth/hooks/useFormServerError";
import Joi from "joi";
import type { DefaultValues } from "react-hook-form";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import type { PaperLabTestingRecord } from "../data";

export function createLabTestingValidationSchema() {
  return validation.create<PaperLabTestingRecord>((o) => ({
    id: o.string().optional(),
    sampleId: o.string().required().label("Sample ID"),
    supplierVendor: o.string().required().label("Supplier / Vendor"),
    paperType: o.string().required().label("Paper Type"),
    gsm: o.string().required().label("GSM"),
    batchLotNo: o.string().required().label("Batch / Lot No."),
    reelSheetSize: o.string().optional().allow("", null),
    testedBy: o.string().required().label("Tested By"),
    testingAgency: o.string().required().label("Testing Agency"),
    testReportNo: o.string().required().label("Test Report No."),
    testingDate: o.string().required().label("Testing Date"),
    overallResult: o.string().optional(),
    approvalStatus: o.string().optional(),
    qualityScore: o.number().optional(),
    parameters: o
      .array()
      .items(
        Joi.object({
          parameterId: Joi.number().required(),
          parameterName: Joi.string().required(),
          requiredSpecification: Joi.string().required(),
          actualResult: Joi.alternatives()
            .try(Joi.number(), Joi.string())
            .required()
            .label("Actual Result"),
          deviation: Joi.string().required(),
          status: Joi.string().valid("PASS", "FAIL").required(),
        }),
      )
      .required(),
  }));
}

export function usePaperLabTestingForm(
  submitCallback: (data: PaperLabTestingRecord) => Promise<void>,
  defaultValues?: Partial<PaperLabTestingRecord>,
) {
  const schema = createLabTestingValidationSchema();

  const form = useAppForm<PaperLabTestingRecord>({
    defaultValues: (defaultValues ??
      {}) as DefaultValues<PaperLabTestingRecord>,
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
