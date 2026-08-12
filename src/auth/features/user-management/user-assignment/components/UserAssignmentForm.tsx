import SelectDomain from "auth/features/components/SelectDomains";
import SelectRoles from "auth/features/components/SelectRoles";
import SelectUsers from "auth/features/components/SelectUsers";
import { Button, ButtonPanel } from "shared/components/buttons";
import { MosaicForm } from "shared/components/mosaic";
import { InputPanel } from "shared/components/panels";
import { useUserAssignmentForm } from "./form.hook";

interface Props {
  onSubmit: (data: UserManagement.UserAssignmentForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<UserManagement.UserAssignmentForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function UserAssignmentForm(props: Props) {
  const { register, handleSubmit, reset } = useUserAssignmentForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <MosaicForm onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <SelectUsers
          required
          disabled={props.isEditMode}
          {...register("userId")}
        />
        <SelectRoles required {...register("roleName")} />
        <SelectDomain required {...register("domain")} />
      </InputPanel>

      <ButtonPanel>
        <Button
          label={props.isEditMode ? "Update" : "Save"}
          type="submit"
          isLoading={props.isSaving}
          disabled={props.isSaving}
          icon="save"
        />
        <Button
          type="button"
          label={props.isEditMode ? "Reset" : "Clear"}
          icon="refresh"
          isLoading={props.isSaving}
          onClick={() => reset()}
        />
      </ButtonPanel>
    </MosaicForm>
  );
}
