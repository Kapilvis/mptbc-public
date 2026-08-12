import SelectDomain from "auth/features/components/SelectDomains";
import SelectRights from "auth/features/components/SelectRights";
import SelectRoles from "auth/features/components/SelectRoles";
import { useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import { InputPanel } from "shared/components/panels";
import { useRolePermissionForm } from "./form.hook";

interface Props {
  onSearch: (data: UserManagement.RolePermissionForm) => void;
  onReset?: () => void;
  fetchData?: Forms.FetchDataFunc<UserManagement.RolePermissionForm>;
  isLoading?: boolean;
}

export default function RolePermissionForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  const { register, handleSubmit, reset } = useRolePermissionForm(
    async (data) => props.onSearch(data),
    props.fetchData,
  );

  const handleReset = () => {
    reset();
    setFormKey((prev) => prev + 1);
    props.onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} key={formKey}>
      <InputPanel orientation="horizontal" className="grid-3">
        <SelectRoles required {...register("roleName")} />
        <SelectDomain required {...register("domain")} />
        <SelectRights required {...register("action")} />

        <ButtonPanel>
          <Button
            label="Search"
            type="submit"
            isLoading={props.isLoading}
            icon="pi pi-search"
            size="small"
          />
          <Button
            type="button"
            label="Reset"
            icon="pi pi-refresh"
            isLoading={props.isLoading}
            onClick={handleReset}
          />
        </ButtonPanel>
      </InputPanel>
    </form>
  );
}
