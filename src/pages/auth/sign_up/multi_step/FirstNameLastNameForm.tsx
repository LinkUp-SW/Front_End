import { FormInput } from "@/components";
import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { validateName } from "@/utils";

type FirstNameLastNameData = {
  firstName: string;
  lastName: string;
};

type FirstNameLastNameProps = FirstNameLastNameData & {
  updateFields: (fields: Partial<FirstNameLastNameData>) => void;
  saveCredentials: () => void;
};

const FirstNameLastNameForm = ({
  firstName,
  lastName,
  updateFields,
  saveCredentials,
}: FirstNameLastNameProps) => {
  const navigate = useNavigate();
  const handleFirstnameLastnameSubmit = () => {
    if (firstName.length === 0)
      return toast.error("Please enter you First Name");
    if (lastName.length === 0)
      return toast.error("Please enter your Last Name");
    if (!validateName(firstName)) {
      return toast.error(
        "Please enter a valid first name (up to 15 characters, no special characters)."
      );
    }
    if (!validateName(lastName)) {
      return toast.error(
        "Please enter a valid last name (up to 15 characters, no special characters)."
      );
    }
    saveCredentials();
    return navigate("/signup/location");
  };
  return (
    <div className="sm:w-full">
      <div className="space-y-1">
        <FormInput
          label="First Name"
          placeholder="Enter your First Name"
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateFields({ firstName: e.target.value });
          }}
          type="text"
          id="first-name"
          name="firstName"
          limit={15}
        />
        <div className="w-full relative">
          <FormInput
            label="Last Name"
            placeholder="Enter your Last Name"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateFields({ lastName: e.target.value });
            }}
            id="last-name"
            name="lastName"
            limit={15}
          />
        </div>
        <div>
          <button
            type="button"
            id="continue-button"
            onClick={handleFirstnameLastnameSubmit}
            className="flex disabled:opacity-75 disabled:bg-indigo-500 disabled:cursor-not-allowed cursor-pointer w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstNameLastNameForm;
