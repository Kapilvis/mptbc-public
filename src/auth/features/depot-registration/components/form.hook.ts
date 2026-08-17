import { useFormServerError } from "auth/hooks/useFormServerError";
import type { DefaultValues } from "react-hook-form";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { schema } from "./form.schema";

export function useDepotRegistrationForm(
  defaultValues?:
    | Partial<DepotRegistration.RegistrationForm>
    | (() => Promise<Partial<DepotRegistration.RegistrationForm>>),
) {
  const form = useAppForm<DepotRegistration.RegistrationForm>({
    defaultValues: (defaultValues ?? {
      isActive: true,
    }) as unknown as DefaultValues<DepotRegistration.RegistrationForm>,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  return form;
}
