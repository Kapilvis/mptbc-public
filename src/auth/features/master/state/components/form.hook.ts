import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.StateForm>((o) => ({
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
    .max(2),
  lgdCode: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.numericOnly)
    .messages({ "string.pattern.base": errors.numericOnly })
    .label("LGD code")
    .max(2),
}));

export function useStateForm(
  submitCallback: Forms.SubmitFunc<Master.StateForm>,
  defaultValues?: Forms.FetchDataFunc<Master.StateForm>,
) {
  const form = useAppForm<Master.StateForm>({
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
