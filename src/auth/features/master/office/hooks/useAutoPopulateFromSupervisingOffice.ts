import { useEffect, useRef } from "react";
import type { PathValue, UseFormSetValue } from "react-hook-form";
import { useActiveOfficesQuery } from "../queries";

type OfficeLocationField =
  | "divisionId"
  | "districtId"
  | "projectId"
  | "sectorId";

/**
 * When a supervising office is selected, copies its location fields (division, district, project, sector)
 * into the current form. Fields are cleared when the selection is removed.
 */
export function useAutoPopulateFromSupervisingOffice(
  supervisingOfficeId: number | undefined,
  setValue: UseFormSetValue<Master.OfficeForm>,
) {
  const { data: offices = [] } = useActiveOfficesQuery();

  // Ref avoids re-triggering the effect when office data loads after the form prefills
  const officesRef = useRef(offices);
  officesRef.current = offices;

  useEffect(() => {
    const setField = (field: OfficeLocationField, value: number | undefined) =>
      setValue(field, value as PathValue<Master.OfficeForm, typeof field>);

    if (!supervisingOfficeId) {
      setField("divisionId", undefined);
      setField("districtId", undefined);
      setField("projectId", undefined);
      setField("sectorId", undefined);
      return;
    }

    const office = officesRef.current.find(
      (o) => o.officeId === supervisingOfficeId,
    );
    if (!office) return;

    // Only override fields the supervising office has set, so existing backend values are preserved
    if (office.divisionId != null) setField("divisionId", office.divisionId);
    if (office.districtId != null) setField("districtId", office.districtId);
    if (office.projectId != null) setField("projectId", office.projectId);
    if (office.sectorId != null) setField("sectorId", office.sectorId);
  }, [supervisingOfficeId, setValue]);

  // Derive disabled flags reactively so dependent dropdowns are locked when auto-filled
  const supervisingOffice = offices.find(
    (o) => o.officeId === supervisingOfficeId,
  );

  return {
    filledBySupervising: {
      divisionId: !!supervisingOffice?.divisionId,
      districtId: !!supervisingOffice?.districtId,
      projectId: !!supervisingOffice?.projectId,
      sectorId: !!supervisingOffice?.sectorId,
    },
  };
}
