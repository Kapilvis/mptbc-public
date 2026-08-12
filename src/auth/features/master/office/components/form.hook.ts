import { useActiveOfficeLevelsQuery } from "auth/features/master/office-level/queries";
import { useFormServerError } from "auth/hooks/useFormServerError";
import { errors } from "config/errors";
import type Joi from "joi";
import { useMemo } from "react";
import { useAppForm } from "shared/hooks/form";
import validation from "shared/utils/validation";
import { expressions } from "shared/utils/validation/config";
import {
  getOfficeLevelRank,
  officeLevelRank,
} from "../hooks/useOfficeLevelVisibility";

function optionalField<T extends Joi.AnySchema>(o: T): T {
  return o.optional().allow("", null) as T;
}

export function useOfficeForm(
  submitCallback: Forms.SubmitFunc<Master.OfficeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.OfficeForm>,
  officeLevelId?: number,
) {
  const { data: levels = [] } = useActiveOfficeLevelsQuery(!!officeLevelId);
  const rank = getOfficeLevelRank(officeLevelId, levels);

  const schema = useMemo(
    () =>
      validation.create<Master.OfficeForm>((o) => ({
        name: o
          .string()
          .required()
          .pattern(expressions.englishOnly)
          .messages({ "string.pattern.base": errors.englishOnly })
          .label("Office Name")
          .max(50),
        localName: o
          .string()
          .optional()
          .allow("", null)
          .pattern(expressions.hindiOnly)
          .messages({ "string.pattern.base": errors.hindiOnly })
          .label("Local Name")
          .max(50),
        code: o
          .string()
          .required()
          .pattern(expressions.alphaNumericOnly)
          .messages({ "string.pattern.base": errors.alphaNumericOnly })
          .label("Office Code")
          .max(11),
        officeLevelId: o.number().required().label("Office Level"),
        officeTypeId: o.number().empty(null).required().label("Office Type"),
        supervisingOfficeId:
          rank >= officeLevelRank.supervisingOffice
            ? o.number().empty(null).required().label("Supervising Office")
            : optionalField(o.number()).label("Supervising Office"),
        divisionId:
          rank >= officeLevelRank.division
            ? o.number().empty(null).required().label("Division")
            : optionalField(o.number()).label("Division"),
        districtId:
          rank >= officeLevelRank.district
            ? o.number().empty(null).required().label("District")
            : optionalField(o.number()).label("District"),
        projectId:
          rank >= officeLevelRank.project
            ? o.number().empty(null).required().label("Project")
            : optionalField(o.number()).label("Project"),
        sectorId:
          rank >= officeLevelRank.sector
            ? o.number().empty(null).required().label("Sector")
            : optionalField(o.number()).label("Sector"),
      })),
    [rank],
  );

  const form = useAppForm<Master.OfficeForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, watch, setValue } = form;

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    watch,
    setValue,
  };
}
