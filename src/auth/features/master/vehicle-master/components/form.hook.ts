import { useFormServerError } from "auth/hooks/useFormServerError";
import type { DefaultValues } from "react-hook-form";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";

const schema = validation.create<Transportation.VehicleForm>((o) => ({
  registrationNo: o
    .string()
    .required()
    .pattern(/^[A-Z]{2}-[0-9]{2}-[A-Z]{1,2}-[0-9]{4}$/)
    .messages({
      "string.pattern.base": "Invalid Registration format (e.g. MP-09-AB-1234)",
    })
    .label("Vehicle Reg. Number"),

  category: o.string().required().label("Vehicle Category"),
  vehicleCategory: o
    .string()
    .optional()
    .allow("", null)
    .label("Commercial Category"),
  subType: o.string().optional().allow("", null).label("Vehicle Sub Type"),
  capacity: o.number().min(0.1).required().label("Capacity (Tons)"),
  model: o.string().required().label("Vehicle Model"),
  manufacturer: o.string().required().label("Manufacturer"),
  manufacturingYear: o
    .number()
    .min(2000)
    .max(new Date().getFullYear())
    .required()
    .label("Manufacturing Year"),
  fuelType: o.string().required().label("Fuel Type"),
  chassisNo: o.string().required().label("Chassis Number"),
  engineNo: o.string().required().label("Engine Number"),

  rcNo: o.string().required().label("RC Number"),
  rcExpiry: o.any().required().label("RC Expiry Date"),

  insuranceNo: o.string().required().label("Insurance Number"),
  insuranceExpiry: o.any().required().label("Insurance Expiry Date"),

  fitnessNo: o.string().required().label("Fitness Certificate No"),
  fitnessExpiry: o.any().required().label("Fitness Expiry Date"),

  permitNo: o.string().required().label("Permit Number"),
  permitExpiry: o.any().required().label("Permit Expiry Date"),

  pucNo: o.string().required().label("PUC Number"),
  pucExpiry: o.any().required().label("PUC Expiry Date"),

  ownershipStatus: o.string().required().label("Ownership Status"),
  leasedAgreementDoc: o.string().when("ownershipStatus", {
    is: "Leased",
    then: o.string().required().label("Lease Agreement Document"),
    otherwise: o
      .string()
      .optional()
      .allow("", null)
      .label("Lease Agreement Document"),
  }),

  rcDoc: o.string().optional().allow("", null).label("RC Document"),
  insuranceDoc: o
    .string()
    .optional()
    .allow("", null)
    .label("Insurance Document"),
  fitnessDoc: o.string().optional().allow("", null).label("Fitness Document"),
  permitDoc: o.string().optional().allow("", null).label("Permit Document"),
  pucDoc: o.string().optional().allow("", null).label("PUC Document"),

  // Optional GPS Telematics validation
  hasGps: o.boolean().optional().allow(null).label("GPS Enabled"),
  gpsProvider: o.string().optional().allow("", null).label("GPS Provider"),
  gpsDeviceId: o
    .string()
    .optional()
    .allow("", null)
    .label("GPS Device ID / IMEI"),
  gpsSimNumber: o.string().optional().allow("", null).label("GPS SIM Number"),
  gpsTrackingUrl: o
    .string()
    .optional()
    .allow("", null)
    .label("GPS Tracking / Telematics URL"),

  transporterId: o.number().required().label("Transporter"),
}));

export function useVehicleRegistrationForm(
  submitCallback: Forms.SubmitFunc<Transportation.VehicleForm>,
  defaultValues?: Partial<Transportation.VehicleForm>,
) {
  const form = useAppForm<Transportation.VehicleForm>({
    defaultValues: (defaultValues ?? {
      ownershipStatus: "Self-Owned",
    }) as unknown as DefaultValues<Transportation.VehicleForm>,
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
