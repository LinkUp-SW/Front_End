import React, { useState, FormEvent, ChangeEvent } from "react";
import { UserAuthLayout } from "@/components";
import { FormInput } from "@/components";
import { useFormStatus } from "@/hooks/useFormStatus";
import { Link } from "react-router-dom";
import googleSvg from "@/assets/google.svg";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

const SignInPage: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Regex to validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regex to validate phone numbers (optional "+" prefix, 7-15 digits)
    const phoneRegex = /^\+?\d{7,15}$/;

    // Validate identifier
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      toast.error("Please enter a valid email address or phone number.");
      return;
    }

    // Ensure reCAPTCHA has been completed
    if (!recaptchaToken) {
      toast.error("Please complete the captcha.");
      return;
    }

    startSubmitting();
    try {
      // const fakePromise = new Promise<void>((resolve, reject) => {
      //   // Simulate a 2-second asynchronous operation.
      //   setTimeout(() => {
      //     // Uncomment one of the following lines to simulate success or error:
      //     resolve();
      //     // reject("Error");
      //   }, 2000);
      // });
      // // Pass the promise directly to toast.promise
      // const toastResult = toast.promise(fakePromise, {
      //   loading: "Loading...",
      //   success: "Login successfully",
      //   error: "Sign in failed. Please try again.",
      // });
      // // Await the promise using the unwrap() method.
      // await toastResult.unwrap();
      // Create the fetch promise for your actual endpoint
      // const serverPromise = fetch("/api/signin", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ identifier, password, recaptchaToken }),
      // }).then((res) => {
      //   if (!res.ok) {
      //     throw new Error("Sign in failed. Please try again.");
      //   }
      //   return res.json();
      // });
      // // Wrap the promise with toast.promise and await its result using unwrap()
      // const toastResult = toast.promise(serverPromise, {
      //   loading: "Signing in...",
      //   success: "Signed in successfully!",
      //   error: "Sign in failed. Please try again.",
      // });
      // const data = await toastResult.unwrap();
      //     console.log("Submitted", data);
    } catch (error) {
      console.error("Sign in error:", error);
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
        <button className="flex h-9 w-full items-center justify-center space-x-2 rounded-full cursor-pointer hover:opacity-85 transition-all duration-300 ease-in-out bg-blue-500 text-white py-3 px-6 text-base font-semibold dark:bg-blue-600">
          <i>
            <img
              src={googleSvg}
              alt="Google Logo"
              className="w-7 aspect-square object-contain bg-white p-1 rounded-full dark:bg-gray-100"
            />
          </i>
          <span>Continue with Google</span>
        </button>
        <div className="flex gap-2 items-center">
          <div className="w-full h-[0.15rem] bg-gray-500 dark:bg-gray-400 rounded-full" />
          <p className="text-gray-500 dark:text-gray-400">or</p>
          <div className="w-full h-[0.15rem] bg-gray-500 dark:bg-gray-400 rounded-full" />
        </div>
      </div>
      <div className="sm:w-full">
        <form onSubmit={handleSubmit} className="space-y-2">
          <FormInput
            label="Email or Phone"
            placeholder="Enter your email or phone number"
            value={identifier}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setIdentifier(e.target.value)
            }
            type="text"
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
            />
            <Link
              to="#"
              className="text-sm absolute top-5 right-0 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token: string | null) => setRecaptchaToken(token)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex disabled:opacity-75 cursor-pointer w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Not a LinkUp member?{" "}
          <Link
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
