import { useActiveOfficeLevelsQuery } from "auth/features/master/office-level/queries";
import type { UseFormSetValue } from "react-hook-form";
import { useClearFieldOnChange } from "shared/hooks/useClearFieldOnChange";

export const officeLevelRank = {
  supervisingOffice: 2,
  division: 2,
  district: 3,
  project: 4,
  sector: 5,
  anganwadi: 6,
} as const;

export function getOfficeLevelRank(
  officeLevelId: number | undefined,
  levels: Master.OfficeLevelList[],
): number {
  if (officeLevelId == null) return 0;
  const index = levels.findIndex((l) => l.officeLevelId === officeLevelId);
  return index === -1 ? 0 : index + 1;
}

export function useOfficeLevelVisibility(
  officeLevelId: number | undefined,
  setValue: UseFormSetValue<Master.OfficeForm>,
) {
  const { data: levels = [] } = useActiveOfficeLevelsQuery(!!officeLevelId);

  const rank = getOfficeLevelRank(officeLevelId, levels);

  useClearFieldOnChange(officeLevelId, "supervisingOfficeId", setValue);
  useClearFieldOnChange(officeLevelId, "divisionId", setValue);
  useClearFieldOnChange(officeLevelId, "districtId", setValue);
  useClearFieldOnChange(officeLevelId, "projectId", setValue);
  useClearFieldOnChange(officeLevelId, "sectorId", setValue);

  const supervisingLevelId =
    rank >= officeLevelRank.supervisingOffice
      ? levels[rank - 2]?.officeLevelId
      : undefined;

  return {
    showSupervisingOffice: rank >= officeLevelRank.supervisingOffice,
    showDivision: rank >= officeLevelRank.division,
    showDistrict: rank >= officeLevelRank.district,
    showProject: rank >= officeLevelRank.project,
    showSector: rank >= officeLevelRank.sector,
    supervisingLevelId,
    rank,
  };
}
