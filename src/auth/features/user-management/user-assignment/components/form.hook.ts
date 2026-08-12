import { useFormServerError } from "auth/hooks/useFormServerError";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<UserManagement.UserAssignmentForm>((o) => ({
  userId: o.string().required().label("User"),
  roleName: o.string().required().label("Role"),
  domain: o.string().required().label("Domain"),
}));

export function useUserAssignmentForm(
  submitCallback: Forms.SubmitFunc<UserManagement.UserAssignmentForm>,
  defaultValues?: Forms.FetchDataFunc<UserManagement.UserAssignmentForm>,
) {
  const form = useAppForm<UserManagement.UserAssignmentForm>({
    defaultValues: defaultValues ?? {},
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
