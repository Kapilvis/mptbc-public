import validation from "shared/utils/validation";

export const schema = validation.create<DepotRegistration.RegistrationForm>(
  (o) => ({
    dptName: o.string().required().min(3).max(100).label("DPT Name"),

    depotId: o.number().required().label("Depot"),

    subDepotId: o
      .number()
      .when("type", {
        is: "Sub Depot",
        then: o.number().required(),
        otherwise: o.number().optional().allow(null, ""),
      })
      .label("Sub Depot"),

    districtId: o.number().required().label("District"),

    type: o
      .string()
      .valid("Central", "Regional", "District", "Sub Depot")
      .required()
      .label("Type"),

    address: o.string().required().min(5).label("Address"),

    pin: o
      .string()
      .required()
      .pattern(/^\d{6}$/)
      .messages({
        "string.pattern.base": "PIN Code must be exactly 6 digits",
      })
      .label("PIN"),

    incharge: o.string().required().min(3).max(100).label("Incharge"),

    mobile: o
      .string()
      .required()
      .pattern(/^\d{10}$/)
      .messages({
        "string.pattern.base": "Mobile Number must be exactly 10 digits",
      })
      .label("Mobile"),

    email: o
      .string()
      .email({ tlds: { allow: false } })
      .optional()
      .allow("", null)
      .messages({
        "string.email": "Email Address must be in a valid format",
      })
      .label("Email"),

    capacity: o
      .number()
      .positive()
      .optional()
      .allow(null, "")
      .label("Capacity"),

    godowns: o
      .number()
      .integer()
      .min(0)
      .optional()
      .allow(null, "")
      .label("Godowns"),

    isActive: o.boolean().required().label("Active"),
  }),
);
