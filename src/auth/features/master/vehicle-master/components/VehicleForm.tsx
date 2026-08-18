import { useState, useEffect } from "react";
import { Button } from "shared/components/buttons";
import { ToastService } from "services";
import { Loader } from "shared/components/progress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useVehicleRegistrationForm } from "./form.hook";
import "./VehicleForm.css";

interface VehicleFormProps {
  onSubmit: (data: Transportation.Vehicle) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Transportation.Vehicle>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function VehicleForm({
  onSubmit,
  fetchData,
  isSaving,
}: VehicleFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [defaultVals, setDefaultVals] = useState<
    Partial<Transportation.VehicleForm>
  >({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Mapped initial default values resolver for Edit mode
  useEffect(() => {
    async function loadData() {
      if (!fetchData) return;
      setIsLoadingForm(true);
      try {
        const veh =
          typeof fetchData === "function" ? await fetchData() : fetchData;
        if (veh) {
          setDefaultVals({
            ...veh,
            capacity: Number(veh.capacity),
            manufacturingYear: Number(veh.manufacturingYear),
          });
        }
      } catch {
        ToastService.error("Failed to load vehicle details");
      } finally {
        setIsLoadingForm(false);
      }
    }
    loadData();
  }, [fetchData]);

  const handleFormSubmit = async (formData: Transportation.VehicleForm) => {
    const mappedVehicle: Transportation.Vehicle = {
      ...formData,
      vehicleId: formData.vehicleId || 0,
      capacity: Number(formData.capacity),
      manufacturingYear: Number(formData.manufacturingYear),
      transporterId: Number(formData.transporterId),
    };

    await onSubmit(mappedVehicle);
  };

  const { handleSubmit, watch, control, reset, setValue } =
    useVehicleRegistrationForm(handleFormSubmit, defaultVals);

  // Sync default values once they load
  useEffect(() => {
    if (Object.keys(defaultVals).length > 0) {
      reset(defaultVals);
    }
  }, [defaultVals, reset]);

  const steps = [
    { number: 1, label: "Core Details" },
    { number: 2, label: "Structural & Lease" },
    { number: 3, label: "Certificates & Expiries" },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleSaveDraft = () => {
    ToastService.success("Vehicle registration details saved as draft!");
  };

  // Helper text builders for step 3 review card
  const getRegistrationNoText = () => watch("registrationNo") || "";
  const getCategoryText = () => watch("category") || "";
  const getCapacityText = () => Number(watch("capacity") || 0);
  const getOwnershipText = () => watch("ownershipStatus") || "";
  const getTransporterIdVal = () => Number(watch("transporterId") || 0);

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
                    if (s.number < currentStep) {
                      setCurrentStep(s.number);
                    } else if (s.number > currentStep) {
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
          <Step1 control={control} watch={watch} setValue={setValue} />
        )}

        {currentStep === 2 && <Step2 control={control} watch={watch} />}

        {currentStep === 3 && (
          <Step3
            control={control}
            watch={watch}
            registrationNoText={getRegistrationNoText()}
            categoryText={getCategoryText()}
            capacityText={getCapacityText()}
            ownershipText={getOwnershipText()}
            transporterIdVal={getTransporterIdVal()}
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
            {currentStep < 3 ? (
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
                label="Submit & Register"
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
