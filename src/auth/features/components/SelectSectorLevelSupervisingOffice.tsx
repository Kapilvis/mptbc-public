import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveOfficeLevelsQuery } from "../master/office-level/queries";
import { officeLevelRank } from "../master/office/hooks/useOfficeLevelVisibility";
import { useActiveOfficesQuery } from "../master/office/queries";

interface SelectSectorLevelSupervisingOfficeProps {
  label?: string;
  required?: boolean;
}

export default function SelectSectorLevelSupervisingOffice<
  T extends FieldValues,
>({
  label = "Supervising Office",
  ...props
}: Controls.FormProps<T> & SelectSectorLevelSupervisingOfficeProps) {
  const { data: levels = [] } = useActiveOfficeLevelsQuery();
  const sectorLevelId = levels[officeLevelRank.sector - 1]?.officeLevelId;

  const { data: offices = [], isLoading } =
    useActiveOfficesQuery(!!sectorLevelId);

  const filtered = sectorLevelId
    ? offices.filter((o) => o.officeLevelId === sectorLevelId)
    : [];

  return (
    <DropDownList
      data={filtered}
      loading={isLoading}
      textField={"name"}
      optionValue={"officeId"}
      label={label}
      placeholder="Select Supervising Office"
      {...props}
    />
  );
}
