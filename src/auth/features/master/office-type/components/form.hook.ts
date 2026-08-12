import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.OfficeTypeForm>((o) => ({
  officeLevelId: o.number().required().label("Office Level"),
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({ "string.pattern.base": errors.englishOnly })
    .label("Name")
    .max(50),
  localName: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.hindiOnly)
    .messages({ "string.pattern.base": errors.hindiOnly })
    .label("Local Name")
    .max(30),
  code: o
    .string()
    .required()
    .pattern(expressions.alphaNumericOnly)
    .messages({ "string.pattern.base": errors.alphaNumericOnly })
    .label("Code")
    .max(2),
}));

export function useOfficeTypeForm(
  submitCallback: Forms.SubmitFunc<Master.OfficeTypeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.OfficeTypeForm>,
) {
  const form = useAppForm<Master.OfficeTypeForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset } = form;

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
