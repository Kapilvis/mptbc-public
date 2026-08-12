import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.QualificationForm>((o) => ({
  qualificationTypeId: o.number().required().label("Qualification Type"),
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
}));

export function useQualificationForm(
  submitCallback: Forms.SubmitFunc<Master.QualificationForm>,
  defaultValues?: Forms.FetchDataFunc<Master.QualificationForm>,
) {
  const form = useAppForm<Master.QualificationForm>({
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
