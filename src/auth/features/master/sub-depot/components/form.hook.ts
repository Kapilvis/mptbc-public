import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.SubDepotForm>((o) => ({
  depotId: o.number().required().label("Depot"),
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({ "string.pattern.base": errors.englishOnly })
    .label("Sub Depot Name")
    .max(50),
  code: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.alphaNumericOnly)
    .messages({ "string.pattern.base": errors.alphaNumericOnly })
    .label("Code")
    .max(10),
  isActive: o.boolean().required().label("Active"),
}));

export function useSubDepotForm(
  submitCallback: Forms.SubmitFunc<Master.SubDepotForm>,
  defaultValues?: Forms.FetchDataFunc<Master.SubDepotForm>,
) {
  const form = useAppForm<Master.SubDepotForm>({
    defaultValues: defaultValues ?? { isActive: true },
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, control, setValue, setError } = form;

  const name = useWatch({ control, name: "name" });
  const code = useWatch({ control, name: "code" });

  useEffect(() => {
    if (name && name !== name.toUpperCase()) {
      setValue("name", name.toUpperCase(), { shouldValidate: true });
    }
  }, [name, setValue]);

  useEffect(() => {
    if (code && code !== code.toUpperCase()) {
      setValue("code", code.toUpperCase(), { shouldValidate: true });
    }
  }, [code, setValue]);

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    control,
    setValue,
    setError,
  };
}
