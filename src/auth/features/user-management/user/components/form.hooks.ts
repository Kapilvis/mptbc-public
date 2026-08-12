import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<UserManagement.UserForm>((o) => ({
  userName: o
    .string()
    .required()
    .pattern(expressions.alphaNumericOnly)
    .messages({ "string.pattern.base": errors.alphaNumericOnly })
    .label("User Name")
    .max(30),
  firstName: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({ "string.pattern.base": errors.englishOnly })
    .label("First Name")
    .max(30),
  lastName: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.englishOnly)
    .messages({ "string.pattern.base": errors.englishOnly })
    .label("Last Name")
    .max(30),
  email: o.string().required().email().label("Email").max(50),
}));

export function useUserForm(
  submitCallback: Forms.SubmitFunc<UserManagement.UserForm>,
  defaultValues?: Forms.FetchDataFunc<UserManagement.UserForm>,
) {
  const form = useAppForm<UserManagement.UserForm>({
    defaultValues: defaultValues ?? {},
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, setValue } = form;

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    setValue,
  };
}
