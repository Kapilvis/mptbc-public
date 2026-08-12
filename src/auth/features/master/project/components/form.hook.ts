import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.ProjectForm>((o) => ({
  divisionId: o.number().required().label("Division name"),
  districtId: o.number().required().label("District name"),
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
    .max(7),
  lgdCode: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.numericOnly)
    .messages({ "string.pattern.base": errors.numericOnly })
    .label("Local Government Directory Code")
    .max(7),
}));

export function useProjectForm(
  submitCallback: Forms.SubmitFunc<Master.ProjectForm>,
  defaultValues?: Forms.FetchDataFunc<Master.ProjectForm>,
) {
  const form = useAppForm<Master.ProjectForm>({
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
