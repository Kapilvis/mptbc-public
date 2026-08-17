import { useFormServerError } from "auth/hooks/useFormServerError";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<Master.GsmForm>((o) => ({
  gsm: o
    .number()
    .required()
    .integer()
    .min(1)
    .messages({
      "any.required": "GSM is required",
      "number.base": "GSM is required",
      "number.min": "GSM must be greater than 0",
    })
    .label("GSM"),
  reelWidth: o
    .number()
    .required()
    .greater(0)
    .messages({
      "any.required": "Reel Width is required",
      "number.base": "Reel Width is required",
      "number.greater": "Reel Width must be greater than 0",
    })
    .label("Reel Width"),
  cutoff: o
    .number()
    .required()
    .integer()
    .min(1)
    .messages({
      "any.required": "Cutoff is required",
      "number.base": "Cutoff is required",
      "number.min": "Cutoff must be greater than 0",
    })
    .label("Cutoff"),
  sheetSize: o
    .string()
    .required()
    .max(30)
    .messages({
      "any.required": "Sheet Size is required",
      "string.empty": "Sheet Size is required",
    })
    .label("Sheet Size"),
  area: o
    .number()
    .required()
    .greater(0)
    .messages({
      "any.required": "Area is required",
      "number.base": "Area is required",
      "number.greater": "Area must be greater than 0",
    })
    .label("Area"),
  sheetWeightInGM: o
    .number()
    .required()
    .greater(0)
    .messages({
      "any.required": "Sheet Weight in GM is required",
      "number.base": "Sheet Weight in GM is required",
      "number.greater": "Sheet Weight in GM must be greater than 0",
    })
    .label("Sheet Weight in GM"),
  reamWeightInKG: o
    .number()
    .required()
    .greater(0)
    .messages({
      "any.required": "Ream Weight in KG is required",
      "number.base": "Ream Weight in KG is required",
      "number.greater": "Ream Weight in KG must be greater than 0",
    })
    .label("Ream Weight in KG"),
}));

export function useGsmForm(
  submitCallback: Forms.SubmitFunc<Master.GsmForm>,
  defaultValues?: Forms.FetchDataFunc<Master.GsmForm>,
) {
  const form = useAppForm<Master.GsmForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, control, setError, setValue, watch } =
    form;
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
