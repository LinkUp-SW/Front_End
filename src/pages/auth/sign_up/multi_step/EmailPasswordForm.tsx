import React from "react";
import { FormInput } from "@/components";
import googleSvg from "@/assets/google.svg";
import { toast } from "sonner";
import { validateEmail, validatePassword } from "@/utils";
import { initiateGoogleAuth, verifyEmail } from "@/endpoints/userAuth";
import { getErrorMessage } from "@/utils/errorHandler";

type EmailPasswordData = {
  email: string;
  password: string;
};

type EmailPasswordProps = EmailPasswordData & {
  updateFields: (fields: Partial<EmailPasswordData>) => void;
  nextStep?: () => void; // now optional
};

const EmailPasswordForm = ({
  email,
  password,
  updateFields,
  nextStep = () => {}, // default no-op if not provided
}: EmailPasswordProps): React.ReactElement => {
  const handleNextStep = async () => {
    if (email.length === 0) return toast.error("please enter your email");
    if (!validateEmail(email))
      return toast.error("please enter a valid email ");

    try {
      await verifyEmail(email);
    } catch (error) {
      return toast.error(getErrorMessage(error));
    }
    if (password.length === 0) return toast.error("please enter your password");
    const passwordError = validatePassword(password);
    if (passwordError) {
      return toast.error(passwordError);
    }
    nextStep();
  };
  return (
    <section className="sm:w-full">
      <div className="space-y-1">
        <FormInput
          label="Email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateFields({ email: e.target.value });
          }}
          type="text"
          id="email"
          name="email"
        />
        <div className="w-full relative">
          <FormInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateFields({ password: e.target.value });
            }}
            type="password"
            id="password"
            name="password"
          />
        </div>
        <div>
          <button
            type="button"
            id="continue-button"
            onClick={handleNextStep}
            className="flex disabled:opacity-75 disabled:bg-indigo-500 disabled:cursor-not-allowed cursor-pointer w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
          >
            Continue
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-full h-[0.15rem] bg-gray-500 dark:bg-gray-400 rounded-full" />
          <p className="text-gray-500 dark:text-gray-400">or</p>
          <div className="w-full h-[0.15rem] bg-gray-500 dark:bg-gray-400 rounded-full" />
        </div>
        <button
          type="button"
          id="continue-with-google-button"
          onClick={initiateGoogleAuth}
          className="flex h-9 w-full items-center justify-center space-x-2 rounded-full cursor-pointer hover:opacity-85 transition-all duration-300 ease-in-out bg-blue-500 text-white py-3 px-6 text-base font-semibold dark:bg-blue-600"
        >
          <img
            src={googleSvg}
            alt="Google Logo"
            className="w-7 aspect-square object-contain bg-white p-1 rounded-full dark:bg-gray-100"
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </section>
  );
};

export default EmailPasswordForm;
