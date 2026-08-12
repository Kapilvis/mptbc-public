import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import InputPanel from "shared/components/panels/InputPanel";
import { useUserForm } from "./form.hooks";

interface Props {
  onSubmit: (data: UserManagement.UserForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<UserManagement.UserForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function UserForm(props: Props) {
  const { register, handleSubmit, reset } = useUserForm(
    props.onSubmit,
    props.fetchData,
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="User Name"
          required
          {...register("userName")}
          placeholder="Enter User Name"
        />
        <TextBox
          label="First Name"
          required
          {...register("firstName")}
          placeholder="Enter First Name"
        />
        <TextBox
          label="Last Name"
          {...register("lastName")}
          placeholder="Enter Last Name"
        />
        <TextBox
          label="Email"
          required
          {...register("email")}
          placeholder="Enter Email"
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
