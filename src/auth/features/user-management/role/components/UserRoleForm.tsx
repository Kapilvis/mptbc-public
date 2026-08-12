import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import InputPanel from "shared/components/panels/InputPanel";
import { useUserRoleForm } from "./form.hook";

interface Props {
  onSubmit: (data: UserManagement.UserRoleForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<UserManagement.UserRoleForm>;
  isSaving: boolean;
  isEditMode?: boolean;
}

export default function UserRoleForm(props: Props) {
  const { register, handleSubmit, reset } = useUserRoleForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Role Name"
          required
          {...register("name")}
          placeholder="Enter Role Name"
        />
        <TextBox
          label="Description"
          required
          {...register("description")}
          placeholder="Enter description"
        />
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
          onClick={() => reset()}
        />
      </ButtonPanel>
    </form>
  );
}
