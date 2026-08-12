import { useFormServerError } from "auth/hooks/useFormServerError";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<UserManagement.RolePermissionForm>((o) => ({
  roleName: o.string().required().label("Role"),
  domain: o.string().required().label("Domain"),
  action: o.string().required().label("Action (Right)"),
}));

export function useRolePermissionForm(
  submitCallback: Forms.SubmitFunc<UserManagement.RolePermissionForm>,
  defaultValues?: Forms.FetchDataFunc<UserManagement.RolePermissionForm>,
) {
  const form = useAppForm<UserManagement.RolePermissionForm>({
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
