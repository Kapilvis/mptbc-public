import { TabPanel, TabView } from "primereact/tabview";
import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import { Button, ButtonPanel } from "shared/components/buttons";
import "./FormWizard.css";

export interface WizardStep {
  label: string;
  icon?: string;
  content: ReactNode;
}

interface FormWizardProps {
  steps: WizardStep[];
  onComplete: () => Promise<void> | void;
  isSaving?: boolean;
  formKey?: number;
  isEdit?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLFormElement>) => void;
  triggerValidation?: (fields: string[]) => Promise<boolean>;
  onReset?: () => void;
}

export default function FormWizard({
  steps,
  onComplete,
  isSaving,
  formKey,
  isEdit,
  onKeyDown,
  triggerValidation,
  onReset,
}: FormWizardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxTabReached, setMaxTabReached] = useState(
    isEdit ? steps.length - 1 : 0,
  );
  const tabRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isEdit) {
      setMaxTabReached(steps.length - 1);
    }
  }, [isEdit, steps.length]);

  const getFieldsInStep = (index: number): string[] => {
    const el = tabRefs.current[index];
    if (!el) return [];

    const elements = el.querySelectorAll("[id], [name]");
    const names = Array.from(elements)
      .map((e) => e.getAttribute("name") || e.getAttribute("id"))
      .filter(
        (n): n is string =>
          Boolean(n) && typeof n === "string" && !n.startsWith("pr_"),
      )
      .map((n) => n.replace(/_focus$/, "").replace(/_input$/, ""));

    return Array.from(new Set(names));
  };

  const handleNext = async () => {
    let isValid = true;

    if (triggerValidation) {
      const fields = getFieldsInStep(activeIndex);
      if (fields.length > 0) {
        isValid = await triggerValidation(fields);
      }
    }

    if (isValid) {
      const nextIndex = activeIndex + 1;
      setMaxTabReached((prev) => Math.max(prev, nextIndex));
      setActiveIndex(nextIndex);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex <= activeIndex) {
      setActiveIndex(stepIndex);
      return;
    }

    let allValid = true;
    for (let i = activeIndex; i < stepIndex; i++) {
      if (triggerValidation) {
        const fields = getFieldsInStep(i);
        if (fields.length > 0) {
          const isValid = await triggerValidation(fields);
          if (!isValid) {
            allValid = false;
            setActiveIndex(i);
            break;
          }
        }
      }
    }

    if (allValid) {
      setMaxTabReached((prev) => Math.max(prev, stepIndex));
      setActiveIndex(stepIndex);
    }
  };

  const handleReset = () => {
    if (onReset) onReset();
    setActiveIndex(0);
    setMaxTabReached(isEdit ? steps.length - 1 : 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <form onKeyDown={handleKeyDown} key={formKey}>
      <div className="wizard-steps-container">
        <div className="wizard-progress-track">
          <div
            className="wizard-progress-fill"
            style={{ width: `${(maxTabReached / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isCompleted = idx < activeIndex || idx <= maxTabReached;
          const isDisabled = idx > maxTabReached;

          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => handleStepClick(idx)}
              className={`wizard-step ${isActive ? "active" : ""} ${isCompleted && !isActive ? "completed" : ""}`}
            >
              <div className="wizard-step-circle">
                <i
                  className={
                    step.icon
                      ? step.icon.startsWith("pi ")
                        ? step.icon
                        : `pi pi-${step.icon}`
                      : "pi pi-circle"
                  }
                />
              </div>
              <span className="wizard-step-label">{step.label}</span>
            </button>
          );
        })}
      </div>

      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {steps.map((step, idx) => (
          <TabPanel key={idx} header={step.label}>
            <div
              className="wizard-tab-content"
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
            >
              {step.content}
            </div>
          </TabPanel>
        ))}
      </TabView>

      <div className="wizard-footer-wrapper">
        <ButtonPanel>
          <div className="wizard-footer-container">
            <div className="wizard-footer-actions flex items-center gap-3">
              {activeIndex > 0 && (
                <Button
                  type="button"
                  label="Back"
                  icon="arrow-left"
                  variant="outlined"
                  onClick={handleBack}
                  disabled={isSaving}
                />
              )}
              <Button
                type="button"
                label="Reset"
                icon="refresh"
                variant="outlined"
                onClick={handleReset}
                disabled={isSaving}
              />
              {activeIndex < steps.length - 1 ? (
                <Button
                  type="button"
                  label="Next"
                  icon="arrow-right"
                  variant="primary"
                  onClick={handleNext}
                />
              ) : (
                <Button
                  type="button"
                  label="Save"
                  icon="save"
                  variant="primary"
                  onClick={onComplete}
                  isLoading={isSaving}
                />
              )}
            </div>
          </div>
        </ButtonPanel>
      </div>
    </form>
  );
}
