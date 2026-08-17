import { useFormServerError } from "auth/hooks/useFormServerError";
import type { DefaultValues } from "react-hook-form";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

import { schema } from "./form.schema";

export function usePrinterRegistrationForm(
  submitCallback: (data: Printer.RegistrationForm) => Promise<void> | void,
  defaultValues?:
    | Partial<Printer.RegistrationForm>
    | (() => Promise<Partial<Printer.RegistrationForm>>),
) {
  const form = useAppForm<Printer.RegistrationForm>({
    defaultValues: (defaultValues ?? {
      machines: [],
    }) as unknown as DefaultValues<Printer.RegistrationForm>,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState,
    control,
    trigger,
  } = form;

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
    setValue,
    formState,
    control,
    trigger,
  };
}
