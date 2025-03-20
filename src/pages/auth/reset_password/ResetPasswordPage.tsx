import { FormInput, UserAuthLayout } from "@/components";
import { useFormStatus } from "@/hooks/useFormStatus";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NotFoundPage } from "@/pages"; // adjust the path as necessary
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "sonner";
import { resetPassword } from "@/endpoints/userAuth";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const { token } = useParams();
  const navigate = useNavigate();
  const handleResetPassword = async () => {
    if (newPassword.length === 0)
      return toast.error("please enter your new password");
    if (confirmPassword.length === 0)
      return toast.error("please confirm your password");
    if (newPassword !== confirmPassword)
      return toast.error(
        "Passwords do not match. Please ensure both fields are identical."
      );

    startSubmitting();
    try {
      startSubmitting();
      const toastResult = toast.promise(
        resetPassword(newPassword, token as string),
        {
          loading: "Resetting your password...",
        }
      );

      // Await the result of the toast promise
      const data = await toastResult.unwrap();
      toast.success(`${data.message}`);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(`${err}`);
    } finally {
      stopSubmitting();
    }
  };

  // If the token is missing, render the custom 404 page
  if (!token) {
    return <NotFoundPage />;
  }

  return (
    <main className="flex min-h-full w-full max-w-md flex-col gap-2 justify-center">
      <header className="sm:w-full flex flex-col gap-2">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <p className="text-center text-sm font-semibold tracking-tight text-gray-600 dark:text-gray-300">
          Welcome Back!!, please update your password and you're good to go!
        </p>
      </header>

      <FormInput
        label="New Password* "
        placeholder="Enter your new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        id="new-password"
        name="new-password"
      />
      <FormInput
        label="Confirm Password* "
        placeholder="Re-Enter your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        id="confirm-password"
        name="confirm-password"
      />
      <button
        type="button"
        id="continue-button"
        disabled={isSubmitting}
        onClick={handleResetPassword}
        className="flex disabled:opacity-75 disabled:bg-indigo-500 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed cursor-pointer w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
      >
        {isSubmitting ? "sending..." : "continue"}
      </button>
    </main>
  );
};

export default UserAuthLayout(ResetPasswordPage);
