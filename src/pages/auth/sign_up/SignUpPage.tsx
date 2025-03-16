import React, { useState } from "react";
import { UserAuthLayout } from "@/components";
import { useMultiStepForm } from "@/hooks/useMultistepForm";
import { EmailPasswordForm, FirstNameLastNameForm } from "./multi_step";
import { GrFormPrevious } from "react-icons/gr";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const INITIAL_USER_CREDENTIALS: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const SignUpPage = () => {
  const [userCredentials, setUserCredentials] = useState<FormData>(
    INITIAL_USER_CREDENTIALS
  );

  // Update the user credentials state with new field values.
  const updateFields = (fields: Partial<FormData>) => {
    setUserCredentials((prev) => ({ ...prev, ...fields }));
  };

  const saveCredentials = () => {
    const savedCredential = localStorage.getItem("user-signup-credentials");

    if (!savedCredential) {
      const toBeStoredUserCredentials = JSON.stringify(userCredentials);
      return localStorage.setItem(
        "user-signup-credentials",
        toBeStoredUserCredentials
      );
    }

    // Convert the string from localStorage into an object
    const parsedCredentials = JSON.parse(savedCredential);
    // Merge the parsed credentials with the new userCredentials
    const newToBeStoredCredentials = {
      ...parsedCredentials,
      ...userCredentials,
    };

    // Save the updated credentials back to localStorage as a string
    localStorage.setItem(
      "user-signup-credentials",
      JSON.stringify(newToBeStoredCredentials)
    );
  };

  // Initialize the multi-step form without passing nextStep to the element.
  const multiStepForm = useMultiStepForm([
    <EmailPasswordForm
      {...userCredentials}
      updateFields={updateFields}
      key="emailPasswordForm"
    />,
    <FirstNameLastNameForm
      {...userCredentials}
      updateFields={updateFields}
      saveCredentials={saveCredentials}
      key="firstNameLastNameForm"
    />,
  ]);

  // If the current step is EmailPasswordForm, clone it to inject the nextStep callback.
  let currentStepWithProps = multiStepForm.currentStep;
  if (
    React.isValidElement(multiStepForm.currentStep) &&
    multiStepForm.currentStep.type === EmailPasswordForm
  ) {
    currentStepWithProps = React.cloneElement(
      multiStepForm.currentStep as React.ReactElement<
        React.ComponentProps<typeof EmailPasswordForm>
      >,
      { nextStep: multiStepForm.nextStep }
    );
  }

  return (
    <main className="flex min-h-full w-full max-w-md flex-col justify-center relative pt-4">
      {!multiStepForm.isFirstStep && (
        <button
          onClick={multiStepForm.previousStep}
          className="cursor-pointer absolute text-lg dark:text-gray-300 font-semibold top-[-1.5rem] inline-flex items-center"
        >
          <GrFormPrevious size={30} /> <span>back</span>
        </button>
      )}
      <header className="sm:w-full flex flex-col gap-2">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Make the most of your professional life
        </h2>
      </header>
      {currentStepWithProps}
    </main>
  );
};

export default UserAuthLayout(SignUpPage);
