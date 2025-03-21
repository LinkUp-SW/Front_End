// useFormStatus.ts
import { useState } from "react";

/**
 * A simple custom hook that tracks whether a form is currently submitting.
 * You can expand this to include error states, success states, etc.
 */
export function useFormStatus() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function startSubmitting() {
    setIsSubmitting(true);
  }

  function stopSubmitting() {
    setIsSubmitting(false);
  }

  return {
    isSubmitting,
    startSubmitting,
    stopSubmitting,
  };
}
