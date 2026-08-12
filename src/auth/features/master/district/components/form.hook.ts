import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.DistrictForm>((o) => ({
  divisionId: o.number().required().label("Division name"),
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({ "string.pattern.base": errors.englishOnly })
    .label("Name")
    .max(45),
  localName: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.hindiOnly)
    .messages({ "string.pattern.base": errors.hindiOnly })
    .label("Local name")
    .max(50),
  code: o
    .string()
    .required()
    .pattern(expressions.alphaNumericOnly)
    .messages({ "string.pattern.base": errors.alphaNumericOnly })
    .label("Code")
    .max(4),
  lgdCode: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.numericOnly)
    .messages({ "string.pattern.base": errors.numericOnly })
    .label("Local Government Directory Code")
    .max(4),
}));

export function useDistrictForm(
  submitCallback: Forms.SubmitFunc<Master.DistrictForm>,
  defaultValues?: Forms.FetchDataFunc<Master.DistrictForm>,
) {
  const form = useAppForm<Master.DistrictForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, watch, setValue } = form;
  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
    setValue,
  };
}
