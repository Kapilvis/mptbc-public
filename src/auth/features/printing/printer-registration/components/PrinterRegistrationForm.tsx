import { useEffect, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { FormWizard } from "shared/components/forms";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { usePrinterRegistrationForm } from "./form.hook";

import { states, districts, cities } from "../data";
import "./PrinterRegistrationForm.css";

interface PrinterRegistrationFormProps {
  onSubmit: (data: Printer.Registration) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Printer.Registration>;
  isSaving?: boolean;
}

export default function PrinterRegistrationForm({
  onSubmit,
  fetchData,
  isSaving,
}: PrinterRegistrationFormProps) {
  // Mapped initial default values resolver for Edit mode
  const getMappedDefaultValues = async (): Promise<
    Partial<Printer.RegistrationForm>
  > => {
    if (!fetchData)
      return {
        machines: [],
      };
    const printer =
      typeof fetchData === "function" ? await fetchData() : fetchData;
    if (!printer)
      return {
        machines: [],
      };

    const resolvedState = states.find((s) => s.text === printer.state);
    const resolvedDistrict = districts.find((d) => d.text === printer.district);
    const resolvedCity = cities.find((c) => c.text === printer.city);

    return {
      ...printer,
      stateId: resolvedState?.id,
      districtId: resolvedDistrict?.id,
      cityId: resolvedCity?.id,
      machines: (printer.machines ?? []) as Printer.MachineDetail[],
    };
  };

  const handleFormSubmit = async (form: Printer.RegistrationForm) => {
    const resolvedState = states.find((s) => s.id === form.stateId)?.text ?? "";
    const resolvedDistrict =
      districts.find((d) => d.id === form.districtId)?.text ?? "";
    const resolvedCity = cities.find((c) => c.id === form.cityId)?.text ?? "";

    const registration: Printer.Registration = {
      ...form,
      printerId: 0,
      state: resolvedState,
      district: resolvedDistrict,
      city: resolvedCity,
      isActive: true,
    };
    await onSubmit(registration);
  };

  const { control, handleSubmit, watch, setValue, formState } =
    usePrinterRegistrationForm(handleFormSubmit, getMappedDefaultValues);

  const {
    fields: machinesList,
    append: appendMachine,
    remove: removeMachine,
    update: updateMachine,
  } = useFieldArray({ control, name: "machines" });

  // Cascading dropdowns — Office Address
  const stateId = watch("stateId");
  const districtId = watch("districtId");

  const filteredDistricts = useMemo(
    () => districts.filter((d) => d.stateId === Number(stateId)),
    [stateId],
  );
  const filteredCities = useMemo(
    () => cities.filter((c) => c.districtId === Number(districtId)),
    [districtId],
  );

  // Clean dependent selects on state/district change
  useEffect(() => {
    const subscription = watch(
      (_value: unknown, { name }: { name?: string }) => {
        if (name === "stateId") {
          setValue("districtId", undefined as unknown as number);
          setValue("cityId", undefined as unknown as number);
        } else if (name === "districtId") {
          setValue("cityId", undefined as unknown as number);
        }
      },
    );
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const machinesError = formState.errors.machines?.message as
    | string
    | undefined;

  const steps = [
    {
      label: "Profile",
      icon: "building",
      content: <Step1 control={control} />,
    },
    {
      label: "Address",
      icon: "map-marker",
      content: (
        <Step2
          control={control}
          stateId={stateId}
          districtId={districtId}
          filteredDistricts={filteredDistricts}
          filteredCities={filteredCities}
        />
      ),
    },
    {
      label: "Machines",
      icon: "cog",
      content: (
        <Step3
          machinesList={machinesList as Printer.MachineDetail[]}
          appendMachine={appendMachine}
          removeMachine={removeMachine}
          updateMachine={updateMachine}
          errorMessage={machinesError}
        />
      ),
    },
  ];

  return (
    <FormWizard
      steps={steps}
      onComplete={handleSubmit}
      isSaving={isSaving}
      isEdit={true}
    />
  );
}
