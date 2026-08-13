import { useState, useEffect, useMemo } from "react";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { useEmployeeRegistrationForm } from "./form.hook";
import {
  departments,
  designations,
  states,
  districts,
  cities,
  organizationUnits,
} from "../data";
import "./EmployeeForm.css";

interface EmployeeFormProps {
  onSubmit: (data: HRMS.EmployeeRegistration) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<HRMS.EmployeeRegistration>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function EmployeeForm({
  onSubmit,
  fetchData,
  isSaving,
}: EmployeeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Mapped initial default values resolver for Edit mode
  const getMappedDefaultValues = async () => {
    if (!fetchData) return { hasExistingEmployeeCode: "No" };
    const emp = typeof fetchData === "function" ? await fetchData() : fetchData;
    if (!emp) return { hasExistingEmployeeCode: "No" };

    const resolvedState = states.find((s) => s.text === emp.state);
    const resolvedDistrict = districts.find((d) => d.text === emp.district);
    const resolvedCity = cities.find((c) => c.text === emp.city);
    const resolvedOrg = organizationUnits.find(
      (o) => o.text === emp.organizationUnit,
    );
    const resolvedDept = departments.find((d) => d.text === emp.department);
    const resolvedDesig = designations.find((d) => d.text === emp.designation);

    const mapped: Partial<HRMS.EmployeeRegistrationForm> = {
      ...emp,
      hasExistingEmployeeCode: emp.hasExistingEmployeeCode || "No",
      stateId: resolvedState?.id,
      districtId: resolvedDistrict?.id,
      cityId: resolvedCity?.id,
      organizationUnitId: resolvedOrg?.id,
      departmentId: resolvedDept?.id,
      designationId: resolvedDesig?.id,
    };
    return mapped;
  };

  const handleFormSubmit = async (formData: HRMS.EmployeeRegistrationForm) => {
    const resolvedState =
      states.find((s) => s.id === formData.stateId)?.text || "";
    const resolvedDistrict =
      districts.find((d) => d.id === formData.districtId)?.text || "";
    const resolvedCity =
      cities.find((c) => c.id === formData.cityId)?.text || "";
    const resolvedOrg =
      organizationUnits.find((o) => o.id === formData.organizationUnitId)
        ?.text || "";
    const resolvedDept =
      departments.find((d) => d.id === formData.departmentId)?.text || "";
    const resolvedDesig =
      designations.find((d) => d.id === formData.designationId)?.text || "";

    const firstName = formData.firstName || "";
    const middleName = formData.middleName || "";
    const lastName = formData.lastName || "";
    const fullName = [firstName, middleName, lastName]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ");

    const mappedEmployee: HRMS.EmployeeRegistration = {
      ...formData,
      employeeId:
        (formData as unknown as { employeeId: number }).employeeId || 0,
      employeeCode: formData.employeeCode || "",
      salutation: formData.salutation || "",
      hasExistingEmployeeCode: formData.hasExistingEmployeeCode || "No",
      panNumber: formData.panNumber || "",
      nationality: formData.nationality || "",
      category: formData.category || "",
      religion: formData.religion || "",
      maritalStatus: formData.maritalStatus || "",
      bloodGroup: formData.bloodGroup || "",
      physicalDisability: formData.physicalDisability || "",
      criticalIllness: formData.criticalIllness || "",
      campusName: formData.campusName || "",
      state: resolvedState,
      district: resolvedDistrict,
      city: resolvedCity,
      organizationUnit: resolvedOrg,
      department: resolvedDept,
      designation: resolvedDesig,
      fullName,
      employmentStatus: formData.employmentStatus as unknown as
        | "Active"
        | "Inactive",
    };

    await onSubmit(mappedEmployee);
  };

  const { handleSubmit, watch, setValue, control, trigger } =
    useEmployeeRegistrationForm(
      handleFormSubmit,
      getMappedDefaultValues as unknown as Partial<HRMS.EmployeeRegistrationForm>,
    );

  const stateId = watch("stateId");
  const districtId = watch("districtId");

  const filteredDistricts = useMemo(() => {
    if (!stateId) return [];
    return districts.filter((d) => d.stateId === Number(stateId));
  }, [stateId]);

  const filteredCities = useMemo(() => {
    if (!districtId) return [];
    return cities.filter((c) => c.districtId === Number(districtId));
  }, [districtId]);

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === "stateId") {
        setValue("districtId", undefined as unknown as number);
        setValue("cityId", undefined as unknown as number);
      } else if (name === "districtId") {
        setValue("cityId", undefined as unknown as number);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const steps = [
    { number: 1, label: "Identity" },
    { number: 2, label: "Contact & Address" },
    { number: 3, label: "Employment" },
    { number: 4, label: "Emergency & Review" },
  ];

  const handleNext = async () => {
    let fieldsToValidate: (keyof HRMS.EmployeeRegistrationForm)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "hasExistingEmployeeCode",
        "firstName",
        "lastName",
        "gender",
        "dateOfBirth",
        "fatherName",
        "employeeCode",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "mobileNumber",
        "personalEmail",
        "aadhaarNumber",
        "addressLine1",
        "stateId",
        "districtId",
        "cityId",
        "pinCode",
      ];
    } else if (currentStep === 3) {
      fieldsToValidate = [
        "employeeType",
        "natureOfEmployment",
        "organizationUnitId",
        "departmentId",
        "designationId",
        "joiningDate",
        "employmentStatus",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const handleSaveDraft = () => {
    ToastService.success("Employee registration saved as draft.");
  };

  const handleSearchExisting = () => {
    const code = watch("employeeCode");
    if (!code) {
      ToastService.error("Please enter an employee code first");
      return;
    }
    ToastService.success(`Found existing record for ${code}: Rahul Sharma`);
    setValue("firstName", "Rahul");
    setValue("lastName", "Sharma");
    setValue("fatherName", "Mahesh Sharma");
    setValue("gender", "Male");
    setValue("salutation", "Mr.");
  };

  const getDeptText = (id?: number) =>
    departments.find((d) => d.id === Number(id))?.text || "-";

  const getDesigText = (id?: number) =>
    designations.find((d) => d.id === Number(id))?.text || "-";

  const getStateText = (id?: number) =>
    states.find((s) => s.id === Number(id))?.text || "";

  const getDistrictText = (id?: number) =>
    districts.find((d) => d.id === Number(id))?.text || "";

  const getCityText = (id?: number) =>
    cities.find((c) => c.id === Number(id))?.text || "";

  const getFullName = () => {
    const fn = watch("firstName") || "";
    const mn = watch("middleName") || "";
    const ln = watch("lastName") || "";
    return (
      [fn, mn, ln]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" ") || "-"
    );
  };

  const getFullAddress = () => {
    const line1 = watch("addressLine1") || "";
    const line2 = watch("addressLine2") || "";
    const city = getCityText(watch("cityId"));
    const dist = getDistrictText(watch("districtId"));
    const st = getStateText(watch("stateId"));
    const pin = watch("pinCode") || "";
    return (
      [line1, line2, city, dist, st, pin].filter(Boolean).join(", ") || "-"
    );
  };

  const formatDate = (dateVal?: unknown) => {
    if (!dateVal) return "-";
    try {
      const d = new Date(dateVal as string);
      if (isNaN(d.getTime())) return String(dateVal);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div>
      {/* Stepper Header */}
      <div className="stepper-header">
        <div className="stepper-track">
          {steps.map((s, index) => {
            const isCompleted = currentStep > s.number;
            const isActive = currentStep === s.number;

            return (
              <div key={s.number} className="stepper-step">
                <div
                  className="stepper-step-inner"
                  onClick={() => setCurrentStep(s.number)}
                >
                  <div
                    className={`stepper-circle ${isActive ? "active" : isCompleted ? "completed" : "pending"}`}
                  >
                    {isCompleted ? <i className="pi pi-check" /> : s.number}
                  </div>
                  <span
                    className={`stepper-label ${isActive ? "active" : isCompleted ? "completed" : "pending"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="stepper-connector">
                    <div
                      className="stepper-connector-fill"
                      style={{ width: isCompleted ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <Step1
            control={control}
            watch={watch}
            setValue={setValue}
            onSearchExisting={handleSearchExisting}
          />
        )}

        {currentStep === 2 && (
          <Step2
            control={control}
            stateId={stateId}
            districtId={districtId}
            filteredDistricts={filteredDistricts}
            filteredCities={filteredCities}
          />
        )}

        {currentStep === 3 && <Step3 control={control} />}

        {currentStep === 4 && (
          <Step4
            control={control}
            fullName={getFullName()}
            mobileNumber={watch("mobileNumber") || "-"}
            deptText={getDeptText(watch("departmentId"))}
            desigText={getDesigText(watch("designationId"))}
            joiningDateText={formatDate(watch("joiningDate"))}
            statusText={watch("employmentStatus") || "-"}
            addressText={getFullAddress()}
          />
        )}

        {/* Stepper Footer */}
        <div className="stepper-footer">
          <Button
            type="button"
            label="Previous"
            icon="arrow-left"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            variant="outlined"
          />
          <div className="stepper-footer-actions">
            <Button
              type="button"
              label="Save as Draft"
              icon="save"
              onClick={handleSaveDraft}
              variant="text"
            />
            {currentStep < 4 ? (
              <Button
                type="button"
                label="Next"
                icon="arrow-right"
                onClick={handleNext}
                variant="primary"
              />
            ) : (
              <Button
                type="submit"
                label="Submit"
                icon="check"
                disabled={isSaving}
                variant="success"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
