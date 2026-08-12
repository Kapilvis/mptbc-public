import SelectDistrict from "auth/features/components/SelectDistrict";
import SelectDivision from "auth/features/components/SelectDivision";
import SelectOfficeLevel from "auth/features/components/SelectOfficeLevel";
import SelectOfficeType from "auth/features/components/SelectOfficeType";
import SelectProject from "auth/features/components/SelectProject";
import SelectSector from "auth/features/components/SelectSector";
import SelectSupervisingOffice from "auth/features/components/SelectSupervisingOffice";
import { useEffect, useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import { TextBox } from "shared/components/forms";
import { InputPanel } from "shared/components/panels";
import { useAutoPopulateFromSupervisingOffice } from "../hooks/useAutoPopulateFromSupervisingOffice";
import { useOfficeLevelVisibility } from "../hooks/useOfficeLevelVisibility";
import { useOfficeForm } from "./form.hook";

interface Props {
  onSubmit: (data: Master.OfficeForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.OfficeForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function OfficeForm(props: Props) {
  const [resolvedLevelId, setResolvedLevelId] = useState<number>();

  const { register, handleSubmit, reset, watch, setValue } = useOfficeForm(
    props.onSubmit,
    props.fetchData,
    resolvedLevelId,
  );

  const officeLevelId = watch("officeLevelId");

  useEffect(() => {
    setResolvedLevelId(officeLevelId);
  }, [officeLevelId]);

  const supervisingOfficeId = watch("supervisingOfficeId");
  const divisionId = watch("divisionId");
  const districtId = watch("districtId");
  const projectId = watch("projectId");

  const {
    showSupervisingOffice,
    showDivision,
    showDistrict,
    showProject,
    showSector,
    supervisingLevelId,
  } = useOfficeLevelVisibility(officeLevelId, setValue);

  const { filledBySupervising } = useAutoPopulateFromSupervisingOffice(
    supervisingOfficeId,
    setValue,
  );

  const handleReset = () => {
    reset();
    setResolvedLevelId(undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputPanel orientation="horizontal">
        <TextBox
          label="Office Name"
          subLabel="(In English)"
          required
          {...register("name")}
          placeholder="Enter Office Name"
        />
        <TextBox
          label="Office Name"
          subLabel="(In Hindi)"
          {...register("localName")}
          placeholder="Enter Office Name (Hindi)"
        />
        <TextBox
          label="Office Code"
          required
          {...register("code")}
          placeholder="Enter Office Code"
        />
        <SelectOfficeLevel {...register("officeLevelId")} />
        <SelectOfficeType
          label="Office Type"
          required
          officeLevelId={officeLevelId}
          {...register("officeTypeId")}
        />
        {showSupervisingOffice && (
          <SelectSupervisingOffice
            {...register("supervisingOfficeId")}
            label="Supervising Office"
            supervisingLevelId={supervisingLevelId}
          />
        )}

        {showDivision && (
          <SelectDivision
            {...register("divisionId")}
            required
            disabled={filledBySupervising.divisionId}
          />
        )}

        {showDistrict && (
          <SelectDistrict
            {...register("districtId")}
            divisionId={divisionId}
            required
            disabled={filledBySupervising.districtId}
          />
        )}

        {showProject && (
          <SelectProject
            {...register("projectId")}
            districtId={districtId}
            required
            disabled={filledBySupervising.projectId}
          />
        )}

        {showSector && (
          <SelectSector
            {...register("sectorId")}
            projectId={projectId}
            required
            disabled={filledBySupervising.sectorId}
          />
        )}
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
          onClick={handleReset}
        />
      </ButtonPanel>
    </form>
  );
}
