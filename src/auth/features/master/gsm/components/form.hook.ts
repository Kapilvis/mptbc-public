import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.GsmForm>((o) => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      "string.pattern.base": errors.englishOnly,
    })
    .label("Paper Type Name")
    .max(50),

  localName: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.hindiOnly)
    .messages({
      "string.pattern.base": errors.hindiOnly,
    })
    .label("Paper Type Name (Hindi)")
    .max(60),

  gsmValue: o.number().required().min(1).max(1000).label("GSM Value"),

  usage: o.string().required().label("Usage").max(50),

  code: o.string().required().label("Specification Code").max(30),
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

  const { register, handleSubmit, reset } = form;

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
