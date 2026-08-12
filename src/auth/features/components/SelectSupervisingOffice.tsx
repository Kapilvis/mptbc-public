import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveOfficesQuery } from "../master/office/queries";

interface SelectSupervisingOfficeProps {
  label?: string;
  required?: boolean;
  supervisingLevelId?: number;
}

export default function SelectSupervisingOffice<T extends FieldValues>({
  label = "Supervising Office",
  supervisingLevelId,
  ...props
}: Controls.FormProps<T> & SelectSupervisingOfficeProps) {
  const { data = [], isLoading } = useActiveOfficesQuery(
    supervisingLevelId === undefined ? true : !!supervisingLevelId,
  );

  const filtered =
    supervisingLevelId === undefined
      ? data
      : data.filter((o) => o.officeLevelId === supervisingLevelId);

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
