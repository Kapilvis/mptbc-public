import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useFormServerError } from "auth/hooks/useFormServerError";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<PaperOrder.PaperSupplyOrderForm>((o) => ({
  orderNo: o.string().optional().allow("", null).label("Order Number").max(50),
  orderDate: o.any().optional().allow("", null).label("Order Date"),
  vendorId: o.number().required().label("Paper Mill / Vendor Name"),
  vendorName: o.string().optional().allow("", null).label("Vendor Name"),
  paperMillName: o.string().optional().allow("", null).label("Paper Mill Name"),
  paperTypeId: o.string().optional().allow("", null).label("Paper Type ID"),
  paperType: o.string().required().label("Paper Specification / Type"),
  orderedQtyMT: o
    .number()
    .required()
    .min(0.001)
    .messages({
      "any.required": "Ordered Quantity in MT is required",
      "number.min": "Ordered Quantity must be greater than 0",
    })
    .label("Ordered Quantity (MT)"),
  ratePerMT: o
    .number()
    .required()
    .min(0.01)
    .messages({
      "any.required": "Rate per MT is required",
      "number.min": "Rate per MT must be greater than 0",
    })
    .label("Rate per MT"),
  basicAmount: o.number().optional().allow(null, 0).label("Basic Amount"),
  gstPercent: o.number().optional().allow(null, "").label("GST Percentage"),
  totalAmount: o.number().optional().allow(null, 0).label("Total Amount"),
  deliveryLocation: o.string().required().label("Place of Delivery"),
  deliveryDate: o.any().required().label("Delivery Deadline Date"),
  millBillNo: o.string().optional().allow("", null).label("Vendor Bill No."),
  billDate: o.any().optional().allow("", null).label("Bill Date"),
  billCopyPath: o
    .string()
    .optional()
    .allow("", null)
    .label("Bill Copy Soft Copy"),
}));

export function usePaperOrderForm(
  submitCallback: Forms.SubmitFunc<PaperOrder.PaperSupplyOrderForm>,
  defaultValues?: Forms.FetchDataFunc<PaperOrder.PaperSupplyOrderForm>,
) {
  const form = useAppForm<PaperOrder.PaperSupplyOrderForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, control, setError, setValue, watch } =
    form;

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as PaperOrder.PaperSupplyOrderForm);
    }
  }, [defaultValues, reset]);

  const orderedQtyMT = useWatch({ control, name: "orderedQtyMT" }) || 0;
  const ratePerMT = useWatch({ control, name: "ratePerMT" }) || 0;
  const gstPercent = useWatch({ control, name: "gstPercent" }) ?? 18;

  useEffect(() => {
    const qty = Number(orderedQtyMT) || 0;
    const rate = Number(ratePerMT) || 0;
    const gst = Number(gstPercent) || 0;

    const basic = Number((qty * rate).toFixed(2));
    const total = Number((basic * (1 + gst / 100)).toFixed(2));

    setValue("basicAmount", basic, { shouldValidate: true });
    setValue("totalAmount", total, { shouldValidate: true });
  }, [orderedQtyMT, ratePerMT, gstPercent, setValue]);

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    control,
    setError,
    setValue,
    watch,
  };
}
