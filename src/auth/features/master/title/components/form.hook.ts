import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";

const schema = validation.create<Master.TitleForm>((o) => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      "string.pattern.base": errors.englishOnly,
    })
    .label("Title Name")
    .max(60),

  localName: o
    .string()
    .optional()
    .allow("", null)
    .pattern(expressions.hindiOnly)
    .messages({
      "string.pattern.base": errors.hindiOnly,
    })
    .label("Local Name")
    .max(80),

  code: o.string().required().label("Title Code").max(30),

  classId: o.number().required().label("Class"),
  bookTypeId: o.number().required().label("Book Type"),
  mediumId: o.number().required().label("Medium"),

  innerPages: o.number().required().min(1).label("Inner Pages"),
  innerGsmId: o.number().required().label("Inner GSM"),

  coverPages: o.number().required().min(0).label("Cover Pages"),
  coverGsmId: o.number().required().label("Cover GSM"),

  specialPages: o.number().optional().allow(null).min(0).label("Special Pages"),
  specialGsmId: o.number().optional().allow(null).label("Special GSM"),

  totalPages: o.number().required().min(1).label("Total Pages"),

  weight: o.number().required().min(1).label("Book Weight"),
  length: o.number().required().min(1).label("Length"),
  width: o.number().required().min(1).label("Width"),
  paperArea: o.number().required().label("Paper Area"),
}));

export function useTitleForm(
  submitCallback: Forms.SubmitFunc<Master.TitleForm>,
  defaultValues?: Forms.FetchDataFunc<Master.TitleForm>,
) {
  const form = useAppForm<Master.TitleForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, control, setValue } = form;

  const innerPages = useWatch({ control, name: "innerPages" }) || 0;
  const coverPages = useWatch({ control, name: "coverPages" }) || 0;
  const specialPages = useWatch({ control, name: "specialPages" }) || 0;
  const length = useWatch({ control, name: "length" }) || 0;
  const width = useWatch({ control, name: "width" }) || 0;

  useEffect(() => {
    const total =
      Number(innerPages) + Number(coverPages) + Number(specialPages);
    setValue("totalPages", total, { shouldValidate: true });

    if (length > 0 && width > 0 && total > 0) {
      const area = Number(
        (((length * width) / 1000000) * (total / 2)).toFixed(2),
      );
      setValue("paperArea", area, { shouldValidate: true });
    }
  }, [innerPages, coverPages, specialPages, length, width, setValue]);

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    control,
  };
}
