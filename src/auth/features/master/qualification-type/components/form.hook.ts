import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.QualificationTypeForm>((o) => ({
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
}));

export function useQualificationTypeForm(
  submitCallback: Forms.SubmitFunc<Master.QualificationTypeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.QualificationTypeForm>,
) {
  const form = useAppForm<Master.QualificationTypeForm>({
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
