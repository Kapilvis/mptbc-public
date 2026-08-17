import validation from "shared/utils/validation";

export const bookPaperRequirementSchema =
  validation.create<BookPaperRequirement.Form>((o) => ({
    title: o
      .string()
      .required()
      .min(3)
      .messages({
        "any.required": "Title is required",
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters",
      })
      .label("Title"),
    numberOfBooks: o
      .number()
      .required()
      .greater(0)
      .messages({
        "any.required": "Number of Books is required",
        "number.base": "Number of Books is required",
        "number.greater": "Number of Books must be greater than 0",
      })
      .label("Number of Books"),
    pagesPerBook: o
      .number()
      .required()
      .greater(0)
      .messages({
        "any.required": "Pages (Single Book) is required",
        "number.base": "Pages (Single Book) is required",
        "number.greater": "Pages (Single Book) must be greater than 0",
      })
      .label("Pages (Single Book)"),
    pagesGsmId: o
      .number()
      .required()
      .messages({
        "any.required": "Pages GSM is required",
        "number.base": "Pages GSM is required",
      })
      .label("Pages GSM"),
    coverGsmId: o
      .number()
      .required()
      .messages({
        "any.required": "Cover GSM is required",
        "number.base": "Cover GSM is required",
      })
      .label("Cover GSM"),
  }));
