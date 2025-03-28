import { useState, useEffect, useCallback, useRef } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components";
import { toast } from "sonner";
import { sendOTP, verifyOTP } from "@/endpoints/userAuth";
import { getErrorMessage } from "@/utils/errorHandler";
import EmailVerificationLayout from "./EmailVerificationLayout";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const didSend = useRef(false);
  const [userEmail, setUserEmail] = useState<string>("");

  // Get the user email from either 'user-signup-credentials' or 'user-email'
  useEffect(() => {
    const storedUserData = localStorage.getItem("user-signup-credentials");
    const storedUserEmail = localStorage.getItem("user-email");

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.email) {
          setUserEmail(parsedData.email);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    } else if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    } else {
      // If neither source is available, navigate back.
      window.history.back();
    }
  }, []);

  // Send OTP when a valid userEmail is set
  useEffect(() => {
    if (!userEmail) return;
    if (didSend.current) return;
    didSend.current = true;

    const handleSendOTP = async () => {
      try {
        await sendOTP(userEmail);
      } catch (error) {
        const err = getErrorMessage(error);
        toast.error(`Error: ${err}`);
      }
    };

    handleSendOTP();
  }, [userEmail]);

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  const handleOTPComplete = async (value: string) => {
    try {
      const response = toast.promise(verifyOTP(value, userEmail), {
        loading: "verifying OTP",
      });
      const data = await response.unwrap();

      toast.success(`${data.message}`);
      localStorage.removeItem("user-email");
      localStorage.removeItem("user-signup-credentials");
      setTimeout(() => {
        window.location.replace("/feed");
      }, 1500);
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(`Error: ${err}`);
      setOtp("");
    }
  };

  const handleResendCode = useCallback(async () => {
    if (isResending || resendTimer > 0) return;

    setIsResending(true);
    try {
      await sendOTP(userEmail);
      toast.success("A new verification code has been sent to your email!");
      setResendTimer(30);
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(`Error: ${err}`);
    } finally {
      setIsResending(false);
    }
  }, [isResending, resendTimer, userEmail]);

  useEffect(() => {
    if (resendTimer === 0) return;
    const intervalId = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [resendTimer]);

  if (!userEmail) return null;

  return (
    <div className="flex min-h-full w-full max-w-md flex-col justify-center items-center relative pt-4 px-4">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Confirm Your Email
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          We sent a code to <span className="font-semibold">{userEmail}</span>
        </p>
      </header>
      <div className="w-full flex justify-center mb-6">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={otp}
          id="otp-field"
          name="otpField"
          onChange={handleOTPChange}
          onComplete={handleOTPComplete}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResendCode}
            disabled={resendTimer > 0}
            id="resend-otp-button"
            className={`font-semibold ${
              resendTimer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:underline"
            }`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
          </button>
        </p>
      </div>
    </div>
  );
};

const EmailVerificationPage = () => (
  <EmailVerificationLayout>
    <EmailVerification />
  </EmailVerificationLayout>
);

export default EmailVerificationPage;
