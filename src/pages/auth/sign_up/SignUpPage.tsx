import React, { useEffect, useState } from "react";
import { UserAuthLayout } from "@/components";
import { useMultiStepForm } from "@/hooks/useMultistepForm";
import { EmailPasswordForm, FirstNameLastNameForm } from "./multi_step";
import { GrFormPrevious } from "react-icons/gr";
import { handleSaveCredentials } from "@/utils";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    localStorage.removeItem("user-signup-credentials");
  }, []);

  // Update the user credentials state with new field values.
  const updateFields = (fields: Partial<FormData>) => {
    setUserCredentials((prev) => ({ ...prev, ...fields }));
  };

  const saveCredentials = () => {
    handleSaveCredentials(userCredentials);
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
          id="navigate-back-button"
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
      <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
        Already a member?{" "}
        <Link
          id="login-now-link"
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Login Now
        </Link>
      </p>
    </main>
  );
};

export default UserAuthLayout(SignUpPage);
