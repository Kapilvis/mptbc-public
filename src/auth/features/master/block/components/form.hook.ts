import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.BlockForm>((o) => ({
  divisionId: o.number().required().label("Division name"),
  districtId: o.number().required().label("District name"),
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({ "string.pattern.base": errors.englishOnly })
    .label("Block name")
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
    .label("Block code")
    .max(20),
  lgdCode: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.numericOnly)
    .messages({ "string.pattern.base": errors.numericOnly })
    .label("LGD code")
    .max(9),
}));

export function useBlockForm(
  submitCallback: Forms.SubmitFunc<Master.BlockForm>,
  defaultValues?: Forms.FetchDataFunc<Master.BlockForm>,
) {
  const form = useAppForm<Master.BlockForm>({
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
