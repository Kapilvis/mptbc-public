import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.NationalityForm>((o) => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      "string.pattern.base": errors.englishOnly,
    })
    .label("Name")
    .max(45),

  localName: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.hindiOnly)
    .messages({
      "string.pattern.base": errors.hindiOnly,
    })
    .label("Local Name")
    .max(50),

  code: o.string().optional().allow("", null).label("Code").max(20),
}));

export function useNationalityForm(
  submitCallback: Forms.SubmitFunc<Master.NationalityForm>,
  defaultValues?: Forms.FetchDataFunc<Master.NationalityForm>,
) {
  const form = useAppForm<Master.NationalityForm>({
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
