import type { FieldValues } from "react-hook-form";
import { DropDownList } from "shared/components/forms";
import { useActiveQualificationSubjectsQuery } from "../master/qualification-subject/queries";

export default function SelectQualificationSubject<T extends FieldValues>({
  label = "Qualification Subject",
  ...props
}: Controls.FormProps<T> & {
  label?: string;
}) {
  const { data, isLoading } = useActiveQualificationSubjectsQuery();

  return (
    <DropDownList
      data={data}
      required
      loading={isLoading}
      textField="name"
      optionValue="qualificationSubjectId"
      placeholder="Select Qualification Subject"
      label={label}
      {...props}
    />
  );
}
