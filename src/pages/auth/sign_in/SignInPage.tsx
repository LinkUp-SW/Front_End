import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { UserAuthLayout } from "@/components";
import { FormInput } from "@/components";
import { useFormStatus } from "@/hooks/useFormStatus";
import { Link } from "react-router-dom";
import googleSvg from "@/assets/google.svg";
// import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { initiateGoogleAuth, signin } from "@/endpoints/userAuth";
import { validateEmail } from "@/utils";
import { getErrorMessage } from "@/utils/errorHandler";
import Cookies from "js-cookie";

const SignInPage: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  useEffect(() => {
    localStorage.removeItem("user-email");
  }, []);

  // Helper function to validate the identifier (email or phone)
  const validateIdentifier = (identifier: string): boolean => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{7,15}$/;
    return validateEmail(identifier) || phoneRegex.test(identifier);
  };

  // Helper function to validate the form
  const validateForm = (
    identifier: string,
    password: string
    // recaptchaToken: string | null
  ) => {
    if (!validateIdentifier(identifier)) {
      toast.error("Please enter a valid email address or phone number.");
      return false;
    }
    if (password.length === 0) {
      toast.error("Please enter your password");
      return false;
    }
    // if (!recaptchaToken) {
    //   toast.error("Please complete the captcha.");
    //   return false;
    // }
    return true;
  };

  // Function to handle the form submission
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    identifier: string,
    password: string,
    // recaptchaToken: string | null,
    startSubmitting: () => void,
    stopSubmitting: () => void
  ): Promise<void> => {
    event.preventDefault();

    try {
      if (!validateForm(identifier, password)) {
        return;
      }
      startSubmitting();

      //using real server endpoint
      // Wrap the signin method with toast.promise for success/error handling
      const toastResult = toast.promise(
        signin(identifier, password), // Using the axios signin method
        {
          loading: "Signing in...",
        }
      );

      // Await the result of the toast promise
      const data = await toastResult.unwrap();
      if (!data.user.isVerified) {
        localStorage.setItem("user-email", data.user.email);
        return window.location.replace("/email-verification");
      }
      toast.success("Signed in successfully!");
      Cookies.set("linkup_user_type", data.user.isAdmin ? "admin" : "user");
      if (data.user.isAdmin) {
        setTimeout(() => {
          window.location.replace("/admin/dashboard");
        }, 2000);
      } else {
        setTimeout(() => {
          window.location.replace("/feed");
        }, 2000);
      }
    } catch (error) {
      const err = getErrorMessage(error);
      setTimeout(() => {
        toast.error(`${err}`);
      }, 500);
      // toast.error(`${err}`);
      console.error("Sign in error:", error, err);
    } finally {
      stopSubmitting();
    }
  };

  return (
    <div className="flex min-h-full w-full max-w-md flex-col justify-center">
      <div className="sm:w-full flex flex-col gap-2">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <button
          id="continue-with-google-button"
          onClick={initiateGoogleAuth}
          className="flex h-9 w-full items-center justify-center space-x-2 rounded-full cursor-pointer hover:opacity-85 transition-all duration-300 ease-in-out bg-blue-500 text-white py-3 px-6 text-base font-semibold dark:bg-blue-600"
        >
          <img
            src={googleSvg}
            alt="Google Logo"
            className="w-7 aspect-square object-contain bg-white p-1 rounded-full dark:bg-gray-100"
          />
          <span className="sm:text-base text-xs">Continue with Google</span>
        </button>
        <div className="flex gap-2 items-center">
          <div className="w-full h-[0.15rem] bg-gray-500 dark:bg-gray-400 rounded-full" />
          <p className="text-gray-500 dark:text-gray-400">or</p>
          <div className="w-full h-[0.15rem] bg-gray-500 dark:bg-gray-400 rounded-full" />
        </div>
      </div>
      <div className="sm:w-full">
        <form
          onSubmit={(event) =>
            handleSubmit(
              event,
              identifier,
              password,
              // recaptchaToken,
              startSubmitting,
              stopSubmitting
            )
          }
          className="space-y-2"
        >
          <FormInput
            label="Email or Phone"
            placeholder="Enter your email or phone number"
            value={identifier}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setIdentifier(e.target.value)
            }
            type="text"
            id="email-phone-identifier"
            name="emailPhoneIdentifier"
          />
          <div className="w-full relative">
            <FormInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              type="password"
              id="password"
              name="password"
            />
            <Link
              to="/forget-password"
              id="forget-password-link"
              className="text-sm absolute top-5 right-0 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center justify-between">
            {/* <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token: string | null) => setRecaptchaToken(token)}
            /> */}
          </div>
          <div>
            <button
              type="submit"
              id="login-button"
              disabled={isSubmitting}
              className="flex disabled:opacity-75 disabled:bg-indigo-500 disabled:cursor-not-allowed cursor-pointer w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Not a LinkUp member?{" "}
          <Link
            id="join-now-link"
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Join Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserAuthLayout(SignInPage);
