import { useFormServerError } from "auth/hooks/useFormServerError";
import type { DefaultValues } from "react-hook-form";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

interface BidFormInput {
  rateCat1: number;
  rateCat2: number;
  rateCat3: number;
}

const schema = validation.create<BidFormInput>((o) => ({
  rateCat1: o.number().min(1).required().label("Category 1 Rate (Rs/Ton)"),
  rateCat2: o.number().min(1).required().label("Category 2 Rate (Rs/Ton)"),
  rateCat3: o.number().min(1).required().label("Category 3 Rate (Rs/Ton)"),
}));

export function useBidForm(
  submitCallback: Forms.SubmitFunc<BidFormInput>,
  defaultValues?: Partial<BidFormInput>,
) {
  const form = useAppForm<BidFormInput>({
    defaultValues: (defaultValues ??
      {}) as unknown as DefaultValues<BidFormInput>,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, watch, formState, control } = form;

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
    formState,
    control,
  };
}
