import { useEffect, useMemo } from "react";
import {
  TextBox,
  CheckBox,
  DropDownList,
  NumberBox,
  TextArea,
} from "shared/components/forms";
import { InputPanel, Card } from "shared/components/panels";
import { Button, ButtonPanel } from "shared/components/buttons";
import { useDepotRegistrationForm } from "./form.hook";
import { getDepots } from "auth/features/master/depot/data";
import { getSubDepots } from "auth/features/master/sub-depot/data";
import { mockDistricts } from "auth/features/master/district/data";
import { getDepotRegistrations } from "../data";

interface DepotRegistrationFormProps {
  onSubmit: (
    data: DepotRegistration.RegistrationForm,
    resetForm?: () => void,
  ) => Promise<void>;
  fetchData?: DepotRegistration.Registration;
  isSaving?: boolean;
  isEditMode?: boolean;
  onCancel: () => void;
}

export default function DepotRegistrationForm({
  onSubmit,
  fetchData,
  isSaving,
  isEditMode = false,
  onCancel,
}: DepotRegistrationFormProps) {
  // 1. Resolve active dropdown choices
  const depotOptions = useMemo(() => {
    return getDepots()
      .filter((d) => d.isActive)
      .map((d) => ({ label: d.name, value: d.depotId }));
  }, []);

  const subDepotOptionsList = useMemo(() => {
    return getSubDepots()
      .filter((sd) => sd.isActive)
      .map((sd) => ({
        label: sd.name,
        value: sd.subDepotId,
        depotId: sd.depotId,
      }));
  }, []);

  const districtOptions = useMemo(() => {
    return mockDistricts
      .filter((d) => d.isActive)
      .map((d) => ({ label: d.name, value: d.districtId }));
  }, []);

  const typeOptions = [
    { label: "Central", value: "Central" },
    { label: "Regional", value: "Regional" },
    { label: "District", value: "District" },
    { label: "Sub Depot", value: "SubDepot" },
  ];

  // 2. Submit callback with Duplicate Check
  const handleFormSubmit = async (data: DepotRegistration.RegistrationForm) => {
    const list = getDepotRegistrations();
    const isDuplicate = list.some(
      (r) =>
        r.dptName.trim().toUpperCase() === data.dptName.trim().toUpperCase() &&
        r.districtId === Number(data.districtId) &&
        r.type === data.type &&
        r.depotRegistrationId !== fetchData?.depotRegistrationId,
    );

    if (isDuplicate) {
      setError("dptName", {
        type: "manual",
        message:
          "Duplicate profile: Combination of DPT Name + District + Type already exists.",
      });
      return;
    }

    await onSubmit(data);
  };

  const { handleSubmit, control, watch, setValue, setError, reset } =
    useDepotRegistrationForm(fetchData);

  const selectedDepotId = watch("depotId");
  const selectedType = watch("type");

  // Dynamically filter Sub Depots based on selected parent Depot
  const filteredSubDepots = useMemo(() => {
    if (!selectedDepotId) return [];
    return subDepotOptionsList.filter(
      (sd) => sd.depotId === Number(selectedDepotId),
    );
  }, [selectedDepotId, subDepotOptionsList]);

  // Clean or toggle Sub Depot field based on selected Type
  useEffect(() => {
    if (selectedType === "Central") {
      setValue("subDepotId", undefined);
    }
  }, [selectedType, setValue]);

  const isSubDepotDisabled = selectedType === "Central" || !selectedDepotId;
  const isSubDepotRequired = selectedType === "SubDepot";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 1. Depot Information Card */}
      <Card className="p-5 border border-slate-100 shadow-xs">
        <div className="border-l-4 border-indigo-600 pl-3 mb-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Warehouse / Depot Information
          </h3>
        </div>
        <InputPanel orientation="horizontal">
          <TextBox
            label="DPT Name"
            name="dptName"
            control={control}
            required
            placeholder="Enter Display Name"
          />
          <DropDownList
            label="Depot"
            name="depotId"
            control={control}
            required
            data={depotOptions}
            textField="label"
            optionValue="value"
            placeholder="Select Parent Depot"
          />
          <DropDownList
            label="Type"
            name="type"
            control={control}
            required
            data={typeOptions}
            textField="label"
            optionValue="value"
            placeholder="Select Depot Type"
          />
          <DropDownList
            label="Sub DPT"
            name="subDepotId"
            control={control}
            required={isSubDepotRequired}
            disabled={isSubDepotDisabled}
            data={filteredSubDepots}
            textField="label"
            optionValue="value"
            placeholder={
              selectedType === "Central"
                ? "Not applicable for Central"
                : !selectedDepotId
                  ? "Select Depot first"
                  : "Select Sub Depot"
            }
          />
          <DropDownList
            label="Dist."
            name="districtId"
            control={control}
            required
            data={districtOptions}
            textField="label"
            optionValue="value"
            placeholder="Select District"
          />
        </InputPanel>
      </Card>

      {/* 2. Address Information Card */}
      <Card className="p-5 border border-slate-100 shadow-xs">
        <div className="border-l-4 border-indigo-600 pl-3 mb-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Address Details
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TextArea
              label="Addr."
              name="address"
              control={control}
              required
              rows={3}
              placeholder="Enter Full Warehouse Address"
            />
          </div>
          <div>
            <TextBox
              label="PIN"
              name="pin"
              control={control}
              required
              keyfilter="num"
              maxLength={6}
              placeholder="6-digit postal code"
            />
          </div>
        </div>
      </Card>

      {/* 3. Contact Information Card */}
      <Card className="p-5 border border-slate-100 shadow-xs">
        <div className="border-l-4 border-indigo-600 pl-3 mb-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Contact & Manager Information
          </h3>
        </div>
        <InputPanel orientation="horizontal">
          <TextBox
            label="Incharge"
            name="incharge"
            control={control}
            required
            placeholder="Manager / Incharge Name"
          />
          <TextBox
            label="Mobile"
            name="mobile"
            control={control}
            required
            keyfilter="num"
            maxLength={10}
            placeholder="10-digit mobile number"
          />
          <TextBox
            label="Email"
            name="email"
            control={control}
            placeholder="Official email address"
          />
          {isEditMode && (
            <div className="flex items-center h-full pt-6">
              <CheckBox
                label="Active Status"
                name="isActive"
                control={control}
              />
            </div>
          )}
        </InputPanel>
      </Card>

      {/* 4. Storage Information Card */}
      <Card className="p-5 border border-slate-100 shadow-xs">
        <div className="border-l-4 border-indigo-600 pl-3 mb-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Storage & capacity
          </h3>
        </div>
        <InputPanel orientation="horizontal">
          <NumberBox
            label="Capacity"
            name="capacity"
            control={control}
            min={0}
            placeholder="Books count / MT capacity"
          />
          <NumberBox
            label="Godowns"
            name="godowns"
            control={control}
            min={0}
            placeholder="Number of storage rooms"
          />
        </InputPanel>
      </Card>

      <ButtonPanel>
        <Button
          type="button"
          label="Cancel"
          icon="times"
          variant="outlined"
          onClick={onCancel}
          className="font-bold text-xs text-slate-600 border-slate-300 hover:bg-slate-50"
        />
        <Button
          type="button"
          label="Reset"
          icon="refresh"
          variant="outlined"
          onClick={() => reset({ isActive: true })}
          className="font-bold text-xs text-slate-600 border-slate-300 hover:bg-slate-50"
        />
        <Button
          label={isEditMode ? "Update" : "Save"}
          type="submit"
          icon="save"
          variant="primary"
          isLoading={isSaving}
          className="font-bold text-xs shadow-xs"
        />
      </ButtonPanel>
    </form>
  );
}
