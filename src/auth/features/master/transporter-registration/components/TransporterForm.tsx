import { useState, useEffect, useMemo } from "react";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { useTransporterRegistrationForm } from "./form.hook";
import { states, districts, tehsils } from "../data";
import "./TransporterForm.css";

interface TransporterFormProps {
  onSubmit: (data: Transportation.TransporterRegistration) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Transportation.TransporterRegistration>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function TransporterForm({
  onSubmit,
  fetchData,
  isSaving,
}: TransporterFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [defaultVals, setDefaultVals] = useState<
    Partial<Transportation.TransporterRegistrationForm>
  >({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Mapped initial default values resolver for Edit mode
  useEffect(() => {
    async function loadData() {
      if (!fetchData) return;
      setIsLoadingForm(true);
      try {
        const trans =
          typeof fetchData === "function" ? await fetchData() : fetchData;
        if (trans) {
          const resolvedState = states.find((s) => s.text === trans.state);
          const resolvedDistrict = districts.find(
            (d) => d.text === trans.district,
          );
          const resolvedTehsil = tehsils.find((c) => c.text === trans.tehsil);

          setDefaultVals({
            ...trans,
            stateId: resolvedState?.id || 0,
            districtId: resolvedDistrict?.id || 0,
            tehsilId: resolvedTehsil?.id || 0,
            turnoverFY2223: Number(trans.turnoverFY2223),
            turnoverFY2324: Number(trans.turnoverFY2324),
            turnoverFY2425: Number(trans.turnoverFY2425),
          });
        }
      } catch {
        ToastService.error("Failed to load transporter details");
      } finally {
        setIsLoadingForm(false);
      }
    }
    loadData();
  }, [fetchData]);

  const handleFormSubmit = async (
    formData: Transportation.TransporterRegistrationForm,
  ) => {
    const resolvedState =
      states.find((s) => s.id === Number(formData.stateId))?.text || "";
    const resolvedDistrict =
      districts.find((d) => d.id === Number(formData.districtId))?.text || "";
    const resolvedTehsil =
      tehsils.find((c) => c.id === Number(formData.tehsilId))?.text || "";

    const mappedTransporter: Transportation.TransporterRegistration = {
      ...formData,
      transporterId:
        (formData as unknown as { transporterId: number }).transporterId || 0,
      registrationNo:
        (formData as unknown as { registrationNo: string }).registrationNo ||
        "",
      state: resolvedState,
      district: resolvedDistrict,
      tehsil: resolvedTehsil,
      technicalStatus:
        (
          formData as unknown as {
            technicalStatus: "Pending" | "Qualified" | "NotQualified";
          }
        ).technicalStatus || "Pending",
    };

    await onSubmit(mappedTransporter);
  };

  const { handleSubmit, watch, setValue, control, reset } =
    useTransporterRegistrationForm(handleFormSubmit, defaultVals);

  // Sync default values once they load
  useEffect(() => {
    if (Object.keys(defaultVals).length > 0) {
      reset(defaultVals);
    }
  }, [defaultVals, reset]);

  const stateId = watch("stateId");
  const districtId = watch("districtId");

  const filteredDistricts = useMemo(() => {
    if (!stateId) return [];
    return districts.filter((d) => d.stateId === Number(stateId));
  }, [stateId]);

  const filteredTehsils = useMemo(() => {
    if (!districtId) return [];
    return tehsils.filter((t) => t.districtId === Number(districtId));
  }, [districtId]);

  // Dropdown cascade auto-clearing logic
  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === "stateId") {
        setValue("districtId", undefined as unknown as number);
        setValue("tehsilId", undefined as unknown as number);
      } else if (name === "districtId") {
        setValue("tehsilId", undefined as unknown as number);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const steps = [
    { number: 1, label: "Company Profile" },
    { number: 2, label: "Owner & Representative" },
    { number: 3, label: "Turnover & CA Upload" },
    { number: 4, label: "Review & Submit" },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleSaveDraft = () => {
    ToastService.success("Transporter registration details saved as draft!");
  };

  // Helper text builders for step 3 review card
  const getTransporterTypeText = () => watch("transporterType") || "";
  const getTransporterNameText = () => watch("transporterName") || "";
  const getPanNumberText = () => watch("panNumber") || "";
  const getGstinText = () => watch("gstin") || "";
  const getOwnerNameText = () => watch("ownerName") || "";
  const getMobileText = () => watch("mobile") || "";

  const getFullAddressText = () => {
    const stateText =
      states.find((s) => s.id === Number(watch("stateId")))?.text || "";
    const districtText =
      districts.find((d) => d.id === Number(watch("districtId")))?.text || "";
    const tehsilText =
      tehsils.find((t) => t.id === Number(watch("tehsilId")))?.text || "";
    const pin = watch("pinCode") || "";
    return (
      [tehsilText, districtText, stateText, pin].filter(Boolean).join(", ") ||
      "-"
    );
  };

  if (isLoadingForm) return <Loader type="relative" />;

  return (
    <div>
      {/* Stepper Wizard Header */}
      <div className="stepper-header">
        <div className="stepper-track">
          {steps.map((s, index) => {
            const isCompleted = currentStep > s.number;
            const isActive = currentStep === s.number;

            return (
              <div key={s.number} className="stepper-step">
                <div
                  className="stepper-step-inner"
                  onClick={async () => {
                    // Only allow going backwards or forwards if valid
                    if (s.number < currentStep) {
                      setCurrentStep(s.number);
                    } else if (s.number > currentStep) {
                      // Trigger validation of current step before skipping ahead
                      await handleNext();
                    }
                  }}
                >
                  <div
                    className={`stepper-circle ${
                      isActive
                        ? "active"
                        : isCompleted
                          ? "completed"
                          : "pending"
                    }`}
                  >
                    {isCompleted ? <i className="pi pi-check" /> : s.number}
                  </div>
                  <span
                    className={`stepper-label ${
                      isActive
                        ? "active"
                        : isCompleted
                          ? "completed"
                          : "pending"
                    }`}
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

      <form onSubmit={handleSubmit} className="form-container">
        {currentStep === 1 && (
          <Step1
            control={control}
            stateId={stateId}
            districtId={districtId}
            filteredDistricts={filteredDistricts}
            filteredTehsils={filteredTehsils}
          />
        )}

        {currentStep === 2 && <Step2 control={control} />}

        {currentStep === 3 && <Step3 control={control} watch={watch} />}

        {currentStep === 4 && (
          <Step4
            watch={watch}
            transporterNameText={getTransporterNameText()}
            transporterTypeText={getTransporterTypeText()}
            panNumberText={getPanNumberText()}
            gstinText={getGstinText()}
            ownerNameText={getOwnerNameText()}
            mobileText={getMobileText()}
            addressText={getFullAddressText()}
          />
        )}

        {/* Stepper Footer Action Buttons */}
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
                label="Submit & Complete"
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
