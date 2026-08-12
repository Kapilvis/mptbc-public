import { useFormServerError } from "auth/hooks/useFormServerError";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<UserManagement.UserRoleForm>((o) => ({
  name: o.string().required().label("Role"),
  description: o.string().required().label("Description"),
}));

export function useUserRoleForm(
  submitCallback: Forms.SubmitFunc<UserManagement.UserRoleForm>,
  defaultValues?: Forms.FetchDataFunc<UserManagement.UserRoleForm>,
) {
  const form = useAppForm<UserManagement.UserRoleForm>({
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
