import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.OfficeLevelForm>((o) => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({ "string.pattern.base": errors.englishOnly })
    .label("Name")
    .max(40),
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
    .label("Office Level Code")
    .max(2),
}));

export function useOfficeLevelForm(
  submitCallback: Forms.SubmitFunc<Master.OfficeLevelForm>,
  defaultValues?: Forms.FetchDataFunc<Master.OfficeLevelForm>,
) {
  const form = useAppForm<Master.OfficeLevelForm>({
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
