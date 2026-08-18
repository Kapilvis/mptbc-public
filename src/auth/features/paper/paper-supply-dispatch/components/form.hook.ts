import { useEffect } from "react";
import { useFormServerError } from "auth/hooks/useFormServerError";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<PaperSupplyDispatch.PaperDispatchForm>(
  (o) => ({
    dispatchDate: o.any().required().label("Dispatch Date"),
    orderNo: o.string().required().label("Paper Order Number"),
    orderDate: o.any().optional().allow("", null).label("Order Date"),
    paperType: o.string().required().label("Paper Specification"),
    vendorId: o.number().optional().allow(null, "").label("Vendor ID"),
    paperMillName: o.string().optional().allow("", null).label("Paper Mill"),
    consigneeName: o.string().required().label("Printer / Consignee Name"),
    godownName: o.string().required().label("Godown / Warehouse"),
    reelCount: o.number().required().min(1).label("Reel / Bundle Count"),
    totalWeightTon: o
      .number()
      .required()
      .min(0.001)
      .messages({
        "any.required": "Total Weight in Ton is required",
        "number.min": "Total Weight must be greater than 0",
      })
      .label("Total Weight in Ton"),
    challanNo: o.string().required().label("Challan Number"),
    challanDate: o.any().required().label("Challan Date"),
    truckNo: o.string().required().label("Truck Number"),
    driverName: o.string().required().label("Driver Name"),
    driverMobile: o.string().required().label("Driver Mobile No."),
    grNo: o.string().optional().allow("", null).label("G.R. Number"),
    grDate: o.any().optional().allow("", null).label("G.R. Date"),
    remarks: o.string().optional().allow("", null).label("Remarks"),
    challanCopyPath: o
      .string()
      .optional()
      .allow("", null)
      .label("Challan Soft Copy"),
  }),
);

export function usePaperDispatchForm(
  submitCallback: Forms.SubmitFunc<PaperSupplyDispatch.PaperDispatchForm>,
  defaultValues?: Forms.FetchDataFunc<PaperSupplyDispatch.PaperDispatchForm>,
) {
  const form = useAppForm<PaperSupplyDispatch.PaperDispatchForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, control, setError, setValue, watch } =
    form;

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as PaperSupplyDispatch.PaperDispatchForm);
    }
  }, [defaultValues, reset]);

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
