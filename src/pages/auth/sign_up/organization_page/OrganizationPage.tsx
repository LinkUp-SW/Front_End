import { UserAuthLayout } from "@/components";
import { useState, useCallback } from "react";
import StudentForm from "./components/StudentForm";
import JobForm from "./components/JobForm";
import { handleSaveCredentials } from "@/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createUserAccount } from "@/endpoints/userAuth";
import { getErrorMessage } from "@/utils/errorHandler";
import { useFormStatus } from "@/hooks/useFormStatus";
import { UserStarterInterface } from "@/types";
import { useInterceptBackNavigation } from "@/hooks/useInterceptBackNavigation";

const OrganizationPage = () => {
  const [isStudent, setIsStudent] = useState(false);
  const navigate = useNavigate();
  const [partialUserStarterData, setPartialUserStarterData] = useState<
    Partial<UserStarterInterface>
  >({});
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  useInterceptBackNavigation();

  // Helper function to extract only the desired fields from stored credentials.
  const extractUserData = (data: Partial<UserStarterInterface>) => {
    const { email, password, firstName, lastName, city, country } = data;
    return { email, password, firstName, lastName, city, country };
  };

  // Function to check if a user is below 16 years old.
  function isUserBelow16(birthDate: Date): boolean {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age < 16;
  }

  const saveCredentials = useCallback(async () => {
    // Prevent multiple triggers.
    if (isSubmitting) return;

    // Validate required fields based on form type.
    if (isStudent) {
      if (
        !partialUserStarterData.school ||
        !partialUserStarterData.schoolStarterYear ||
        !partialUserStarterData.schoolEndYear
      ) {
        toast.error("Please complete all required fields in the student form.");
        return;
      }
      if (
        partialUserStarterData.is16OrAbove === false &&
        !partialUserStarterData.birthDate
      ) {
        toast.error("Please provide your birth date.");
        return;
      }
    } else {
      if (
        !partialUserStarterData.jobTitle ||
        !partialUserStarterData.employeeType ||
        !partialUserStarterData.recentCompany
      ) {
        toast.error("Please complete all required fields in the job form.");
        return;
      }
    }

    if (
      partialUserStarterData.is16OrAbove !== undefined &&
      partialUserStarterData.birthDate &&
      isUserBelow16(partialUserStarterData.birthDate)
    ) {
      toast.error("You must be at least 16 years old to use this service.");
      localStorage.removeItem("user-signup-credentials");
      setTimeout(() => {
        navigate("/signup");
      }, 2000);
      return;
    }

    // Start submitting to mimic API request.
    startSubmitting();

    const savedCredential = localStorage.getItem("user-signup-credentials");
    if (!savedCredential) {
      navigate("/signup");
      stopSubmitting();
      return;
    }
    //clean this code later!!

    const parsedCredentials = JSON.parse(savedCredential);
    const extractedData = extractUserData(parsedCredentials);

    // Overwrite localStorage with only the extracted data.
    localStorage.setItem(
      "user-signup-credentials",
      JSON.stringify(extractedData)
    );

    // Merge the current partial data with the isStudent flag.
    handleSaveCredentials({ ...partialUserStarterData, isStudent });
    const savedCredentialToBeSent = localStorage.getItem(
      "user-signup-credentials"
    );
    if (!savedCredentialToBeSent) return;
    const parsedCredentialsToBeSent = JSON.parse(savedCredentialToBeSent);
    console.log(parsedCredentialsToBeSent)

    try {
      const toastResult = toast.promise(
        createUserAccount(parsedCredentialsToBeSent), // Using the axios signin method.
        {
          loading: "Creating Account...",
          success: "Account Created!!",
          error: "Account creation failed. Please try again.",
        }
      );

      // Await the result of the toast promise.
      const data = await toastResult.unwrap();
      console.log("Submitted", data);
      if (data) {
        // Mimic API request delay.
        setTimeout(() => {
          navigate("/email-verification");
          stopSubmitting();
        }, 2000);
      }
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(`Failed to Create Account. Please try again. ${err}`);
      console.error("Sign in error:", error, err);
    } finally {
      stopSubmitting();
      // navigate("/email-verification");
    }
  }, [
    navigate,
    partialUserStarterData,
    isStudent,
    isSubmitting,
    startSubmitting,
    stopSubmitting,
  ]);

  return (
    <main className="flex min-h-full w-full max-w-md flex-col justify-center relative pt-4">
      <header className="sm:w-full flex flex-col gap-2">
        <h2 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Your Profile helps you discover new people and opportunities
        </h2>
      </header>
      {isStudent ? (
        <StudentForm setPartialUserStarterData={setPartialUserStarterData} />
      ) : (
        <JobForm setPartialUserStarterData={setPartialUserStarterData} />
      )}
      <div className="w-full space-y-2">
        <button
        id="i-am-student-button"
          onClick={() => setIsStudent((prev) => !prev)}
          className="w-full py-2 cursor-pointer px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
        >
          {isStudent ? "I'm not a student" : "I'm a student"}
        </button>
        <button
          type="button"
          onClick={saveCredentials}
          disabled={isSubmitting}
          id="continue-button"
          className="flex disabled:opacity-75 disabled:bg-indigo-500 disabled:cursor-not-allowed cursor-pointer w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
        >
          {isSubmitting ? "Please wait..." : "Continue"}
        </button>
      </div>
    </main>
  );
};

export default UserAuthLayout(OrganizationPage);
