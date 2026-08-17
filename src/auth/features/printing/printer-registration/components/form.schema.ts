import validation from "shared/utils/validation";

export const schema = validation.create<Printer.RegistrationForm>((o) => ({
  // Step 1 — Printer & Authorized Person Details
  printerName: o.string().required().label("Printer / Press Name"),
  firmRegistrationNo: o.string().required().label("Firm Registration Number"),
  printerType: o.string().required().label("Printer Category / Type"),
  gstinNo: o
    .string()
    .required()
    .length(15)
    .messages({ "string.length": "GSTIN must be exactly 15 characters" })
    .label("GSTIN Number"),
  panNo: o
    .string()
    .required()
    .length(10)
    .messages({ "string.length": "PAN must be exactly 10 characters" })
    .label("PAN Number"),
  ownerName: o.string().required().label("Firm Owner Name"),
  licenseCertificateUrl: o
    .string()
    .required()
    .label("License / Registration Certificate"),

  authPersonName: o.string().required().label("Authorized Person Name"),
  designation: o.string().required().label("Designation / Role"),
  mobileNo: o
    .string()
    .required()
    .pattern(/^\d{10}$/)
    .messages({
      "string.pattern.base": "Mobile Number must be exactly 10 digits",
    })
    .label("Mobile Number"),
  email: o
    .string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({ "string.email": "Email Address must be a valid email format" })
    .label("Email Address"),

  // Step 2 — Address Details
  addressLine1: o.string().required().label("Address Line 1"),
  addressLine2: o.string().optional().allow("", null).label("Address Line 2"),
  landmark: o.string().optional().allow("", null).label("Landmark"),
  stateId: o.number().required().label("State"),
  districtId: o.number().required().label("District"),
  cityId: o.number().required().label("City / Town"),
  pinCode: o
    .string()
    .required()
    .pattern(/^\d{6}$/)
    .messages({ "string.pattern.base": "PIN Code must be exactly 6 digits" })
    .label("PIN Code"),

  // Step 3 — Machine Infrastructure
  machines: o
    .array()
    .items(
      o.object({
        id: o.string().optional(),
        machineType: o
          .string()
          .valid("sheetfed", "web")
          .required()
          .label("Machine Type"),
        size: o.string().optional().allow("", null).label("Size"),
        cutoff: o.string().optional().allow("", null).label("Cutoff"),
        yearOfManufacture: o
          .number()
          .required()
          .integer()
          .min(1800)
          .max(new Date().getFullYear())
          .label("Year of Manufacture"),
        ageOfMachine: o.number().optional().allow(null).label("Age of Machine"),
        colorConfiguration: o
          .string()
          .valid("single", "double", "multi")
          .required()
          .label("Color Configuration"),
        sidCapacity120Days: o
          .number()
          .required()
          .min(0)
          .label("SID Capacity for 120 Days"),
        cpcAutomatic: o
          .string()
          .valid("cpc", "automatic", "manual")
          .optional()
          .allow(null, "")
          .label("CPC / Automatic"),
        calculatedCapacity1Color: o
          .number()
          .optional()
          .allow(null)
          .min(0)
          .label("Calculated Capacity 1 Color"),
        calculatedCapacity2Color: o
          .number()
          .optional()
          .allow(null)
          .min(0)
          .label("Calculated Capacity 2 Color"),
        calculatedCapacity4Color: o
          .number()
          .optional()
          .allow(null)
          .min(0)
          .label("Calculated Capacity 4 Color"),
        remark: o.string().optional().allow("", null).label("Remark"),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.min":
        "At least one machine must be added to infrastructure details",
    })
    .label("Machines"),
}));
