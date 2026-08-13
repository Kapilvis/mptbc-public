import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.BookTypeForm>((o) => ({
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

  code: o.string().required().label("Code").max(20),
}));

export function useBookTypeForm(
  submitCallback: Forms.SubmitFunc<Master.BookTypeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.BookTypeForm>,
) {
  const form = useAppForm<Master.BookTypeForm>({
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
