import { FormInput, UserAuthLayout } from "@/components";
import { initiateForgetPassword } from "@/endpoints/userAuth";
import { useFormStatus } from "@/hooks/useFormStatus";
import { validateEmail } from "@/utils";
import { getErrorMessage } from "@/utils/errorHandler";
import  { useState } from "react";
import { toast } from "sonner";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const handleForgetPassword = async () => {
    if (email.length === 0) return toast.error("Please Enter your email");
    if (!validateEmail(email)) return toast.error("Invalid email format");

    try {
      startSubmitting();
      const toastResult = toast.promise(initiateForgetPassword(email), {
        loading: "Sending Email...",
      });

      // Await the result of the toast promise
      const data = await toastResult.unwrap();
      console.log(data);
      toast.success(`${data.message}`);
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(`${err}`);
    } finally {
      stopSubmitting();
    }
  };

  return (
    <main className="flex min-h-full w-full max-w-md flex-col gap-2 justify-center">
      <header className="sm:w-full flex flex-col gap-2">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Forget Password
        </h2>
        <p className="text-center text-sm font-semibold tracking-tight text-gray-600 dark:text-gray-300">
          We’ll send a verification code to this email or phone number if it
          matches an existing LinkUp account.
        </p>
      </header>
      <FormInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        id="email"
        name="email"
      />
      <button
        type="button"
        id="continue-button"
        disabled={isSubmitting}
        onClick={handleForgetPassword}
        className="flex disabled:opacity-75 disabled:bg-indigo-500 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed cursor-pointer w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
      >
        {isSubmitting?'sending...':'continue'}
      </button>
    </main>
  );
};

export default UserAuthLayout(ForgetPasswordPage);
