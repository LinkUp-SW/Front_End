import { ReactElement, useState } from "react";

/**
 * Custom hook to manage a multi-step form.
 */
export function useMultiStepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  /**
   * Moves to the next step if available.
   */
  const nextStep = (): void => {
    setCurrentStepIndex((currentIndex) =>
      currentIndex < steps.length - 1 ? currentIndex + 1 : currentIndex
    );
  };

  /**
   * Moves to the previous step if available.
   */
  const previousStep = (): void => {
    setCurrentStepIndex((currentIndex) =>
      currentIndex > 0 ? currentIndex - 1 : currentIndex
    );
  };

  /**
   * Navigates to a specific step.
   * Throws an error if the provided index is out of bounds.
   */
  const goToStep = (stepIndex: number): void => {
    if (stepIndex < 0 || stepIndex >= steps.length) {
      throw new Error(`Step index ${stepIndex} is out of bounds`);
    }
    setCurrentStepIndex(stepIndex);
  };

  return {
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    nextStep,
    previousStep,
    goToStep,
    totalSteps: steps.length,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}
